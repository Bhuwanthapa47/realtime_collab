package com.collab.realtime_collab.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping("/board/{boardId}")
    public List<Activity> getBoardActivities(@PathVariable Long boardId) {
        return activityService.getBoardActivities(boardId);
    }
}
