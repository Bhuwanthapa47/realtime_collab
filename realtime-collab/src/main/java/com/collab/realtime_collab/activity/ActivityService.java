package com.collab.realtime_collab.activity;

import com.collab.realtime_collab.board.Board;
import com.collab.realtime_collab.board.BoardRepository;
import com.collab.realtime_collab.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final BoardRepository boardRepository;

    public Activity logActivity(Long boardId, User user, Activity.ActivityType type, String description) {
        Board board = boardRepository.findById(boardId).orElseThrow();
        
        Activity activity = Activity.builder()
                .board(board)
                .user(user)
                .type(type)
                .description(description)
                .build();
        
        return activityRepository.save(activity);
    }

    public List<Activity> getBoardActivities(Long boardId) {
        return activityRepository.findTop20ByBoardIdOrderByTimestampDesc(boardId);
    }
}
