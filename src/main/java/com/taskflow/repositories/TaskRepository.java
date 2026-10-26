
package com.taskflow.repositories;

import com.taskflow.models.Task;
import com.taskflow.models.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTeam_Id(Long teamId);

    List<Task> findByAssignedTo_Id(Long userId);

    List<Task> findByTeam_IdAndStatus(Long teamId, TaskStatus status);


    @Query("""
            SELECT t
            FROM Task t
            JOIN TeamMember tm ON tm.team.id = t.team.id
            WHERE tm.user.id = :userId
            ORDER BY t.createdAt DESC
            """)
    List<Task> findAllByTeamMemberUserId(@Param("userId") Long userId);
}
