package com.daniel.scheduling.booking;

import com.daniel.scheduling.booking.dto.BookingResponse;
import com.daniel.scheduling.booking.dto.CreateBookingRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> create(
            @Valid @RequestBody CreateBookingRequest request
    ) {
        Booking booking = bookingService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BookingResponse.from(booking));
    }

    /*
     * DELETE /api/bookings/15
     *
     * Deletes the booking and makes its time slot available again.
     * Returns 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(
            @PathVariable("id") Long id
    ) {
        bookingService.cancel(id);

        return ResponseEntity.noContent().build();
    }
}