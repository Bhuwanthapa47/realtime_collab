package com.collab.realtime_collab.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByBoardIdOrderByTimestampDesc(Long boardId);
    List<Activity> findTop20ByBoardIdOrderByTimestampDesc(Long boardId);
}
