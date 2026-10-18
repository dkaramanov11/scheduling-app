package com.daniel.scheduling.booking;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByTimeSlot_Id(Long timeSlotId);
}