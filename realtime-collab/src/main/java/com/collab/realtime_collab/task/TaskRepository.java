package com.collab.realtime_collab.task;

import com.collab.realtime_collab.list.TaskList;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByListOrderByPosition(TaskList list);
    Page<Task> findByListId(Long listId, Pageable pageable);
    List<Task> findByTitleContainingIgnoreCase(String keyword);


}
