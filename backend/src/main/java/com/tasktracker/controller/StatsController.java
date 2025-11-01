package com.tasktracker.controller;

import com.tasktracker.dto.HeatmapDataResponse;
import com.tasktracker.dto.StatsResponse;
import com.tasktracker.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Statistics and analytics APIs")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/heatmap")
    @Operation(summary = "Get heatmap data")
    public ResponseEntity<HeatmapDataResponse> getHeatmapData(
            Authentication authentication,
            @RequestParam(defaultValue = "365") int days) {
        return ResponseEntity.ok(statsService.getHeatmapData(authentication.getName(), days));
    }

    @GetMapping("/overview")
    @Operation(summary = "Get statistics overview")
    public ResponseEntity<StatsResponse> getOverview(Authentication authentication) {
        return ResponseEntity.ok(statsService.getOverview(authentication.getName()));
    }
}