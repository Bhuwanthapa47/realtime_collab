package com.collab.realtime_collab.list;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/task-lists")
@RequiredArgsConstructor
public class TaskListController {

    private final TaskListService listService;

    @PostMapping
    public TaskList create(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long boardId = Long.valueOf(request.get("boardId").toString());
        return listService.create(boardId, name);
    }

    @GetMapping("/board/{boardId}")
    public List<TaskList> getByBoard(@PathVariable Long boardId) {
        return listService.getByBoard(boardId);
    }
    
    @PutMapping("/{id}")
    public TaskList update(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String name = request.get("name");
        return listService.update(id, name);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        listService.delete(id);
    }
}
