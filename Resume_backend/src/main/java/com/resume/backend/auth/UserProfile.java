package com.resume.backend.auth;

public record UserProfile(
        Long id,
        String fullName,
        String email
) {
}
