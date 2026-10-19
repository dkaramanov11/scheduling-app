package com.daniel.scheduling.booking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByTimeSlot_Id(Long timeSlotId);

    List<Booking> findByTimeSlot_IdIn(List<Long> timeSlotIds);
}