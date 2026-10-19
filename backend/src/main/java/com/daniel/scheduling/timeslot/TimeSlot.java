package com.daniel.scheduling.timeslot;

import com.daniel.scheduling.timeslot.enums.TimeSlotStatus;
import jakarta.persistence.*;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TimeSlotStatus status = TimeSlotStatus.AVAILABLE;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    protected TimeSlot() {
    }

    public TimeSlot(Instant startAt, Integer durationMinutes) {
        this.startAt = startAt;
        this.durationMinutes = durationMinutes;
    }

    public Instant getEndAt() {
        return startAt.plus(durationMinutes, ChronoUnit.MINUTES);
    }

    public void markAsBooked() {
        if (status != TimeSlotStatus.AVAILABLE) {
            throw new IllegalStateException(
                    "Only available time slots can be booked"
            );
        }

        status = TimeSlotStatus.BOOKED;
    }

    public void releaseBooking() {
        if (status != TimeSlotStatus.BOOKED) {
            throw new IllegalStateException(
                    "Only booked time slots can be released"
            );
        }

        status = TimeSlotStatus.AVAILABLE;
    }

    public void cancel(Instant cancelledAt) {
        if (status != TimeSlotStatus.AVAILABLE) {
            throw new IllegalStateException(
                    "Only available time slots can be cancelled"
            );
        }

        this.status = TimeSlotStatus.CANCELLED;
        this.cancelledAt = cancelledAt;
    }

}
