package com.project.book.backend.dto;

import java.time.LocalDateTime;

public class BookResponseDto {
    private Long bookId;
    private String title;
    private String content;
    private String coverUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
}
