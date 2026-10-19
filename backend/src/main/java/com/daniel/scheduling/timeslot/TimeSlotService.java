package com.daniel.scheduling.timeslot;

import com.daniel.scheduling.booking.BookingRepository;
import com.daniel.scheduling.timeslot.dto.CreateTimeSlotRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.daniel.scheduling.timeslot.enums.TimeSlotStatus;
import com.daniel.scheduling.timeslot.dto.TimeSlotManagementResponse;
import com.daniel.scheduling.booking.Booking;
import com.daniel.scheduling.booking.BookingRepository;

import java.util.Map;
import java.util.stream.Collectors;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private static final ZoneId APP_ZONE = ZoneId.of("Europe/Skopje");

    private final TimeSlotRepository timeSlotRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public TimeSlot create(CreateTimeSlotRequest request) {
        var validOffsets = APP_ZONE.getRules()
                .getValidOffsets(request.startAt());

        if (validOffsets.size() != 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start time is invalid or ambiguous due to a daylight saving time change"
            );
        }

        Instant startAt = request.startAt()
                .toInstant(validOffsets.get(0));

        if (!startAt.isAfter(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start time must be in the future"
            );
        }

        TimeSlot timeSlot = new TimeSlot(
                startAt,
                request.durationMinutes()
        );

        return timeSlotRepository.saveAndFlush(timeSlot);
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> findAvailable() {
        return timeSlotRepository
                .findByStatusAndStartAtAfterOrderByStartAtAscIdAsc(
                        TimeSlotStatus.AVAILABLE,
                        Instant.now()
                );
    }

    @Transactional(readOnly = true)
    public List<TimeSlotManagementResponse> findForManagement(
            TimeSlotStatus status
    ) {
        Instant now = Instant.now();

        List<TimeSlot> timeSlots;

        if (status == null) {
            timeSlots = timeSlotRepository
                    .findByStartAtAfterOrderByStartAtAscIdAsc(now);
        } else {
            timeSlots = timeSlotRepository
                    .findByStatusAndStartAtAfterOrderByStartAtAscIdAsc(
                            status,
                            now
                    );
        }

        if (timeSlots.isEmpty()) {
            return List.of();
        }

        List<Long> timeSlotIds = timeSlots.stream()
                .map(TimeSlot::getId)
                .toList();

        Map<Long, Long> bookingIds = bookingRepository
                .findByTimeSlot_IdIn(timeSlotIds)
                .stream()
                .collect(Collectors.toMap(
                        booking -> booking.getTimeSlot().getId(),
                        Booking::getId
                ));

        return timeSlots.stream()
                .map(timeSlot -> TimeSlotManagementResponse.from(
                        timeSlot,
                        bookingIds.get(timeSlot.getId())
                ))
                .toList();
    }

    @Transactional
    public void cancel(Long id) {
        TimeSlot timeSlot = timeSlotRepository.findOneById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Time slot not found"
                ));

        Instant now = Instant.now();

        if (!timeSlot.getStartAt().isAfter(now)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot cancel a time slot that has already started"
            );
        }

        if (timeSlot.getStatus() == TimeSlotStatus.CANCELLED) {
            return;
        }

        if (timeSlot.getStatus() == TimeSlotStatus.BOOKED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cancel the booking before removing the time slot"
            );
        }

        timeSlot.cancel(now);
    }
}