package com.daniel.scheduling.timeslot.dto;

import com.daniel.scheduling.timeslot.TimeSlot;
import com.daniel.scheduling.timeslot.enums.TimeSlotStatus;

import java.time.Instant;

/*
 * Example response item:
 * {
 *   "id": 17,
 *   "startAt": "2026-11-10T15:00:00Z",
 *   "endAt": "2026-11-10T16:00:00Z",
 *   "durationMinutes": 60,
 *   "status": "BOOKED",
 *   "cancelledAt": null
 * }
 *
 * Times are returned in UTC (Z).
 */
public record TimeSlotManagementResponse(
        Long id,
        Instant startAt,
        Instant endAt,
        Integer durationMinutes,
        TimeSlotStatus status,
        Instant cancelledAt,
        Long bookingId
) {

    public static TimeSlotManagementResponse from(
            TimeSlot timeSlot,
            Long bookingId
    ) {
        return new TimeSlotManagementResponse(
                timeSlot.getId(),
                timeSlot.getStartAt(),
                timeSlot.getEndAt(),
                timeSlot.getDurationMinutes(),
                timeSlot.getStatus(),
                timeSlot.getCancelledAt(),
                bookingId
        );
    }
}