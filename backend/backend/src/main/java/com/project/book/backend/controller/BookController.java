package com.project.book.backend.controller;

import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;
import com.project.book.backend.service.BookService;
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
    public Map<String, String> generateCover(@PathVariable Long id) {
        String coverUrl = bookService.generateCoverImage(id);
        return Map.of("coverUrl", coverUrl);
    }

    // 새로운 엔드포인트: 책 데이터로 AI 표지 미리 생성
    @PostMapping("/preview-cover")
    public Map<String, String> previewCover(@RequestBody BookRequestDto dto) {
        String coverUrl = bookService.generateCoverFromData(dto);
        return Map.of("coverUrl", coverUrl);
    }
}