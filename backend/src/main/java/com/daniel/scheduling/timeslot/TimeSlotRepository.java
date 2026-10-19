package com.daniel.scheduling.timeslot;

import com.daniel.scheduling.timeslot.enums.TimeSlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

import java.time.Instant;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByStartAtAfterOrderByStartAtAscIdAsc(
            Instant now
    );

    List<TimeSlot> findByStatusAndStartAtAfterOrderByStartAtAscIdAsc(
            TimeSlotStatus status,
            Instant now
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<TimeSlot> findOneById(Long id);
}