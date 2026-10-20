package com.daniel.scheduling.calendar;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;

import java.time.Instant;

@Getter
@Entity
@Table(name = "google_calendar_connection")
public class GoogleCalendarConnection {

    @Id
    private Long id;

    @Column(name = "calendar_id", nullable = false, length = 255)
    private String calendarId;

    @Column(name = "access_token_encrypted",
            nullable = false, columnDefinition = "TEXT")
    private String accessTokenEncrypted;

    @Column(name = "refresh_token_encrypted",
            nullable = false, columnDefinition = "TEXT")
    private String refreshTokenEncrypted;

    @Column(name = "access_token_expires_at", nullable = false)
    private Instant accessTokenExpiresAt;

    @Column(name = "granted_scope",
            nullable = false, columnDefinition = "TEXT")
    private String grantedScope;

    @Column(name = "connected_at", nullable = false, updatable = false)
    private Instant connectedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    @Column(nullable = false)
    private Long version;

    protected GoogleCalendarConnection() {
    }

    public GoogleCalendarConnection(
            String calendarId,
            String accessTokenEncrypted,
            String refreshTokenEncrypted,
            Instant accessTokenExpiresAt,
            String grantedScope
    ) {
        this.id = 1L;
        this.calendarId = calendarId;
        this.connectedAt = Instant.now();

        updateTokens(
                accessTokenEncrypted,
                refreshTokenEncrypted,
                accessTokenExpiresAt,
                grantedScope
        );
    }

    public void updateTokens(
            String accessTokenEncrypted,
            String refreshTokenEncrypted,
            Instant accessTokenExpiresAt,
            String grantedScope
    ) {
        this.accessTokenEncrypted = accessTokenEncrypted;
        this.refreshTokenEncrypted = refreshTokenEncrypted;
        this.accessTokenExpiresAt = accessTokenExpiresAt;
        this.grantedScope = grantedScope;
        this.updatedAt = Instant.now();
    }
}