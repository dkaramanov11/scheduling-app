package com.daniel.scheduling.ai;

import com.daniel.scheduling.ai.dto.KarateFactResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class KarateFactController {

    private final KarateFactService karateFactService;

    /*
     * POST /api/ai/karate-fact
     * No request body.
     *
     * Response:
     * {
     *   "fact": "Karate means empty hand in Japanese."
     * }
     */
    @PostMapping("/karate-fact")
    public ResponseEntity<KarateFactResponse> generate() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(karateFactService.generate());
    }
}