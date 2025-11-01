package com.tasktracker.controller;

import com.tasktracker.dto.TaskRequest;
import com.tasktracker.dto.TaskResponse;
import com.tasktracker.dto.TaskUpdateRequest;
import com.tasktracker.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management APIs")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks for current user")
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getAllTasks(authentication.getName()));
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskRequest request
    ) {
        return ResponseEntity.ok(taskService.createTask(authentication.getName(), request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<TaskResponse> getTaskById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(taskService.getTaskById(authentication.getName(), id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task")
    public ResponseEntity<TaskResponse> updateTask(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody TaskUpdateRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<Void> deleteTask(
            Authentication authentication,
            @PathVariable Long id
    ) {
        taskService.deleteTask(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete task (increment count)")
    public ResponseEntity<TaskResponse> completeTask(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(taskService.completeTask(authentication.getName(), id));
    }

    @PostMapping("/{id}/uncomplete")
    @Operation(summary = "Uncomplete task (decrement count)")
    public ResponseEntity<TaskResponse> uncompleteTask(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(taskService.uncompleteTask(authentication.getName(), id));
    }

}
