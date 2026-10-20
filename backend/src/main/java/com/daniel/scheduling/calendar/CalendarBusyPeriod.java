package com.daniel.scheduling.calendar;

import java.time.Instant;

public record CalendarBusyPeriod(
        Instant startAt,
        Instant endAt
) {

    public CalendarBusyPeriod {
        if (startAt == null || endAt == null
                || !startAt.isBefore(endAt)) {
            throw new IllegalArgumentException(
                    "Busy period must have a valid start and end"
            );
        }
    }

    public boolean overlaps(Instant slotStart, Instant slotEnd) {
        return slotStart.isBefore(endAt)
                && slotEnd.isAfter(startAt);
    }
}