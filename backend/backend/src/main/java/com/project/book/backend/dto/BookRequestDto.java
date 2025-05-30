package com.project.book.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDto {
    private String title;
    private String content;
    private String coverUrl;
    private Long userId;
    private String bookCategori;
    private String bookTag;
}
