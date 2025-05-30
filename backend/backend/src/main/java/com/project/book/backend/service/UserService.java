package com.project.book.backend.service;

import com.project.book.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.project.book.backend.dto.UserRequestDto;
import com.project.book.backend.dto.UserResponseDto;
import com.project.book.backend.entity.User;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    //재검토
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
    }

    public User saveOrUpdateUser(Long userId, UserRequestDto userDto) {
        User user = userRepository.findById(userId)
                .orElse(new User());
        user.setName(userDto.getName());
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
