
package com.taskflow.controllers;

import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.models.TaskStatus;
import com.taskflow.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> getTasks(
            @RequestParam Long teamId,
            @AuthenticationPrincipal Jwt jwt) {
        return taskService.getTasksByTeam(teamId, currentUserId(jwt));
    }

    @PostMapping
    public TaskResponse createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return taskService.createTask(request, currentUserId(jwt));
    }

    @GetMapping("/{id}")
    public TaskResponse getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        return taskService.getTaskById(id, currentUserId(jwt));
    }

    @GetMapping("/my-tasks")
    public List<TaskResponse> getMyTasks(
            @AuthenticationPrincipal Jwt jwt) {
        return taskService.getMyTasks(currentUserId(jwt));
    }

    @PatchMapping("/{id}")
    public TaskResponse updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return taskService.updateTask(id, request, currentUserId(jwt));
    }

    @PatchMapping("/{id}/status")
    public TaskResponse updateTaskStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal Jwt jwt) {
        return taskService.updateTaskStatus(id, status, currentUserId(jwt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        taskService.deleteTask(id, currentUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    private Long currentUserId(Jwt jwt) {
        return Long.parseLong(jwt.getSubject());
    }
}
