package com.tasktracker.service;

import com.tasktracker.dto.TaskRequest;
import com.tasktracker.dto.TaskResponse;
import com.tasktracker.dto.TaskUpdateRequest;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskCompletionRepository taskCompletionRepository;
    private final UserRepository userRepository;

    @Transactional
    public TaskResponse createTask(String username, TaskRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = new Task();
        task.setUser(user);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setTaskType(request.getTaskType());
        task.setFrequency(request.getFrequency());
        task.setDeadline(request.getDeadline());
        task.setIsActive(true);

        task = taskRepository.save(task);

        return mapToResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Task> tasks = taskRepository.findByUserIdAndIsActiveTrue(user.getId());

        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(String username, Long taskId) {
        Task task = getTaskByIdAndUsername(taskId, username);
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(String username, Long taskId, TaskUpdateRequest request) {
        Task task = getTaskByIdAndUsername(taskId, username);

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getFrequency() != null) {
            task.setFrequency(request.getFrequency());
        }
        if (request.getIsActive() != null) {
            task.setIsActive(request.getIsActive());
        }

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Transactional
    public void deleteTask(String username, Long taskId) {
        Task task = getTaskByIdAndUsername(taskId, username);
        task.setIsActive(false);
        taskRepository.save(task);
    }

    @Transactional
    public TaskResponse completeTask(String username, Long taskId) {
        Task task = getTaskByIdAndUsername(taskId, username);
        LocalDate today = LocalDate.now();

        TaskCompletion completion = taskCompletionRepository
                .findByTaskIdAndCompletionDate(taskId, today)
                .orElseGet(() -> {
                    TaskCompletion newCompletion = new TaskCompletion();
                    newCompletion.setTask(task);
                    newCompletion.setCompletionDate(today);
                    newCompletion.setCount(0);
                    newCompletion.setCompletedAll(false);
                    return newCompletion;
                });

        if (completion.getCount() < task.getFrequency()) {
            completion.setCount(completion.getCount() + 1);
            if (completion.getCount().equals(task.getFrequency())) {
                completion.setCompletedAll(true);
            }
            taskCompletionRepository.save(completion);
        }

        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse uncompleteTask(String username, Long taskId) {
        Task task = getTaskByIdAndUsername(taskId, username);
        LocalDate today = LocalDate.now();

        TaskCompletion completion = taskCompletionRepository
                .findByTaskIdAndCompletionDate(taskId, today)
                .orElseThrow(() -> new ResourceNotFoundException("No completion found for today"));

        if (completion.getCount() > 0) {
            completion.setCount(completion.getCount() - 1);
            completion.setCompletedAll(false);
            taskCompletionRepository.save(completion);
        }

        return mapToResponse(task);
    }

    private Task getTaskByIdAndUsername(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Task not found");
        }

        return task;
    }

    private TaskResponse mapToResponse(Task task) {
        LocalDate today = LocalDate.now();
        TaskCompletion todayCompletion = taskCompletionRepository
                .findByTaskIdAndCompletionDate(task.getId(), today)
                .orElse(null);

        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setTaskType(task.getTaskType());
        response.setFrequency(task.getFrequency());
        response.setDeadline(task.getDeadline());
        response.setIsActive(task.getIsActive());
        response.setTodayCount(todayCompletion != null ? todayCompletion.getCount() : 0);
        response.setTodayCompleted(todayCompletion != null && todayCompletion.getCompletedAll());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        return response;
    }
}