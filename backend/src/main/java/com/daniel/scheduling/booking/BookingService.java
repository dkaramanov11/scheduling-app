package com.daniel.scheduling.booking;

import com.daniel.scheduling.booking.dto.CreateBookingRequest;
import com.daniel.scheduling.calendar.GoogleCalendarClient;
import com.daniel.scheduling.timeslot.TimeSlot;
import com.daniel.scheduling.timeslot.TimeSlotRepository;
import com.daniel.scheduling.timeslot.enums.TimeSlotStatus;
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
    private final GoogleCalendarClient calendarClient;

    @Transactional
    public Booking create(CreateBookingRequest request) {
        TimeSlot timeSlot = timeSlotRepository
                .findOneById(request.timeSlotId())
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

        if (timeSlot.getStatus() == TimeSlotStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Time slot is cancelled"
            );
        }

        if (timeSlot.getStatus() == TimeSlotStatus.BOOKED
                || bookingRepository.existsByTimeSlot_Id(timeSlot.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Time slot is already booked"
            );
        }

        // Check Google Calendar before creating the booking.
        var busyPeriods = calendarClient.findBusyPeriods(
                timeSlot.getStartAt(),
                timeSlot.getEndAt()
        );

        boolean hasCalendarConflict = busyPeriods.stream()
                .anyMatch(period -> period.overlaps(
                        timeSlot.getStartAt(),
                        timeSlot.getEndAt()
                ));

        if (hasCalendarConflict) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Time slot is unavailable due to a Google Calendar event"
            );
        }

        // Check again because the Google request may take time.
        now = Instant.now();

        if (!timeSlot.getStartAt().isAfter(now)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot book a time slot that has already started"
            );
        }

        timeSlot.markAsBooked();

        Booking booking = new Booking(
                timeSlot,
                request.customerName().strip(),
                request.customerEmail().strip(),
                request.trainingFocus(),
                request.experienceLevel(),
                now
        );

        return bookingRepository.saveAndFlush(booking);
    }

    @Transactional
    public void cancel(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"
                ));

        TimeSlot timeSlot = timeSlotRepository
                .findOneById(booking.getTimeSlot().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Time slot not found"
                ));

        // Recheck after acquiring the time slot lock.
        if (!bookingRepository.existsById(bookingId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Booking not found"
            );
        }

        if (!timeSlot.getStartAt().isAfter(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot cancel a booking for a time slot that has already started"
            );
        }

        if (timeSlot.getStatus() != TimeSlotStatus.BOOKED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Time slot is not booked"
            );
        }

        bookingRepository.delete(booking);
        bookingRepository.flush();

        timeSlot.releaseBooking();
    }
}