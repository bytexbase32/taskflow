
package com.taskflow.controllers;

import com.taskflow.dto.UserResponse;
import com.taskflow.services.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getMyProfile(
            @AuthenticationPrincipal Jwt jwt) {
        return userService.getUserById(currentUserId(jwt));
    }

    @PatchMapping("/me")
    public UserResponse updateMyProfile(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @AuthenticationPrincipal Jwt jwt) {
        return userService.updateProfile(currentUserId(jwt), name, email);
    }

    private Long currentUserId(Jwt jwt) {
        return Long.parseLong(jwt.getSubject());
    }
}
