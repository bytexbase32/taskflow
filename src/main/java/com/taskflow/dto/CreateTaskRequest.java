package com.taskflow.dto;

import com.taskflow.models.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateTaskRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    private String description;

    @NotNull
    private TaskPriority priority = TaskPriority.MEDIUM;

    @NotNull
    private Long teamId;

    private Long assignedToId;

    private LocalDateTime dueDate;

    public CreateTaskRequest() {
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}