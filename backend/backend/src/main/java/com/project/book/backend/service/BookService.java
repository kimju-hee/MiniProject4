package com.project.book.backend.service;

import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;
import com.project.book.backend.entity.Book;
import com.project.book.backend.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BookResponseDto> findAll() {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .map(book -> new BookResponseDto(book))
                .collect(Collectors.toList());
    }

    public BookResponseDto findById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 없습니다. id=" + id));
        return new BookResponseDto(book);
    }

    public BookResponseDto save(BookRequestDto dto) {
        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setContent(dto.getContent());
        book.setCoverUrl(dto.getCoverUrl());
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());
        book.setBookCategory(dto.getBookCategory());
        book.setBookTag(dto.getBookTag());

        Book savedBook = bookRepository.save(book);
        return new BookResponseDto(savedBook);
    }

    public BookResponseDto update(Long id, BookRequestDto dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 없습니다. id=" + id));
        book.setTitle(dto.getTitle());
        book.setContent(dto.getContent());
        book.setUpdatedAt(LocalDateTime.now());
        book.setBookCategory(dto.getBookCategory());
        book.setBookTag(dto.getBookTag());

        Book updatedBook = bookRepository.save(book);
        return new BookResponseDto(updatedBook);
    }

    public void delete(Long id) {
        bookRepository.deleteById(id);
    }

    public String generateCoverImage(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 없습니다. id=" + id));
        String coverUrl = "https://fakeimage.com/covers/" + id + ".jpg";
        book.setCoverUrl(coverUrl);
        bookRepository.save(book);

        return coverUrl;
    }
}
