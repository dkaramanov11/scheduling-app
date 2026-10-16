package com.daniel.scheduling.timeslot.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateTimeSlotRequest(

        @NotNull(message = "Start time is required")
        LocalDateTime startAt,

        @NotNull(message = "Duration is required")
        @Min(value = 5, message = "Duration must be at least 5 minutes")
        @Max(value = 480, message = "Duration must not exceed 480 minutes")
        Integer durationMinutes

) {
}

/*
 * Expected request JSON:
 * {
 *   "startAt": "2026-10-20T14:00:00",
 *   "durationMinutes": 30
 * }
 *
 * startAt is interpreted in the Europe/Skopje time zone.
 */