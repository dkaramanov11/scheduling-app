package com.daniel.scheduling.calendar;

import com.daniel.scheduling.calendar.config.GoogleCalendarProperties;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;

@Component
public class GoogleCalendarTokenClient {

    private final GoogleCalendarProperties properties;
    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

    public GoogleCalendarTokenClient(
            GoogleCalendarProperties properties,
            ObjectMapper objectMapper
    ) {
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public Tokens exchangeCode(String code) {
        if (!properties.isConfigured()) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Google Calendar connection is not configured"
            );
        }

        if (code == null || code.isBlank()) {
            throw error(
                    HttpStatus.BAD_REQUEST,
                    "Google authorization code is missing"
            );
        }

        String body = "grant_type=authorization_code"
                + "&code=" + encode(code)
                + "&client_id=" + encode(properties.getClientId())
                + "&client_secret=" + encode(properties.getClientSecret())
                + "&redirect_uri=" + encode(properties.getRedirectUri());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://oauth2.googleapis.com/token"))
                .timeout(Duration.ofSeconds(15))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
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
                    "Google Calendar connection timed out. Please try again."
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();

            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Google Calendar connection was interrupted"
            );
        } catch (IOException exception) {
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Google Calendar is temporarily unavailable"
            );
        }

        if (response.statusCode() != 200) {
            throw error(
                    HttpStatus.BAD_GATEWAY,
                    "Could not complete Google Calendar connection. Please reconnect."
            );
        }

        try {
            var json = objectMapper.readTree(response.body());

            String accessToken = json.path("access_token").asText("");
            String refreshToken = json.path("refresh_token").asText("");
            String tokenType = json.path("token_type").asText("");
            String scope = json.path("scope").asText("");
            long expiresIn = json.path("expires_in").asLong(0);

            if (accessToken.isBlank()
                    || !"Bearer".equalsIgnoreCase(tokenType)
                    || expiresIn <= 0
                    || expiresIn > 86400) {
                throw new IllegalArgumentException();
            }

            return new Tokens(
                    accessToken,
                    refreshToken,
                    Instant.now().plusSeconds(expiresIn),
                    scope
            );
        } catch (RuntimeException exception) {
            throw error(
                    HttpStatus.BAD_GATEWAY,
                    "Google returned an invalid connection response"
            );
        }
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static ResponseStatusException error(
            HttpStatus status,
            String message
    ) {
        return new ResponseStatusException(status, message);
    }

    // Internal result: never return this object from a controller.
    @Getter
    public static final class Tokens {

        private final String accessToken;
        private final String refreshToken;
        private final Instant expiresAt;
        private final String scope;

        public Tokens(
                String accessToken,
                String refreshToken,
                Instant expiresAt,
                String scope
        ) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.expiresAt = expiresAt;
            this.scope = scope;
        }
    }
}