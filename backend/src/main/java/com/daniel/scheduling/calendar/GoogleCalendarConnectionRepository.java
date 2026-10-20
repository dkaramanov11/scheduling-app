package com.daniel.scheduling.calendar;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface GoogleCalendarConnectionRepository
        extends JpaRepository<GoogleCalendarConnection, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<GoogleCalendarConnection> findOneById(Long id);
}