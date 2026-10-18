package com.daniel.scheduling.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/*
 * Expected request JSON:
 * {
 *   "timeSlotId": 1,
 *   "customerName": "Daniel",
 *   "customerEmail": "daniel@example.com"
 * }
 */
public record CreateBookingRequest(

        @NotNull(message = "Time slot is required")
        @Positive(message = "Time slot ID must be positive")
        Long timeSlotId,

        @NotBlank(message = "Customer name is required")
        @Size(max = 100, message = "Customer name must not exceed 100 characters")
        String customerName,

        @NotBlank(message = "Customer email is required")
        @Email(message = "Customer email must be valid")
        @Size(max = 254, message = "Customer email must not exceed 254 characters")
        String customerEmail

) {
}