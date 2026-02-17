package com.collab.realtime_collab.list;

import com.collab.realtime_collab.board.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    List<TaskList> findByBoardOrderByPosition(Board board);
}
