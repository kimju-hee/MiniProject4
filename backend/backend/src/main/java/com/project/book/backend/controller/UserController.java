package com.project.book.backend.controller;

import com.project.book.backend.dto.UserRequestDto;
import com.project.book.backend.entity.User;
import com.project.book.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 모든 사용자 조회
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    // 특정 사용자 조회
    @GetMapping("/{userId}")
    public User getUser(@PathVariable Long userId) {
        return userService.findUserById(userId);
    }

    // 사용자 등록/수정
    @PostMapping("/{userId}")
    public Map<String, String> saveUser(@PathVariable Long userId, @RequestBody UserRequestDto userDto) {
        userService.saveOrUpdateUser(userId, userDto);
        return Collections.singletonMap("message", "사용자가 수정되었습니다.");
    }

    // 사용자 삭제
    @DeleteMapping("/{userId}")
    public Map<String, String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return Collections.singletonMap("message", "사용자가 삭제되었습니다.");
    }
}

