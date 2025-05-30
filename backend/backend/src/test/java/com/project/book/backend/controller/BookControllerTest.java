package com.project.book.backend.controller;

import com.project.book.backend.controller.BookController;
import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;
import com.project.book.backend.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class BookControllerTest {

    @Mock
    private BookService bookService;

    @InjectMocks
    private BookController bookController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(bookController).build();
    }

    @Test
    void testGetAll() throws Exception {
        BookResponseDto dto = createSampleBook(1L, "테스트 책");
        when(bookService.findAll()).thenReturn(List.of(dto));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk());
        // jsonPath 등 추가 검증 가능
    }

    // 이하 생략: createSampleBook 메서드 등은 앞서 드린 예시 참조

    private BookResponseDto createSampleBook(Long id, String title) {
        BookResponseDto dto = new BookResponseDto();
        try {
            var idField = BookResponseDto.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(dto, id);

            var titleField = BookResponseDto.class.getDeclaredField("title");
            titleField.setAccessible(true);
            titleField.set(dto, title);

            var contentField = BookResponseDto.class.getDeclaredField("content");
            contentField.setAccessible(true);
            contentField.set(dto, "테스트 내용");

            var createdAtField = BookResponseDto.class.getDeclaredField("createdAt");
            createdAtField.setAccessible(true);
            createdAtField.set(dto, LocalDateTime.now());

            var updatedAtField = BookResponseDto.class.getDeclaredField("updatedAt");
            updatedAtField.setAccessible(true);
            updatedAtField.set(dto, LocalDateTime.now());

            var coverUrlField = BookResponseDto.class.getDeclaredField("coverUrl");
            coverUrlField.setAccessible(true);
            coverUrlField.set(dto, "https://example.com/test.jpg");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return dto;
    }
}
