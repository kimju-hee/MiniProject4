package com.project.book.backend.service;

import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;
import com.project.book.backend.entity.Book;
import com.project.book.backend.entity.User;
import com.project.book.backend.repository.BookRepository;
import com.project.book.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    public BookService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<BookResponseDto> findAll() {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .map(BookResponseDto::new)
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

        // User 설정
        User user = getOrCreateUser(dto.getUserId());
        book.setUser(user);

        Book savedBook = bookRepository.save(book);
        return new BookResponseDto(savedBook);
    }

    public BookResponseDto update(Long id, BookRequestDto dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 없습니다. id=" + id));
        
        book.setTitle(dto.getTitle());
        book.setContent(dto.getContent());
        book.setCoverUrl(dto.getCoverUrl());
        book.setUpdatedAt(LocalDateTime.now());
        book.setBookCategory(dto.getBookCategory());
        book.setBookTag(dto.getBookTag());

        // User 업데이트 (userId가 제공된 경우)
        if (dto.getUserId() != null) {
            User user = getOrCreateUser(dto.getUserId());
            book.setUser(user);
        }

        Book updatedBook = bookRepository.save(book);
        return new BookResponseDto(updatedBook);
    }

    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 도서가 없습니다. id=" + id);
        }
        bookRepository.deleteById(id);
    }

    public String generateCoverImage(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 없습니다. id=" + id));
        
        String coverUrl;
        
        if (openaiApiKey != null && !openaiApiKey.trim().isEmpty()) {
            // 실제 OpenAI API 사용
            coverUrl = generateWithOpenAI(book);
        } else {
            // API 키가 없으면 가상의 URL 생성
            System.out.println("⚠️ OpenAI API 키가 설정되지 않아 가상 표지를 생성합니다.");
            coverUrl = "https://picsum.photos/300/400?random=" + System.currentTimeMillis();
        }
        
        book.setCoverUrl(coverUrl);
        book.setUpdatedAt(LocalDateTime.now());
        bookRepository.save(book);

        return coverUrl;
    }

    private String generateWithOpenAI(Book book) {
        try {
            // 프롬프트 생성
            String prompt = createPrompt(book);
            System.out.println("🎨 생성 프롬프트: " + prompt);

            // OpenAI API 호출
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + openaiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "dall-e-3");
            requestBody.put("prompt", prompt);
            requestBody.put("n", 1);
            requestBody.put("size", "1024x1024");
            requestBody.put("quality", "standard");
            requestBody.put("style", "vivid");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/images/generations", 
                request, 
                String.class
            );

            // 응답에서 이미지 URL 추출
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            String imageUrl = jsonNode.get("data").get(0).get("url").asText();
            
            System.out.println("✅ OpenAI로 북커버 생성 완료: " + imageUrl);
            return imageUrl;

        } catch (Exception e) {
            System.err.println("❌ OpenAI API 호출 실패: " + e.getMessage());
            e.printStackTrace();
            // 실패 시 가상의 URL 반환
            return "https://picsum.photos/300/400?random=" + System.currentTimeMillis();
        }
    }

    private String createPrompt(Book book) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Create a professional book cover illustration for a book titled '")
              .append(book.getTitle())
              .append("'");
        
        if (book.getBookCategory() != null && !book.getBookCategory().trim().isEmpty()) {
            prompt.append(" in the ").append(book.getBookCategory()).append(" genre");
        }
        
        if (book.getBookTag() != null && !book.getBookTag().trim().isEmpty()) {
            prompt.append(". Key themes include: ").append(book.getBookTag());
        }
        
        if (book.getContent() != null && !book.getContent().trim().isEmpty()) {
            // 내용의 처음 200자만 사용
            String contentSummary = book.getContent().length() > 200 
                ? book.getContent().substring(0, 200) + "..." 
                : book.getContent();
            prompt.append(". Story summary: ").append(contentSummary);
        }
        
        prompt.append(". Design should be eye-catching, professional, and suitable for book cover with clear title space. ")
              .append("Style should match the genre and mood of the book. ")
              .append("Avoid any text on the image.");
        
        return prompt.toString();
    }

    // 특정 사용자의 책 목록 조회
    public List<BookResponseDto> findByUserId(Long userId) {
        List<Book> books = bookRepository.findByUser_UserId(userId);
        return books.stream()
                .map(BookResponseDto::new)
                .collect(Collectors.toList());
    }

    // 사용자 조회 또는 생성
    private User getOrCreateUser(Long userId) {
        if (userId != null) {
            return userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. userId=" + userId));
        } else {
            // userId가 null인 경우 기본 사용자 반환 (첫 번째 사용자)
            return userRepository.findAll().stream()
                    .findFirst()
                    .orElseGet(() -> {
                        // 사용자가 없으면 기본 사용자 생성
                        User newUser = new User();
                        newUser.setName("기본 사용자");
                        return userRepository.save(newUser);
                    });
        }
    }
}