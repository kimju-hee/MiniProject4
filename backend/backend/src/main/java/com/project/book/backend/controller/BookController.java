package com.project.book.backend.controller;

import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;
import com.project.book.backend.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<BookResponseDto> getAll() {
        return bookService.findAll();
    }

    @GetMapping("/{id}")
    public BookResponseDto getOne(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @PostMapping
    public BookResponseDto register(@RequestBody BookRequestDto dto) {
        return bookService.save(dto);
    }

    @PutMapping("/{id}")
    public BookResponseDto update(@PathVariable Long id, @RequestBody BookRequestDto dto) {
        return bookService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bookService.delete(id);
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<Map<String, String>> generateCover(@PathVariable Long id) {
        try {
            String coverUrl = bookService.generateCoverImage(id);
            return ResponseEntity.ok(Map.of("coverUrl", coverUrl));
        } catch (RuntimeException e) {
            // AI 표지 생성 실패 시 적절한 에러 응답
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "AI 표지 생성에 실패했습니다",
                        "message", e.getMessage(),
                        "coverUrl", ""
                    ));
        }
    }

    // 새로운 엔드포인트: 책 데이터로 AI 표지 미리 생성
    @PostMapping("/preview-cover")
    public ResponseEntity<Map<String, String>> previewCover(@RequestBody BookRequestDto dto) {
        try {
            String coverUrl = bookService.generateCoverFromData(dto);
            return ResponseEntity.ok(Map.of("coverUrl", coverUrl));
        } catch (RuntimeException e) {
            // AI 표지 생성 실패 시 적절한 에러 응답
            System.err.println("❌ AI 표지 미리보기 생성 실패: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "AI 표지 생성에 실패했습니다",
                        "message", e.getMessage(),
                        "details", "OpenAI API 키 설정을 확인해주세요",
                        "coverUrl", ""
                    ));
        }
    }
}