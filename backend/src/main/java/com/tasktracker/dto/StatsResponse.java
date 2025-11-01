package com.tasktracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalCompletedDays;
    private Integer totalTasks;
    private Integer activeTasks;
    private List<TaskTypeStats> taskTypeBreakdown;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskTypeStats {
        private String taskType;
        private Integer count;
    }
}