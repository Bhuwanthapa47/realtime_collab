package com.collab.realtime_collab.task;

import com.collab.realtime_collab.activity.Activity;
import com.collab.realtime_collab.activity.ActivityRepository;
import com.collab.realtime_collab.list.TaskList;
import com.collab.realtime_collab.list.TaskListRepository;
import com.collab.realtime_collab.repository.UserRepository;
import com.collab.realtime_collab.task.dto.UpdateTaskRequest;
import com.collab.realtime_collab.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepo;
    private final TaskListRepository listRepo;
    private final UserRepository userRepo;
    private final ActivityRepository activityRepo;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof String) {
            String email = (String) principal;
            return userRepo.findByEmail(email).orElse(null);
        }
        return null;
    }

    public Task create(Long listId, String title, String desc) {
        TaskList list = listRepo.findById(listId).orElseThrow();

        int position = taskRepo.findByListOrderByPosition(list).size();

        Task task = Task.builder()
                .title(title)
                .description(desc)
                .list(list)
                .position(position)
                .build();

        Task savedTask = taskRepo.save(task);
        
        // Log activity
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(list.getBoard())
                .user(currentUser)
                .type(Activity.ActivityType.TASK_CREATED)
                .description("created task '" + title + "'")
                .build();
        activityRepo.save(activity);
        
        return savedTask;
    }

    public List<Task> getByList(Long listId) {
        TaskList list = listRepo.findById(listId).orElseThrow();
        return taskRepo.findByListOrderByPosition(list);
    }

    public Task assign(Long taskId, Long userId) {
        Task task = taskRepo.findById(taskId).orElseThrow();
        User user = userRepo.findById(userId).orElseThrow();

        task.setAssignedTo(user);
        Task updated = taskRepo.save(task);
        
        // Log activity
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(task.getList().getBoard())
                .user(currentUser)
                .type(Activity.ActivityType.TASK_ASSIGNED)
                .description("assigned task '" + task.getTitle() + "' to " + user.getName())
                .build();
        activityRepo.save(activity);
        
        return updated;
    }

    @Transactional
    public void reorder(Long taskId, int newPosition) {
        Task task = taskRepo.findById(taskId).orElseThrow();
        TaskList list = task.getList();

        List<Task> tasks = taskRepo.findByListOrderByPosition(list);

        tasks.remove(task);
        tasks.add(newPosition, task);

        for (int i = 0; i < tasks.size(); i++) {
            tasks.get(i).setPosition(i);
        }

        taskRepo.saveAll(tasks);
    }

    @Transactional
    public Task move(Long taskId, Long targetListId, int newPosition) {
        Task task = taskRepo.findById(taskId).orElseThrow();
        TaskList target = listRepo.findById(targetListId).orElseThrow();
        String sourceName = task.getList().getName();

        task.setList(target);

        List<Task> tasks = taskRepo.findByListOrderByPosition(target);
        tasks.add(newPosition, task);

        for (int i = 0; i < tasks.size(); i++) {
            tasks.get(i).setPosition(i);
        }

        Task updated = taskRepo.save(task);
        
        // Log activity
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(task.getList().getBoard())
                .user(currentUser)
                .type(Activity.ActivityType.TASK_MOVED)
                .description("moved task '" + task.getTitle() + "' from '" + sourceName + "' to '" + target.getName() + "'")
                .build();
        activityRepo.save(activity);
        
        return updated;
    }


    public Task update(Long taskId, UpdateTaskRequest req) {
        Task existing = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (req.getTitle() != null) {
            existing.setTitle(req.getTitle());
        }
        if (req.getDescription() != null) {
            existing.setDescription(req.getDescription());
        }
        if (req.getStatus() != null) {
            existing.setStatus(req.getStatus());
        }

        Task updated = taskRepo.save(existing);
        
        // Log activity
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(existing.getList().getBoard())
                .user(currentUser)
                .type(Activity.ActivityType.TASK_UPDATED)
                .description("updated task '" + existing.getTitle() + "'")
                .build();
        activityRepo.save(activity);
        
        return updated;
    }


    public void delete(Long taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Log activity before deleting
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(task.getList().getBoard())
                .user(currentUser)
                .type(Activity.ActivityType.TASK_DELETED)
                .description("deleted task '" + task.getTitle() + "'")
                .build();
        activityRepo.save(activity);
        
        taskRepo.delete(task);
    }

    public Page<Task> getByListPaginated(Long listId, int page, int size) {
        return taskRepo.findByListId(listId, PageRequest.of(page, size));
    }

    public List<Task> search(String keyword) {
        return taskRepo.findByTitleContainingIgnoreCase(keyword);
    }



}
