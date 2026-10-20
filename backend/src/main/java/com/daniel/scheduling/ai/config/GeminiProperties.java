package com.daniel.scheduling.ai.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Component
@Validated
@ConfigurationProperties(prefix = "app.ai.gemini")
public class GeminiProperties {

    private String apiKey = "";

    private String model = "";

    @Min(1)
    @Max(30)
    private int connectTimeoutSeconds = 5;

    @Min(1)
    @Max(60)
    private int requestTimeoutSeconds = 30;

    @Min(1)
    @Max(100)
    private int maxRequestsPerMinute = 5;

    @Min(1)
    @Max(1000)
    private int maxRequestsPerDay = 20;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank()
                && model != null && !model.isBlank();
    }
}