ALTER TABLE time_slots
    ADD CONSTRAINT ex_time_slots_no_overlap
    EXCLUDE USING gist (
        tsrange(
            start_at AT TIME ZONE 'UTC',
            (start_at AT TIME ZONE 'UTC')
                + duration_minutes * INTERVAL '1 minute',
            '[)'
        ) WITH &&
    )
    WHERE (status <> 'CANCELLED');