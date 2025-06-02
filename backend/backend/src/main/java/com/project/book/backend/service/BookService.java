package com.project.book.backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.book.backend.dto.BookRequestDto;
import com.project.book.backend.dto.BookResponseDto;
import com.project.book.backend.entity.Book;
import com.project.book.backend.entity.User;
import com.project.book.backend.repository.BookRepository;
import com.project.book.backend.repository.UserRepository;

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

    // 기존 책의 표지 생성
    public String generateCoverImage(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 없습니다. id=" + id));
        
        String coverUrl = generateCoverFromBookData(book.getTitle(), book.getContent(), 
                                                   book.getBookCategory(), book.getBookTag());
        
        book.setCoverUrl(coverUrl);
        book.setUpdatedAt(LocalDateTime.now());
        bookRepository.save(book);

        return coverUrl;
    }

    // 새로운 메서드: 책 데이터로 바로 표지 생성
    public String generateCoverFromData(BookRequestDto dto) {
        return generateCoverFromBookData(dto.getTitle(), dto.getContent(), 
                                       dto.getBookCategory(), dto.getBookTag());
    }

    // 실제 AI 표지 생성 로직
    private String generateCoverFromBookData(String title, String content, String category, String tag) {
        // OpenAI API 키 검증 개선
        if (openaiApiKey == null || openaiApiKey.trim().isEmpty() || 
            openaiApiKey.equals("sk-") || openaiApiKey.startsWith("sk-proj-your") || 
            openaiApiKey.contains("your-actual-api-key")) {
            
            System.out.println("⚠️ OpenAI API 키가 설정되지 않았습니다. 환경변수 OPENAI_API_KEY를 설정하거나 application.properties에서 올바른 키를 입력해주세요.");
            System.out.println("현재 설정된 키: " + (openaiApiKey != null ? openaiApiKey.substring(0, Math.min(10, openaiApiKey.length())) + "..." : "null"));
            
            // 개발용 가상 표지 (실제 운영에서는 에러를 던지는 것이 좋음)
            return "https://picsum.photos/400/600?random=" + System.currentTimeMillis();
        }

        try {
            String prompt = createDetailedPrompt(title, content, category, tag);
            System.out.println("🎨 AI 표지 생성 프롬프트: " + prompt);

            return callOpenAIImageGeneration(prompt);

        } catch (Exception e) {
            System.err.println("❌ OpenAI API 호출 실패: " + e.getMessage());
            e.printStackTrace();
            
            // API 호출 실패 시에도 의미있는 오류 메시지와 함께 예외 발생
            throw new RuntimeException("AI 표지 생성에 실패했습니다: " + e.getMessage(), e);
        }
    }

    private String callOpenAIImageGeneration(String prompt) throws Exception {
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

        System.out.println("🔗 OpenAI API 호출 시작...");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
            "https://api.openai.com/v1/images/generations", 
            request, 
            String.class
        );

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("OpenAI API 호출 실패: " + response.getStatusCode() + " - " + response.getBody());
        }

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        String imageUrl = jsonNode.get("data").get(0).get("url").asText();
        
        System.out.println("✅ OpenAI로 북커버 생성 완료: " + imageUrl);
        return imageUrl;
    }

    private String createDetailedPrompt(String title, String content, String category, String tag) {
        StringBuilder prompt = new StringBuilder();
        
        // 기본 프롬프트 - 책 표지 디자인에 중점
        prompt.append("Create a professional book cover design (front cover only, no book spine or 3D effect) for a book titled \"")
              .append(title != null ? title : "Untitled")
              .append("\"");
        
        // 장르 정보 추가
        if (category != null && !category.trim().isEmpty()) {
            prompt.append(" in the ").append(category).append(" genre");
        }
        
        // 태그 정보 추가 (키워드)
        if (tag != null && !tag.trim().isEmpty()) {
            prompt.append(". Key themes and elements: ").append(tag);
        }
        
        // 내용 요약 추가 (처음 300자)
        if (content != null && !content.trim().isEmpty()) {
            String contentSummary = content.length() > 300 
                ? content.substring(0, 300).replaceAll("\\s+", " ").trim() + "..."
                : content.replaceAll("\\s+", " ").trim();
            prompt.append(". Story context: ").append(contentSummary);
        }
        
        // 디자인 가이드라인 - 평면 표지 디자인에 중점
        prompt.append(". Design requirements: ")
              .append("- Create a flat, 2D book cover design (front cover only, not a 3D book mockup) ")
              .append("- Professional book cover illustration suitable for commercial publishing ")
              .append("- Eye-catching and genre-appropriate visual style ")
              .append("- Artistic composition with balanced layout ")
              .append("- Rich colors and compelling imagery that represents the book's essence ")
              .append("- High-quality illustration or graphic design ")
              .append("- The design should look like a book cover that would be printed on a book ")
              .append("- Avoid showing actual books, book spines, or 3D book objects ")
              .append("- Focus on the cover artwork and design elements only ")
              .append("- No text or letters should be included in the image itself ");
        
        // 장르별 스타일 가이드
        if (category != null) {
            switch (category.toLowerCase()) {
                case "판타지":
                case "fantasy":
                    prompt.append("- Fantasy art style with magical elements, mystical creatures, enchanted landscapes ");
                    break;
                case "로맨스":
                case "romance":
                    prompt.append("- Romantic art style with warm colors, elegant composition, emotional atmosphere ");
                    break;
                case "공포":
                case "horror":
                    prompt.append("- Dark, mysterious artwork with dramatic lighting and gothic elements ");
                    break;
                case "과학":
                case "기술":
                case "science":
                    prompt.append("- Modern, sleek design with technological elements and futuristic aesthetics ");
                    break;
                case "자기계발":
                case "self-help":
                    prompt.append("- Inspirational design with uplifting colors, motivational imagery and clean layout ");
                    break;
                case "에세이":
                case "essay":
                    prompt.append("- Artistic, thoughtful design with sophisticated composition and literary feel ");
                    break;
                default:
                    prompt.append("- Style appropriate to the book's genre and mood ");
            }
        }
        
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