package com.project.book.backend.dto;

import com.project.book.backend.entity.Book;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class BookResponseDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String coverUrl;
    private String bookCategory;
    private String bookTag;

    public BookResponseDto(Book book) {
        this.id = book.getBookId();
        this.title = book.getTitle();
        this.content = book.getContent();
        this.createdAt = book.getCreatedAt();
        this.updatedAt = book.getUpdatedAt();
        this.coverUrl = book.getCoverUrl();
        this.bookCategory = book.getBookCategory();
        this.bookTag = book.getBookTag();
    }
}

