package com.daniel.scheduling.calendar;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class GoogleCalendarConnectionService {

    private static final String REQUIRED_SCOPE =
            "https://www.googleapis.com/auth/calendar.freebusy";

    private final GoogleCalendarConnectionRepository repository;
    private final GoogleCalendarTokenCipher tokenCipher;

    @Transactional
    public void saveConnection(GoogleCalendarTokenClient.Tokens tokens) {
        boolean hasRequiredScope = tokens.getScope() != null
                && Arrays.stream(tokens.getScope().split("\\s+"))
                .anyMatch(REQUIRED_SCOPE::equals);

        if (!hasRequiredScope) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please allow access to your calendar availability"
            );
        }

        if (tokens.getRefreshToken() == null
                || tokens.getRefreshToken().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Google did not provide ongoing access. Please reconnect and grant consent."
            );
        }

        String encryptedAccessToken =
                tokenCipher.encrypt(tokens.getAccessToken());

        String encryptedRefreshToken =
                tokenCipher.encrypt(tokens.getRefreshToken());

        GoogleCalendarConnection connection = repository
                .findById(1L)
                .orElse(null);

        if (connection == null) {
            connection = new GoogleCalendarConnection(
                    "primary",
                    encryptedAccessToken,
                    encryptedRefreshToken,
                    tokens.getExpiresAt(),
                    tokens.getScope()
            );
        } else {
            connection.updateTokens(
                    encryptedAccessToken,
                    encryptedRefreshToken,
                    tokens.getExpiresAt(),
                    tokens.getScope()
            );
        }

        repository.saveAndFlush(connection);
    }
}