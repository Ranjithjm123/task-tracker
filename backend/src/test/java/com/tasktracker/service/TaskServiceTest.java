package com.tasktracker.service;

import com.tasktracker.dto.TaskRequest;
import com.tasktracker.dto.TaskResponse;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.User;
import com.tasktracker.repository.TaskCompletionRepository;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskCompletionRepository taskCompletionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User user;
    private Task task;
    private TaskRequest taskRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        task = new Task();
        task.setId(1L);
        task.setUser(user);
        task.setTitle("Test Task");
        task.setTaskType(Task.TaskType.DAILY);
        task.setFrequency(1);
        task.setIsActive(true);

        taskRequest = new TaskRequest();
        taskRequest.setTitle("New Task");
        taskRequest.setTaskType(Task.TaskType.DAILY);
        taskRequest.setFrequency(1);
    }

    @Test
    void createTask_Success() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponse response = taskService.createTask("testuser", taskRequest);

        assertNotNull(response);
        assertEquals("Test Task", response.getTitle());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void getAllTasks_Success() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(taskRepository.findByUserIdAndIsActiveTrue(anyLong())).thenReturn(Arrays.asList(task));

        List<TaskResponse> tasks = taskService.getAllTasks("testuser");

        assertNotNull(tasks);
        assertEquals(1, tasks.size());
    }
}