package com.tasktracker.repository;

import com.tasktracker.entity.Task;
import com.tasktracker.entity.Task.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdAndIsActiveTrue(Long userId);
    List<Task> findByUserId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.taskType = :taskType AND t.isActive = true")
    List<Task> findByUserIdAndTaskType(@Param("userId") Long userId, @Param("taskType") TaskType taskType);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.taskType = 'DEADLINE' AND t.deadline <= :deadline AND t.isActive = true")
    List<Task> findUpcomingDeadlines(@Param("userId") Long userId, @Param("deadline") LocalDateTime deadline);
}