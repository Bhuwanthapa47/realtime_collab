package com.collab.realtime_collab.board;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public Board create(@RequestBody Board board) {
        return boardService.createBoard(board.getName(), board.getDescription());
    }

    @GetMapping
    public List<Board> myBoards() {
        return boardService.myBoards();
    }
    
    @GetMapping("/{id}")
    public Board getBoard(@PathVariable Long id) {
        return boardService.getBoardById(id);
    }
    
    @PutMapping("/{id}")
    public Board updateBoard(@PathVariable Long id, @RequestBody Board board) {
        return boardService.updateBoard(id, board.getName(), board.getDescription());
    }
    
    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
    }
}
