package com.project.book.backend.controller;

import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;
import com.project.book.backend.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public String generateCover(@PathVariable Long id) {
        return bookService.generateCoverImage(id);
    }
}