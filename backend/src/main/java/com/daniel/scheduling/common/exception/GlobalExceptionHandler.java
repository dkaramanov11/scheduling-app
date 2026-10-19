package com.daniel.scheduling.common.exception;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.jpa.JpaSystemException;
import java.sql.SQLException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            DataIntegrityViolationException.class,
            JpaSystemException.class
    })
    public ProblemDetail handleDataIntegrityViolation(
            RuntimeException exception
    ) {
        Throwable cause = exception;

        while (cause != null) {
            if (cause instanceof ConstraintViolationException violation) {
                String constraintName = violation.getConstraintName();

                if ("uq_bookings_time_slot".equals(constraintName)) {
                    return ProblemDetail.forStatusAndDetail(
                            HttpStatus.CONFLICT,
                            "Time slot is already booked"
                    );
                }

                if ("ex_time_slots_no_overlap".equals(constraintName)) {
                    return ProblemDetail.forStatusAndDetail(
                            HttpStatus.CONFLICT,
                            "Time slot overlaps with an existing time slot"
                    );
                }
            }

            // PostgreSQL exclusion violation.
            // Currently our only exclusion constraint prevents slot overlaps.
            if (cause instanceof SQLException sqlException
                    && "23P01".equals(sqlException.getSQLState())) {
                return ProblemDetail.forStatusAndDetail(
                        HttpStatus.CONFLICT,
                        "Time slot overlaps with an existing time slot"
                );
            }

            cause = cause.getCause();
        }

        return ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected database error occurred"
        );
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ProblemDetail handleResponseStatus(
            ResponseStatusException exception
    ) {
        String detail = exception.getReason() != null
                ? exception.getReason()
                : "Request could not be completed";

        return ProblemDetail.forStatusAndDetail(
                exception.getStatusCode(),
                detail
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.putIfAbsent(
                        error.getField(),
                        error.getDefaultMessage() != null
                                ? error.getDefaultMessage()
                                : "Invalid value"
                )
        );

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Please correct the invalid fields"
        );

        problem.setProperty("errors", errors);

        return problem;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleUnreadableMessage(
            HttpMessageNotReadableException exception
    ) {
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Request body is missing or contains invalid JSON or field values"
        );
    }
}