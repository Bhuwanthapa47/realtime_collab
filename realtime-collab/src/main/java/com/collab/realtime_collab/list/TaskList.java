package com.collab.realtime_collab.list;

import com.collab.realtime_collab.board.Board;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int position; // order inside board

    @ManyToOne
    private Board board;
}
