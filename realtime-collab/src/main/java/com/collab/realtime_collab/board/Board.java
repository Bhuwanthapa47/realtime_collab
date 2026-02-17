package com.collab.realtime_collab.board;

import com.collab.realtime_collab.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(length = 500)
    private String description;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User createdBy;

    private LocalDateTime createdAt;
}
