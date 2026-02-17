package com.collab.realtime_collab.activity;

import com.collab.realtime_collab.board.Board;
import com.collab.realtime_collab.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private ActivityType type;

    private String description; // e.g., "created task 'Buy groceries'"

    @CreationTimestamp
    private LocalDateTime timestamp;

    public enum ActivityType {
        TASK_CREATED,
        TASK_UPDATED,
        TASK_DELETED,
        TASK_MOVED,
        TASK_ASSIGNED,
        LIST_CREATED,
        LIST_UPDATED,
        LIST_DELETED,
        BOARD_UPDATED
    }
}
