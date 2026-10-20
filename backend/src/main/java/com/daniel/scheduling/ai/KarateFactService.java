package com.daniel.scheduling.ai;

import com.daniel.scheduling.ai.config.GeminiProperties;
import com.daniel.scheduling.ai.dto.KarateFactResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class KarateFactService {

    private final GeminiProperties properties;
    private final AiRequestLimiter requestLimiter;
    private final GeminiClient geminiClient;

    /*
     * Sources:
     * https://www.theworldgames.org/sports/Karate-22
     * https://olympic.ca/sports/karate/
     */
    private static final List<String> VERIFIED_FACTS = List.of(
            "The Japanese word karate means empty hand.",
            "Karate competition includes kata and kumite.",
            "Kata involves performing a sequence of karate techniques.",
            "Kumite is the sparring discipline of karate.",
            "Karate made its Olympic debut at the Tokyo 2020 Games."
    );

    public KarateFactResponse generate() {
        if (!properties.isConfigured()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Fact generation is currently unavailable."
            );
        }

        // Reserve quota before sending the request.
        requestLimiter.acquire();

        int index = ThreadLocalRandom.current()
                .nextInt(VERIFIED_FACTS.size());

        String selectedFact = VERIFIED_FACTS.get(index);

        String prompt = """
        Rewrite the supplied karate fact in English for a training website.

        Rules:
        - Return exactly one short sentence, at most 30 words.
        - Preserve the meaning and use only the supplied information.
        - Do not add encouragement, advice, greetings, or promotional text.
        - Do not start with "Did you know".
        - Return plain text on one line, without headings or Markdown.

        Supplied fact: %s
        """.formatted(selectedFact);

        String fact = geminiClient.generate(prompt);

        // Reject obvious formatting violations rather than showing Markdown.
        if (fact.contains("*")
                || fact.contains("#")
                || fact.contains("`")
                || fact.contains("\n")
                || fact.split("\\s+").length > 30) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The AI service returned an unsuitable fact. Please try again later."
            );
        }

        return new KarateFactResponse(fact);
    }
}