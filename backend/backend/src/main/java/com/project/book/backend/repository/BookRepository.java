package com.project.book.backend.repository;

import com.project.book.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByUser_UserId(Long userId);

}
