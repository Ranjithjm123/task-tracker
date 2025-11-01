package com.tasktracker.service;

import com.tasktracker.dto.HeatmapDataResponse;
import com.tasktracker.dto.StatsResponse;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.TaskCompletion;
import com.tasktracker.entity.User;
import com.tasktracker.exception.ResourceNotFoundException;
import com.tasktracker.repository.TaskCompletionRepository;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskCompletionRepository taskCompletionRepository;

    @Transactional(readOnly = true)
    public HeatmapDataResponse getHeatmapData(String username, int days) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        List<TaskCompletion> completions = taskCompletionRepository
                .findByUserIdAndDateRange(user.getId(), startDate, endDate);

        Map<LocalDate, List<TaskCompletion>> completionsByDate = completions.stream()
                .collect(Collectors.groupingBy(TaskCompletion::getCompletionDate));

        List<HeatmapDataResponse.DayData> dayDataList = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<TaskCompletion> dayCompletions = completionsByDate.getOrDefault(date, Collections.emptyList());

            int totalTasksForDay = getTotalActiveTasksForDate(user.getId(), date);
            int completedTasks = (int) dayCompletions.stream()
                    .filter(TaskCompletion::getCompletedAll)
                    .count();

            boolean allCompleted = totalTasksForDay > 0 && completedTasks == totalTasksForDay;

            HeatmapDataResponse.DayData dayData = new HeatmapDataResponse.DayData(
                    date,
                    allCompleted,
                    completedTasks,
                    totalTasksForDay
            );
            dayDataList.add(dayData);
        }

        return new HeatmapDataResponse(dayDataList);
    }

    @Transactional(readOnly = true)
    public StatsResponse getOverview(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(365);

        List<TaskCompletion> completions = taskCompletionRepository
                .findByUserIdAndDateRange(user.getId(), startDate, endDate);

        Map<LocalDate, List<TaskCompletion>> completionsByDate = completions.stream()
                .collect(Collectors.groupingBy(TaskCompletion::getCompletionDate));

        int currentStreak = calculateCurrentStreak(user.getId(), completionsByDate);
        int longestStreak = calculateLongestStreak(user.getId(), completionsByDate, startDate, endDate);
        int totalCompletedDays = (int) completionsByDate.entrySet().stream()
                .filter(entry -> isAllTasksCompleted(entry.getValue(), user.getId(), entry.getKey()))
                .count();

        List<Task> allTasks = taskRepository.findByUserId(user.getId());
        List<Task> activeTasks = taskRepository.findByUserIdAndIsActiveTrue(user.getId());

        Map<Task.TaskType, Long> taskTypeCount = activeTasks.stream()
                .collect(Collectors.groupingBy(Task::getTaskType, Collectors.counting()));

        List<StatsResponse.TaskTypeStats> taskTypeBreakdown = taskTypeCount.entrySet().stream()
                .map(entry -> new StatsResponse.TaskTypeStats(
                        entry.getKey().name(),
                        entry.getValue().intValue()
                ))
                .collect(Collectors.toList());

        return new StatsResponse(
                currentStreak,
                longestStreak,
                totalCompletedDays,
                allTasks.size(),
                activeTasks.size(),
                taskTypeBreakdown
        );
    }

    private int calculateCurrentStreak(Long userId, Map<LocalDate, List<TaskCompletion>> completionsByDate) {
        int streak = 0;
        LocalDate date = LocalDate.now();

        while (true) {
            List<TaskCompletion> dayCompletions = completionsByDate.get(date);
            if (dayCompletions == null || !isAllTasksCompleted(dayCompletions, userId, date)) {
                break;
            }
            streak++;
            date = date.minusDays(1);
        }

        return streak;
    }

    private int calculateLongestStreak(Long userId, Map<LocalDate, List<TaskCompletion>> completionsByDate,
                                       LocalDate startDate, LocalDate endDate) {
        int longestStreak = 0;
        int currentStreak = 0;

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<TaskCompletion> dayCompletions = completionsByDate.get(date);

            if (dayCompletions != null && isAllTasksCompleted(dayCompletions, userId, date)) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        return longestStreak;
    }

    private boolean isAllTasksCompleted(List<TaskCompletion> completions, Long userId, LocalDate date) {
        int totalTasks = getTotalActiveTasksForDate(userId, date);
        if (totalTasks == 0) return false;

        long completedCount = completions.stream()
                .filter(TaskCompletion::getCompletedAll)
                .count();

        return completedCount == totalTasks;
    }

    private int getTotalActiveTasksForDate(Long userId, LocalDate date) {
        List<Task> tasks = taskRepository.findByUserIdAndIsActiveTrue(userId);
        return (int) tasks.stream()
                .filter(task -> !task.getCreatedAt().toLocalDate().isAfter(date))
                .count();
    }
}