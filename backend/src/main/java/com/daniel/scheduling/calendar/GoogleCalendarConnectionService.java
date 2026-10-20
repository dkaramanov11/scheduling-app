package com.daniel.scheduling.calendar;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class GoogleCalendarConnectionService {

    private static final String REQUIRED_SCOPE =
            "https://www.googleapis.com/auth/calendar.freebusy";

    private final GoogleCalendarConnectionRepository repository;
    private final GoogleCalendarTokenCipher tokenCipher;
    private final GoogleCalendarTokenClient tokenClient;

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

    @Transactional
    public String getValidAccessToken() {
        GoogleCalendarConnection connection = repository
                .findOneById(1L)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "Google Calendar is not connected"
                ));

        // Reuse the token if it remains valid for at least one minute.
        if (connection.getAccessTokenExpiresAt()
                .isAfter(Instant.now().plusSeconds(60))) {
            return tokenCipher.decrypt(
                    connection.getAccessTokenEncrypted()
            );
        }

        String refreshToken = tokenCipher.decrypt(
                connection.getRefreshTokenEncrypted()
        );

        var tokens = tokenClient.refreshAccessToken(refreshToken);

        String scope = tokens.getScope() == null
                || tokens.getScope().isBlank()
                ? connection.getGrantedScope()
                : tokens.getScope();

        boolean hasRequiredScope = Arrays.stream(scope.split("\\s+"))
                .anyMatch(REQUIRED_SCOPE::equals);

        if (!hasRequiredScope) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Calendar availability permission is missing. Please reconnect."
            );
        }

        connection.updateTokens(
                tokenCipher.encrypt(tokens.getAccessToken()),
                tokenCipher.encrypt(tokens.getRefreshToken()),
                tokens.getExpiresAt(),
                scope
        );

        repository.saveAndFlush(connection);

        return tokens.getAccessToken();
    }
}