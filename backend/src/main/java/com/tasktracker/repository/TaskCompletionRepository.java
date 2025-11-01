package com.tasktracker.repository;

import com.tasktracker.entity.TaskCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCompletionRepository extends JpaRepository<TaskCompletion, Long> {
    Optional<TaskCompletion> findByTaskIdAndCompletionDate(Long taskId, LocalDate completionDate);

    @Query("SELECT tc FROM TaskCompletion tc WHERE tc.task.user.id = :userId AND tc.completionDate = :date")
    List<TaskCompletion> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT tc FROM TaskCompletion tc WHERE tc.task.user.id = :userId AND tc.completionDate BETWEEN :startDate AND :endDate ORDER BY tc.completionDate")
    List<TaskCompletion> findByUserIdAndDateRange(@Param("userId") Long userId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT tc FROM TaskCompletion tc WHERE tc.task.id = :taskId ORDER BY tc.completionDate DESC")
    List<TaskCompletion> findByTaskIdOrderByCompletionDateDesc(@Param("taskId") Long taskId);
}