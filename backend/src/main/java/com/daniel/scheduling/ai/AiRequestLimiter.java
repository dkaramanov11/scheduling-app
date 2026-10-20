package com.daniel.scheduling.ai;

import com.daniel.scheduling.ai.config.GeminiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayDeque;
import java.util.Deque;

@Component
@RequiredArgsConstructor
public class AiRequestLimiter {

    private final GeminiProperties properties;

    private final Deque<Instant> recentRequests = new ArrayDeque<>();

    private LocalDate currentDay = LocalDate.now(ZoneOffset.UTC);
    private int dailyRequests;

    public synchronized void acquire() {
        Instant now = Instant.now();
        LocalDate today = now.atOffset(ZoneOffset.UTC).toLocalDate();

        if (!today.equals(currentDay)) {
            currentDay = today;
            dailyRequests = 0;
        }

        Instant cutoff = now.minus(Duration.ofMinutes(1));

        while (!recentRequests.isEmpty()
                && !recentRequests.peekFirst().isAfter(cutoff)) {
            recentRequests.removeFirst();
        }

        if (dailyRequests >= properties.getMaxRequestsPerDay()) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "The daily fact generation limit has been reached. Please try again tomorrow."
            );
        }

        if (recentRequests.size()
                >= properties.getMaxRequestsPerMinute()) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many fact requests. Please wait a minute and try again."
            );
        }

        recentRequests.addLast(now);
        dailyRequests++;
    }
}