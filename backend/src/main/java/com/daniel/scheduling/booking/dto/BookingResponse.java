package com.daniel.scheduling.booking.dto;

import com.daniel.scheduling.booking.Booking;
import com.daniel.scheduling.timeslot.dto.TimeSlotResponse;

import java.time.Instant;

/*
 * Example response JSON:
 * {
 *   "id": 1,
 *   "timeSlot": {
 *     "id": 1,
 *     "startAt": "2026-10-20T12:00:00Z",
 *     "endAt": "2026-10-20T12:30:00Z",
 *     "durationMinutes": 30
 *   },
 *   "customerName": "Daniel",
 *   "customerEmail": "daniel@example.com",
 *   "createdAt": "2026-10-18T13:00:00Z"
 * }
 *
 * Times are returned in UTC (Z).
 */
public record BookingResponse(
        Long id,
        TimeSlotResponse timeSlot,
        String customerName,
        String customerEmail,
        Instant createdAt
) {

    // Converts a Booking entity into a response DTO.
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                TimeSlotResponse.from(booking.getTimeSlot()),
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getCreatedAt()
        );
    }
}