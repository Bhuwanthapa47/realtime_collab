package com.collab.realtime_collab.board;

import com.collab.realtime_collab.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByCreatedBy(User createdBy);
}
