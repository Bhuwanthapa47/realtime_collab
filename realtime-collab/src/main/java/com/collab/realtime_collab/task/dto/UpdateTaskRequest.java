package com.collab.realtime_collab.task.dto;

import com.collab.realtime_collab.task.Task;

public class UpdateTaskRequest {
    private String title;
    private String description;
    private Task.TaskStatus status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Task.TaskStatus getStatus() { return status; }
    public void setStatus(Task.TaskStatus status) { this.status = status; }
}
