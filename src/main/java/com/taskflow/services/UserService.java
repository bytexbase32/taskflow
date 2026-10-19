package com.taskflow.services;

import com.taskflow.dto.UserResponse;
import com.taskflow.models.User;
import com.taskflow.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = findUser(userId);
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(Long userId, String name, String email) {

        User user = findUser(userId);

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }

        if (email != null && !email.isBlank()) {
            boolean emailUsed = userRepository.existsByEmail(email);

            if (emailUsed && !email.equals(user.getEmail())) {
                throw new IllegalArgumentException(
                        "Email is already in use");
            }

            user.setEmail(email);
        }

        return toResponse(userRepository.save(user));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
