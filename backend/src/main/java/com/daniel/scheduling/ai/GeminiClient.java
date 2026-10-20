package com.daniel.scheduling.ai;

import com.daniel.scheduling.ai.config.GeminiProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private final GeminiProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GeminiClient(
            GeminiProperties properties,
            ObjectMapper objectMapper
    ) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(
                        properties.getConnectTimeoutSeconds()
                ))
                .followRedirects(HttpClient.Redirect.NEVER)
                .build();
    }

    public String generate(String prompt) {
        if (!properties.isConfigured()) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Fact generation is currently unavailable."
            );
        }

        String model = properties.getModel().strip();

        if (!model.matches("[a-zA-Z0-9._-]+")) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Fact generation is currently unavailable."
            );
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "maxOutputTokens", 200,
                        "temperature", 0.7,
                        "responseMimeType", "text/plain"
                )
        );

        String requestBody;

        try {
            requestBody = objectMapper.writeValueAsString(body);
        } catch (RuntimeException exception) {
            throw error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "The fact request could not be prepared."
            );
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(
                        "https://generativelanguage.googleapis.com/v1beta/models/"
                                + model + ":generateContent"
                ))
                .timeout(Duration.ofSeconds(
                        properties.getRequestTimeoutSeconds()
                ))
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", properties.getApiKey().strip())
                .POST(HttpRequest.BodyPublishers.ofString(
                        requestBody,
                        StandardCharsets.UTF_8
                ))
                .build();

        HttpResponse<String> response;

        try {
            response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)
            );
        } catch (HttpTimeoutException exception) {
            throw error(
                    HttpStatus.GATEWAY_TIMEOUT,
                    "Fact generation took too long. Please try again later."
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();

            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Fact generation was interrupted. Please try again later."
            );
        } catch (IOException exception) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The AI service is temporarily unavailable."
            );
        }

        if (response.statusCode() == 429) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The AI service quota is temporarily exhausted. Please try again later."
            );
        }

        if (response.statusCode() != 200) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The AI service is currently unavailable. Please try again later."
            );
        }

        return extractText(response.body());
    }

    private String extractText(String body) {
        String text;

        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode candidate = root.path("candidates").path(0);

            if (!"STOP".equals(candidate.path("finishReason").asText())) {
                throw error(
                        HttpStatus.BAD_GATEWAY,
                        "The AI service did not return a complete fact."
                );
            }

            StringBuilder result = new StringBuilder();

            for (JsonNode part : candidate.path("content").path("parts")) {
                if (!part.path("thought").asBoolean(false)
                        && part.path("text").isString()) {
                    result.append(part.path("text").asText());
                }
            }

            text = result.toString().strip();
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            throw error(
                    HttpStatus.BAD_GATEWAY,
                    "The AI service returned an invalid response."
            );
        }

        if (text.isBlank() || text.length() > 1000) {
            throw error(
                    HttpStatus.BAD_GATEWAY,
                    "The AI service did not return a usable fact."
            );
        }

        return text;
    }

    private ResponseStatusException error(
            HttpStatus status,
            String message
    ) {
        return new ResponseStatusException(status, message);
    }
}