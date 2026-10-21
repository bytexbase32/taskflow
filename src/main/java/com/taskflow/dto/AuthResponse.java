
package com.taskflow.dto;

public record AuthResponse(
        UserResponse user,
        String token,
        String tokenType
) {}
