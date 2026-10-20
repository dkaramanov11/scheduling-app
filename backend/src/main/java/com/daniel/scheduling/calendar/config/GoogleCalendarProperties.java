package com.daniel.scheduling.calendar.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.google-calendar")
public class GoogleCalendarProperties {

    private String clientId = "";
    private String clientSecret = "";
    private String redirectUri =
            "http://localhost:8080/api/google-calendar/callback";

    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank()
                && clientSecret != null && !clientSecret.isBlank()
                && redirectUri != null && !redirectUri.isBlank();
    }
}