ALTER TABLE time_slots
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE';

UPDATE time_slots t
SET status = 'BOOKED'
WHERE EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.time_slot_id = t.id
);

UPDATE time_slots
SET status = 'CANCELLED'
WHERE cancelled_at IS NOT NULL;

ALTER TABLE time_slots
    ADD CONSTRAINT ck_time_slots_status
        CHECK (status IN ('AVAILABLE', 'BOOKED', 'CANCELLED'));