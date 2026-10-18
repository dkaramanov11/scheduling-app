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
}