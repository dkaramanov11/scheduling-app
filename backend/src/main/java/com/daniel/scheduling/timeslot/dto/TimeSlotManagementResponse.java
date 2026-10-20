package com.daniel.scheduling.timeslot.dto;

import com.daniel.scheduling.booking.dto.BookingSummaryResponse;
import com.daniel.scheduling.timeslot.TimeSlot;
import com.daniel.scheduling.timeslot.enums.TimeSlotStatus;

import java.time.Instant;

public record TimeSlotManagementResponse(
        Long id,
        Instant startAt,
        Instant endAt,
        Integer durationMinutes,
        TimeSlotStatus status,
        Instant cancelledAt,
        Long bookingId,
        BookingSummaryResponse booking
) {

    public static TimeSlotManagementResponse from(
            TimeSlot timeSlot,
            BookingSummaryResponse booking
    ) {
        BookingSummaryResponse activeBooking =
                timeSlot.getStatus() == TimeSlotStatus.BOOKED
                        ? booking
                        : null;

        return new TimeSlotManagementResponse(
                timeSlot.getId(),
                timeSlot.getStartAt(),
                timeSlot.getEndAt(),
                timeSlot.getDurationMinutes(),
                timeSlot.getStatus(),
                timeSlot.getCancelledAt(),
                activeBooking == null ? null : activeBooking.id(),
                activeBooking
        );
    }
}