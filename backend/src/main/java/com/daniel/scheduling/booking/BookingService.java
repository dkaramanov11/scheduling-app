package com.daniel.scheduling.booking;

import com.daniel.scheduling.booking.dto.CreateBookingRequest;
import com.daniel.scheduling.timeslot.TimeSlot;
import com.daniel.scheduling.timeslot.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Transactional
    public Booking create(CreateBookingRequest request) {
        TimeSlot timeSlot = timeSlotRepository
                .findById(request.timeSlotId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Time slot not found"
                ));

        Instant now = Instant.now();

        if (!timeSlot.getStartAt().isAfter(now)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot book a time slot that has already started"
            );
        }

        if (bookingRepository.existsByTimeSlot_Id(timeSlot.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Time slot is already booked"
            );
        }

        Booking booking = new Booking(
                timeSlot,
                request.customerName().strip(),
                request.customerEmail().strip(),
                now
        );

     return bookingRepository.saveAndFlush(booking);
    }
}