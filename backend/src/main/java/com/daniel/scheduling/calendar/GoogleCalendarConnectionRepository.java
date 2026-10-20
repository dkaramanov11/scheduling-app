package com.daniel.scheduling.calendar;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GoogleCalendarConnectionRepository
        extends JpaRepository<GoogleCalendarConnection, Long> {
}