CREATE TABLE google_calendar_connection (
                                            id BIGINT PRIMARY KEY,
                                            calendar_id VARCHAR(255) NOT NULL,
                                            access_token_encrypted TEXT NOT NULL,
                                            refresh_token_encrypted TEXT NOT NULL,
                                            access_token_expires_at TIMESTAMPTZ NOT NULL,
                                            granted_scope TEXT NOT NULL,
                                            connected_at TIMESTAMPTZ NOT NULL,
                                            updated_at TIMESTAMPTZ NOT NULL,
                                            version BIGINT NOT NULL DEFAULT 0,

                                            CONSTRAINT ck_google_calendar_single_connection
                                                CHECK (id = 1)
);