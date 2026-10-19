package com.taskflow.dto;

import com.taskflow.models.TaskPriority;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class UpdateTaskRequest {

    @Size(min = 1, max = 200)
    private String title;

    private String description;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private Long assigneeId;

    public UpdateTaskRequest() {
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

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public Long getAssignedToId() {
        return assigneeId;
    }
    public void setAssignedToId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }
}