package com.daniel.scheduling.timeslot;

import com.daniel.scheduling.timeslot.dto.CreateTimeSlotRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private static final ZoneId APP_ZONE = ZoneId.of("Europe/Skopje");

    private final TimeSlotRepository timeSlotRepository;

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

        return timeSlotRepository.save(timeSlot);
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> findAvailable() {
        return timeSlotRepository.findAvailable(Instant.now());
    }

}