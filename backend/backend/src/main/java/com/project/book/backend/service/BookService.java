package com.project.book.backend.service;

import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;

import java.util.List;

public interface BookService {
    List<BookResponseDto> findAll();
    BookResponseDto findById(Long id);
    BookResponseDto save(BookRequestDto dto);
    BookResponseDto update(Long id, BookRequestDto dto);
    void delete(Long id);
    String generateCoverImage(Long id);
}