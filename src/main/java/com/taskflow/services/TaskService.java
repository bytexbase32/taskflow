
package com.taskflow.services;

import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.models.Task;
import com.taskflow.models.Team;
import com.taskflow.models.User;
import com.taskflow.repositories.TaskRepository;
import com.taskflow.repositories.TeamMemberRepository;
import com.taskflow.repositories.TeamRepository;
import com.taskflow.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TeamMemberRepository teamMemberRepository;

    public TaskService(
            TaskRepository taskRepository,
            TeamRepository teamRepository,
            UserRepository userRepository,
            TeamMemberRepository teamMemberRepository) {
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request, Long currentUserId) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean creatorIsMember = teamMemberRepository.existsByTeam_IdAndUser_Id(team.getId(), creator.getId());

        if (!creatorIsMember) {
            throw new IllegalArgumentException("You are not a member of this team");
        }

        User assignee = null;

        if (request.getAssignedToId() != null) {
            assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));

            boolean assigneeIsMember = teamMemberRepository.existsByTeam_IdAndUser_Id(team.getId(), assignee.getId());

            if (!assigneeIsMember) {
                throw new IllegalArgumentException("Assignee is not a member of this team");
            }
        }

        Task task = new Task(request.getTitle(), team, creator);

        task.setDescription(request.getDescription());

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        task.setAssignedTo(assignee);
        task.setDueDate(request.getDueDate());

        Task savedTask = taskRepository.save(task);

        return toResponse(savedTask);
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();

        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setPriority(task.getPriority());
        response.setStatus(task.getStatus());
        response.setTeamId(task.getTeam().getId());
        response.setCreatedBy(task.getCreatedBy().getId());
        response.setAssignedToId(
                task.getAssignedTo() == null
                        ? null
                        : task.getAssignedTo().getId());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        response.setDueDate(task.getDueDate());

        return response;
    }

    @Transactional(readOnly = true)
    public java.util.List<TaskResponse> getTasksByTeam(
            Long teamId,
            Long currentUserId) {
        requireTeamMembership(teamId, currentUserId);

        return taskRepository.findByTeam_Id(teamId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.List<TaskResponse> getMyTasks(Long currentUserId) {
        return taskRepository.findAllByTeamMemberUserId(currentUserId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId, Long currentUserId) {
        Task task = findTask(taskId);
        requireTeamMembership(task.getTeam().getId(), currentUserId);

        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, Long currentUserId) {

        Task task = findTask(taskId);
        Long teamId = task.getTeam().getId();

        requireTeamMembership(teamId, currentUserId);

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new IllegalArgumentException("Assignee not found"));

            boolean isMember = teamMemberRepository.existsByTeam_IdAndUser_Id(teamId, assignee.getId());

            if (!isMember) {
                throw new IllegalArgumentException(
                        "Assignee is not a member of this team");
            }

            task.setAssignedTo(assignee);
        }

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long taskId, com.taskflow.models.TaskStatus status, Long currentUserId) {

        Task task = findTask(taskId);
        requireTeamMembership(task.getTeam().getId(), currentUserId);

        task.setStatus(status);

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long taskId, Long currentUserId) {
        Task task = findTask(taskId);
        requireTeamMembership(task.getTeam().getId(), currentUserId);

        taskRepository.delete(task);
    }

    private Task findTask(Long taskId) {
        return taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private void requireTeamMembership(Long teamId, Long userId) {
        boolean isMember = teamMemberRepository.existsByTeam_IdAndUser_Id(teamId, userId);

        if (!isMember) {
            throw new ForbiddenException(
                    "You are not a member of this team");
        }
    }
}
