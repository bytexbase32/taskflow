
package com.taskflow.repositories;

import com.taskflow.models.Task;
import com.taskflow.models.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTeam_Id(Long teamId);

    List<Task> findByAssignedTo_Id(Long userId);

    List<Task> findByTeam_IdAndStatus(Long teamId, TaskStatus status);
}
