package com.tasktracker.dto;

import com.tasktracker.entity.Task.TaskType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskType taskType;
    private Integer frequency;
    private LocalDateTime deadline;
    private Boolean isActive;
    private Integer todayCount;
    private Boolean todayCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}