package com.daniel.scheduling.calendar;

import com.daniel.scheduling.timeslot.TimeSlot;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoogleCalendarAvailabilityService {

    private final GoogleCalendarClient calendarClient;

    public Set<Long> findConflictingSlotIds(List<TimeSlot> slots) {
        if (slots.isEmpty()) {
            return Set.of();
        }

        Instant from = slots.stream()
                .map(TimeSlot::getStartAt)
                .min(Instant::compareTo)
                .orElseThrow();

        Instant to = slots.stream()
                .map(TimeSlot::getEndAt)
                .max(Instant::compareTo)
                .orElseThrow();

        List<CalendarBusyPeriod> busyPeriods =
                calendarClient.findBusyPeriods(from, to);

        return slots.stream()
                .filter(slot -> busyPeriods.stream().anyMatch(
                        period -> period.overlaps(
                                slot.getStartAt(),
                                slot.getEndAt()
                        )
                ))
                .map(TimeSlot::getId)
                .collect(Collectors.toSet());
    }
}