package com.resume.backend.auth;

public record AuthResponse(
        String message,
        UserProfile user
) {
}
