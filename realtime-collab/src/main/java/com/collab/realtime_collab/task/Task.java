package com.collab.realtime_collab.task;

import com.collab.realtime_collab.list.TaskList;
import com.collab.realtime_collab.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status = TaskStatus.PENDING;

    private int position; // order in list

    @ManyToOne
    @JoinColumn(name = "list_id")
    private TaskList list;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;
    
    public enum TaskStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED
    }
}
