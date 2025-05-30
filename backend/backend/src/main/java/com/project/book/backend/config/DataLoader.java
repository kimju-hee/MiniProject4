package com.project.book.backend.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.project.book.backend.entity.Book;
import com.project.book.backend.entity.User;
import com.project.book.backend.repository.BookRepository;
import com.project.book.backend.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public DataLoader(UserRepository userRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 기본 사용자가 없을 때만 생성
        if (userRepository.count() == 0) {
            // 기본 사용자 생성 (ID는 자동 생성)
            User defaultUser = new User();
            defaultUser.setName("기본 사용자");
            User savedUser = userRepository.save(defaultUser);
            
            System.out.println("✅ 기본 사용자가 생성되었습니다! (ID: " + savedUser.getUserId() + ")");

            // 샘플 책 데이터 생성
            createSampleBooks(savedUser);
        } else {
            System.out.println("✅ 기존 사용자 데이터가 존재합니다.");
        }
    }

    private void createSampleBooks(User user) {
        // 샘플 책 1
        Book book1 = new Book();
        book1.setTitle("AI와 함께하는 미래");
        book1.setContent("인공지능이 우리의 삶을 어떻게 변화시킬지에 대한 이야기입니다. " +
                "기술의 발전과 함께 인간의 역할은 어떻게 변할까요? " +
                "이 책은 AI 시대를 살아가는 우리에게 필요한 통찰을 제공합니다.\n\n" +
                "챕터 1: AI의 역사와 발전\n" +
                "챕터 2: 현재의 AI 기술들\n" +
                "챗터 3: 미래의 AI 전망\n" +
                "챕터 4: 인간과 AI의 공존");
        book1.setCoverUrl("https://picsum.photos/300/400?random=1");
        book1.setBookCategory("과학/기술");
        book1.setBookTag("AI, 미래, 기술");
        book1.setCreatedAt(LocalDateTime.now().minusDays(7));
        book1.setUpdatedAt(LocalDateTime.now().minusDays(7));
        book1.setUser(user);
        bookRepository.save(book1);

        // 샘플 책 2
        Book book2 = new Book();
        book2.setTitle("작은 습관의 힘");
        book2.setContent("매일 조금씩 실천하는 작은 습관들이 인생을 어떻게 바꿀 수 있는지에 대한 이야기입니다. " +
                "성공한 사람들의 공통점은 무엇일까요? " +
                "바로 좋은 습관을 꾸준히 실천하는 것입니다. " +
                "이 책과 함께 당신만의 성공 습관을 만들어보세요.\n\n" +
                "1부: 습관의 과학\n" +
                "2부: 좋은 습관 만들기\n" +
                "3부: 나쁜 습관 끊기\n" +
                "4부: 습관의 복리 효과");
        book2.setCoverUrl("https://picsum.photos/300/400?random=2");
        book2.setBookCategory("자기계발");
        book2.setBookTag("습관, 성장, 자기계발");
        book2.setCreatedAt(LocalDateTime.now().minusDays(5));
        book2.setUpdatedAt(LocalDateTime.now().minusDays(5));
        book2.setUser(user);
        bookRepository.save(book2);

        // 샘플 책 3
        Book book3 = new Book();
        book3.setTitle("한국의 사계절");
        book3.setContent("아름다운 우리나라의 사계절을 담은 에세이입니다. " +
                "봄의 벚꽃, 여름의 푸른 바다, 가을의 단풍, 겨울의 하얀 눈... " +
                "각 계절마다 다른 매력을 가진 한국의 자연을 글로 만나보세요.\n\n" +
                "봄: 새로운 시작의 계절\n" +
                "여름: 생명력 넘치는 계절\n" +
                "가을: 풍요로운 수확의 계절\n" +
                "겨울: 고요한 성찰의 계절");
        book3.setCoverUrl("https://picsum.photos/300/400?random=3");
        book3.setBookCategory("에세이");
        book3.setBookTag("계절, 자연, 한국");
        book3.setCreatedAt(LocalDateTime.now().minusDays(3));
        book3.setUpdatedAt(LocalDateTime.now().minusDays(3));
        book3.setUser(user);
        bookRepository.save(book3);

        System.out.println("✅ 샘플 책 3권이 성공적으로 생성되었습니다!");
    }
}