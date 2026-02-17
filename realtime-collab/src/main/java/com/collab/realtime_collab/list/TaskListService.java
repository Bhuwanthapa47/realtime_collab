package com.collab.realtime_collab.list;

import com.collab.realtime_collab.activity.Activity;
import com.collab.realtime_collab.activity.ActivityRepository;
import com.collab.realtime_collab.board.Board;
import com.collab.realtime_collab.board.BoardRepository;
import com.collab.realtime_collab.repository.UserRepository;
import com.collab.realtime_collab.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskListService {

    private final TaskListRepository listRepo;
    private final BoardRepository boardRepo;
    private final ActivityRepository activityRepo;
    private final UserRepository userRepo;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof String) {
            String email = (String) principal;
            return userRepo.findByEmail(email).orElse(null);
        }
        return null;
    }

    public TaskList create(Long boardId, String name) {
        Board board = boardRepo.findById(boardId).orElseThrow();

        int position = listRepo.findByBoardOrderByPosition(board).size();

        TaskList list = TaskList.builder()
                .name(name)
                .board(board)
                .position(position)
                .build();

        TaskList savedList = listRepo.save(list);
        
        // Log activity
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(board)
                .user(currentUser)
                .type(Activity.ActivityType.LIST_CREATED)
                .description("created list '" + name + "'")
                .build();
        activityRepo.save(activity);
        
        return savedList;
    }

    public List<TaskList> getByBoard(Long boardId) {
        Board board = boardRepo.findById(boardId).orElseThrow();
        return listRepo.findByBoardOrderByPosition(board);
    }
    
    public TaskList update(Long id, String name) {
        TaskList list = listRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task list not found"));
        list.setName(name);
        TaskList updated = listRepo.save(list);
        
        // Log activity
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(list.getBoard())
                .user(currentUser)
                .type(Activity.ActivityType.LIST_UPDATED)
                .description("updated list to '" + name + "'")
                .build();
        activityRepo.save(activity);
        
        return updated;
    }
    
    public void delete(Long id) {
        TaskList list = listRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task list not found"));
        
        // Log activity before deleting
        User currentUser = getCurrentUser();
        Activity activity = Activity.builder()
                .board(list.getBoard())
                .user(currentUser)
                .type(Activity.ActivityType.LIST_DELETED)
                .description("deleted list '" + list.getName() + "'")
                .build();
        activityRepo.save(activity);
        
        listRepo.deleteById(id);
    }
}
