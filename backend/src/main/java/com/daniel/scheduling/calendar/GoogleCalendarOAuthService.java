package com.daniel.scheduling.calendar;

import com.daniel.scheduling.calendar.config.GoogleCalendarProperties;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class GoogleCalendarOAuthService {

    private static final String STATE_KEY = "googleCalendarOAuthState";
    private static final String EXPIRES_KEY = "googleCalendarOAuthExpires";

    private final GoogleCalendarProperties properties;
    private final SecureRandom secureRandom = new SecureRandom();

    public URI createAuthorizationUri(HttpSession session) {
        if (!properties.isConfigured()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Google Calendar connection is not configured"
            );
        }

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String state = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        session.setAttribute(STATE_KEY, state);
        session.setAttribute(EXPIRES_KEY, Instant.now().plusSeconds(600));

        return UriComponentsBuilder
                .fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", properties.getClientId())
                .queryParam("redirect_uri", properties.getRedirectUri())
                .queryParam("response_type", "code")
                .queryParam("scope",
                        "https://www.googleapis.com/auth/calendar.freebusy")
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent")
                .queryParam("state", state)
                .build()
                .encode()
                .toUri();
    }

    public void validateAndConsumeState(HttpSession session, String state) {
        synchronized (session) {
            Object expectedState = session.getAttribute(STATE_KEY);
            Object expiresAt = session.getAttribute(EXPIRES_KEY);

            session.removeAttribute(STATE_KEY);
            session.removeAttribute(EXPIRES_KEY);

            if (!(expectedState instanceof String expected)
                    || !expected.equals(state)
                    || !(expiresAt instanceof Instant expiry)
                    || !Instant.now().isBefore(expiry)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Google Calendar connection expired or is invalid. Please try again."
                );
            }
        }
    }
}