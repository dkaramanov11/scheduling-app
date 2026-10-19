package com.daniel.scheduling.timeslot;

import com.daniel.scheduling.timeslot.dto.CreateTimeSlotRequest;
import com.daniel.scheduling.timeslot.dto.TimeSlotResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.daniel.scheduling.timeslot.dto.TimeSlotManagementResponse;
import com.daniel.scheduling.timeslot.enums.TimeSlotStatus;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/time-slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;


//    POST http://localhost:8080/api/time-slots
//    Content-Type: application/json
//    Body {
//        "startAt": "2026-10-20T14:00:00",
//        "durationMinutes": 30
//    }
    @PostMapping
    public ResponseEntity<TimeSlotResponse> create( @Valid @RequestBody CreateTimeSlotRequest request ) {

        TimeSlot timeSlot = timeSlotService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(TimeSlotResponse.from(timeSlot));
    }

    @GetMapping
    public List<TimeSlotResponse> findAvailable() {
        return timeSlotService.findAvailable()
                .stream()
                .map(TimeSlotResponse::from)
                .toList();
    }

    /*
     * GET /api/time-slots/manage
     * GET /api/time-slots/manage?status=BOOKED
     *
     * Returns upcoming time slots ordered by start time.
     * Omitting status returns all statuses.
     */
    @GetMapping("/manage")
    public List<TimeSlotManagementResponse> findForManagement(
            @RequestParam(name = "status", required = false)
            TimeSlotStatus status
    ) {
        return timeSlotService.findForManagement(status);
    }

}