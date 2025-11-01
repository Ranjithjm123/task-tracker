package com.tasktracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeatmapDataResponse {
    private List<DayData> days;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayData {
        private LocalDate date;
        private Boolean allCompleted;
        private Integer completionCount;
        private Integer totalTasks;
    }
}