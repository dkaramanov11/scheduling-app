package com.daniel.scheduling.timeslot.dto;

import com.daniel.scheduling.timeslot.TimeSlot;

import java.time.Instant;

public record TimeSlotResponse(
        Long id,
        Instant startAt,
        Instant endAt,
        Integer durationMinutes
) {
    // Converts a TimeSlot entity into a response DTO.
    public static TimeSlotResponse from(TimeSlot timeSlot) {
        return new TimeSlotResponse(
                timeSlot.getId(),
                timeSlot.getStartAt(),
                timeSlot.getEndAt(),
                timeSlot.getDurationMinutes()
        );
    }
}

/*
 * Example response JSON:
 * {
 *   "id": 1,
 *   "startAt": "2026-10-20T12:00:00Z",
 *   "endAt": "2026-10-20T12:30:00Z",
 *   "durationMinutes": 30
 * }
 *
 * Times are returned in UTC (Z).
 * The frontend displays them in the Europe/Skopje time zone.
 */