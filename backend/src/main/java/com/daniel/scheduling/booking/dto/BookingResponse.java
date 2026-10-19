package com.daniel.scheduling.booking.dto;

import com.daniel.scheduling.booking.Booking;
import com.daniel.scheduling.booking.enums.ExperienceLevel;
import com.daniel.scheduling.booking.enums.TrainingFocus;
import com.daniel.scheduling.timeslot.dto.TimeSlotResponse;

import java.time.Instant;

/*
 * Example response JSON:
 * {
 *   "id": 1,
 *   "timeSlot": {
 *     "id": 1,
 *     "startAt": "2026-11-01T13:00:00Z",
 *     "endAt": "2026-11-01T13:30:00Z",
 *     "durationMinutes": 30
 *   },
 *   "customerName": "Daniel",
 *   "customerEmail": "daniel@example.com",
 *   "trainingFocus": "KATA",
 *   "experienceLevel": "BEGINNER",
 *   "createdAt": "2026-10-19T18:00:00Z"
 * }
 *
 * Training details may be null.
 * Times are returned in UTC (Z).
 */
public record BookingResponse(
        Long id,
        TimeSlotResponse timeSlot,
        String customerName,
        String customerEmail,
        TrainingFocus trainingFocus,
        ExperienceLevel experienceLevel,
        Instant createdAt
) {

    // Converts a Booking entity into a response DTO.
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                TimeSlotResponse.from(booking.getTimeSlot()),
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getTrainingFocus(),
                booking.getExperienceLevel(),
                booking.getCreatedAt()
        );
    }
}