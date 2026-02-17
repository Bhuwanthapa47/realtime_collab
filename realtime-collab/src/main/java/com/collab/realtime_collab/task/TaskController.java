package com.collab.realtime_collab.task;

import com.collab.realtime_collab.task.dto.UpdateTaskRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public Task create(@RequestBody Map<String, Object> request) {
        Long listId = Long.valueOf(request.get("listId").toString());
        String title = (String) request.get("title");
        String description = (String) request.get("description");
        return taskService.create(listId, title, description);
    }

    @GetMapping("/list/{listId}")
    public List<Task> getByList(@PathVariable Long listId) {
        return taskService.getByList(listId);
    }

    @PutMapping("/{taskId}/assign")
    public Task assign(@PathVariable Long taskId,
                       @RequestParam Long userId) {
        return taskService.assign(taskId, userId);
    }

    @PutMapping("/{taskId}/reorder")
    public void reorder(@PathVariable Long taskId,
                        @RequestParam int position) {
        taskService.reorder(taskId, position);
    }

    @PutMapping("/{taskId}/move")
    public Task move(@PathVariable Long taskId,
                     @RequestParam Long targetListId,
                     @RequestParam int position) {
        return taskService.move(taskId, targetListId, position);
    }


    @PutMapping("/{taskId}")
    public Task updateTask(@PathVariable Long taskId,
                           @RequestBody UpdateTaskRequest req) {
        return taskService.update(taskId, req);
    }



    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        taskService.delete(taskId);
    }


    @GetMapping("/paged")
    public Page<Task> getPaged(@RequestParam Long listId,
                               @RequestParam int page,
                               @RequestParam int size) {
        return taskService.getByListPaginated(listId, page, size);
    }

    @GetMapping("/search")
    public List<Task> search(@RequestParam String q) {
        return taskService.search(q);
    }
}
