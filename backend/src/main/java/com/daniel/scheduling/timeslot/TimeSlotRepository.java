package com.daniel.scheduling.timeslot;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    @Query("""
            SELECT t
            FROM TimeSlot t
            WHERE t.startAt > :now
              AND NOT EXISTS (
                  SELECT b.id
                  FROM Booking b
                  WHERE b.timeSlot = t
              )
            ORDER BY t.startAt ASC, t.id ASC
            """)
    List<TimeSlot> findAvailable(@Param("now") Instant now);
}