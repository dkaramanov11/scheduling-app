package com.daniel.scheduling.booking.dto;

import com.daniel.scheduling.booking.Booking;
import com.daniel.scheduling.booking.enums.ExperienceLevel;
import com.daniel.scheduling.booking.enums.TrainingFocus;

public record BookingSummaryResponse(
        Long id,
        String customerName,
        String customerEmail,
        TrainingFocus trainingFocus,
        ExperienceLevel experienceLevel
) {

    public static BookingSummaryResponse from(Booking booking) {
        return new BookingSummaryResponse(
                booking.getId(),
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getTrainingFocus(),
                booking.getExperienceLevel()
        );
    }
}