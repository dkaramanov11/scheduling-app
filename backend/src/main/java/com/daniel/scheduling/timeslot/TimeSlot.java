package com.daniel.scheduling.timeslot;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Getter
@Entity
@Table(name = "time_slots")
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_at", nullable = false)
    private Instant startAt;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    protected TimeSlot() {
    }

    public TimeSlot(Instant startAt, Integer durationMinutes) {
        this.startAt = startAt;
        this.durationMinutes = durationMinutes;
    }

    public Instant getEndAt() {
        return startAt.plus(durationMinutes, ChronoUnit.MINUTES);
    }

}
