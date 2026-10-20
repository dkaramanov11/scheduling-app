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

    private static final List<String> TOPICS = List.of(
            "karate history and Okinawan origins",
            "Japanese karate terminology",
            "kata and its role in karate",
            "kumite and competition",
            "dojo etiquette and traditions",
            "karate styles",
            "kihon and fundamental techniques",
            "karate uniforms and belt systems"
    );

    public KarateFactResponse generate() {
        if (!properties.isConfigured()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Fact generation is currently unavailable."
            );
        }

        requestLimiter.acquire();

        String topic = TOPICS.get(
                ThreadLocalRandom.current().nextInt(TOPICS.size())
        );

        String prompt = """
                Give one interesting, well-established karate fact about: %s.

                Rules:
                - Write in English.
                - Return one short sentence, at most 25 words.
                - Choose a specific educational fact, not a generic description.
                - Avoid myths, disputed claims, and unsupported statistics.
                - If a detail varies by karate style, identify the style
                  or clearly state that it varies.
                - Do not give medical advice or instructions for hurting someone.
                - No encouragement, greetings, or promotional text.
                - Do not start with "Did you know".
                - Return plain text on one line, without headings or Markdown.
                """.formatted(topic);

        String fact = geminiClient.generate(prompt);

        if (fact == null || fact.isBlank()) {
            throw unsuitableFact();
        }

        fact = fact.strip();

        if (fact.contains("*")
                || fact.contains("#")
                || fact.contains("`")
                || fact.contains("\n")
                || fact.contains("\r")
                || fact.split("\\s+").length > 30) {
            throw unsuitableFact();
        }

        return new KarateFactResponse(fact);
    }

    private ResponseStatusException unsuitableFact() {
        return new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "The AI service returned an unsuitable fact. Please try again later."
        );
    }
}