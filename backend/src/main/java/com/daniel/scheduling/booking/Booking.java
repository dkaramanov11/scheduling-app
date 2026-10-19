package com.daniel.scheduling.booking;

import com.daniel.scheduling.booking.enums.ExperienceLevel;
import com.daniel.scheduling.booking.enums.TrainingFocus;
import com.daniel.scheduling.timeslot.TimeSlot;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.Instant;

@Getter
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "time_slot_id", nullable = false, unique = true)
    private TimeSlot timeSlot;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_email", nullable = false, length = 254)
    private String customerEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "training_focus", length = 20)
    private TrainingFocus trainingFocus;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 20)
    private ExperienceLevel experienceLevel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Booking() {
    }

    public Booking(
            TimeSlot timeSlot,
            String customerName,
            String customerEmail,
            TrainingFocus trainingFocus,
            ExperienceLevel experienceLevel,
            Instant createdAt
    ) {
        this.timeSlot = timeSlot;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.trainingFocus = trainingFocus;
        this.experienceLevel = experienceLevel;
        this.createdAt = createdAt;
    }
}