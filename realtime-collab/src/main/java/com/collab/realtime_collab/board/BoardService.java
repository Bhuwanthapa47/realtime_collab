package com.collab.realtime_collab.board;

import com.collab.realtime_collab.repository.UserRepository;
import com.collab.realtime_collab.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepo;
    private final UserRepository userRepo;

    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        return userRepo.findByEmail(email).orElseThrow();
    }

    public Board createBoard(String name, String description) {
        User user = getCurrentUser();

        Board board = Board.builder()
                .name(name)
                .description(description)
                .createdBy(user)
                .createdAt(LocalDateTime.now())
                .build();

        return boardRepo.save(board);
    }

    public List<Board> myBoards() {
        return boardRepo.findByCreatedBy(getCurrentUser());
    }
    
    public Board getBoardById(Long id) {
        return boardRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
    }
    
    public Board updateBoard(Long id, String name, String description) {
        Board board = getBoardById(id);
        board.setName(name);
        board.setDescription(description);
        return boardRepo.save(board);
    }
    
    public void deleteBoard(Long id) {
        boardRepo.deleteById(id);
    }
}
