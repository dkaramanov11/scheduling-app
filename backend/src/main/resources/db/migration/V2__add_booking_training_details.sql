ALTER TABLE bookings
    ADD COLUMN training_focus VARCHAR(20),
    ADD COLUMN experience_level VARCHAR(20);

ALTER TABLE bookings
    ADD CONSTRAINT ck_bookings_training_focus
        CHECK (training_focus IN ('KIHON', 'KATA', 'KUMITE')),
    ADD CONSTRAINT ck_bookings_experience_level
        CHECK (experience_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'));