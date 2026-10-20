package com.daniel.scheduling.calendar;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class GoogleCalendarClient {

    private final GoogleCalendarConnectionService connectionService;
    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

    public GoogleCalendarClient(
            GoogleCalendarConnectionService connectionService,
            ObjectMapper objectMapper
    ) {
        this.connectionService = connectionService;
        this.objectMapper = objectMapper;
    }

    public List<CalendarBusyPeriod> findBusyPeriods(
            Instant from,
            Instant to
    ) {
        if (from == null || to == null || !from.isBefore(to)) {
            throw new IllegalArgumentException(
                    "Calendar query must have a valid time range"
            );
        }

        String accessToken = connectionService.getValidAccessToken();

        String body = objectMapper.writeValueAsString(Map.of(
                "timeMin", from.toString(),
                "timeMax", to.toString(),
                "items", List.of(Map.of("id", "primary"))
        ));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(
                        "https://www.googleapis.com/calendar/v3/freeBusy"
                ))
                .timeout(Duration.ofSeconds(15))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + accessToken)
                .POST(HttpRequest.BodyPublishers.ofString(
                        body,
                        StandardCharsets.UTF_8
                ))
                .build();

        HttpResponse<String> response;

        try {
            response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString(
                            StandardCharsets.UTF_8
                    )
            );
        } catch (HttpTimeoutException exception) {
            throw unavailable(
                    "Calendar availability check timed out. Please try again."
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();

            throw unavailable(
                    "Calendar availability check was interrupted"
            );
        } catch (IOException exception) {
            throw unavailable(
                    "Calendar availability could not be checked. Please try again."
            );
        }

        if (response.statusCode() == 401) {
            throw unavailable(
                    "Google Calendar access is no longer valid. Please reconnect."
            );
        }

        if (response.statusCode() != 200) {
            throw unavailable(
                    "Calendar availability could not be checked. Please try again."
            );
        }

        return readBusyPeriods(response.body());
    }

    private List<CalendarBusyPeriod> readBusyPeriods(String body) {
        try {
            var root = objectMapper.readTree(body);
            var calendar = root.path("calendars").path("primary");
            var errors = calendar.path("errors");

            if (!calendar.isObject()
                    || (!errors.isMissingNode()
                    && (!errors.isArray() || !errors.isEmpty()))) {
                throw new IllegalArgumentException();
            }

            var busy = calendar.path("busy");

            if (!busy.isArray()) {
                throw new IllegalArgumentException();
            }

            List<CalendarBusyPeriod> periods = new ArrayList<>();

            for (var period : busy) {
                periods.add(new CalendarBusyPeriod(
                        Instant.parse(period.path("start").asText("")),
                        Instant.parse(period.path("end").asText(""))
                ));
            }

            return List.copyOf(periods);
        } catch (RuntimeException exception) {
            throw unavailable(
                    "Google Calendar availability could not be read. Please try again."
            );
        }
    }

    private static ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                message
        );
    }
}