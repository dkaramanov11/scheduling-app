package com.daniel.scheduling.calendar;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Profile("local")
@RequestMapping("/api/google-calendar")
@RequiredArgsConstructor
public class GoogleCalendarController {

    private final GoogleCalendarOAuthService oauthService;
    private final GoogleCalendarTokenClient tokenClient;
    private final GoogleCalendarConnectionService connectionService;

    @GetMapping("/connect")
    public ResponseEntity<Void> connect(HttpServletRequest request) {
        requireLocalAccess(request);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(oauthService.createAuthorizationUri(
                        request.getSession(true)
                ))
                .cacheControl(CacheControl.noStore())
                .build();
    }

    @GetMapping("/callback")
    public ResponseEntity<ConnectionResponse> callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            HttpServletRequest request
    ) {
        requireLocalAccess(request);

        HttpSession session = request.getSession(false);

        if (session == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Connection session expired. Please reconnect."
            );
        }

        oauthService.validateAndConsumeState(session, state);

        if (error != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Google Calendar permission was not granted"
            );
        }

        var tokens = tokenClient.exchangeCode(code);
        connectionService.saveConnection(tokens);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .header("Referrer-Policy", "no-referrer")
                .body(new ConnectionResponse(
                        "Google Calendar connected successfully"
                ));
    }

    private void requireLocalAccess(HttpServletRequest request) {
        String address = request.getRemoteAddr();

        if (!"127.0.0.1".equals(address)
                && !"0:0:0:0:0:0:0:1".equals(address)
                && !"::1".equals(address)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Calendar connection is available locally only"
            );
        }
    }

    public record ConnectionResponse(String message) {
    }
}