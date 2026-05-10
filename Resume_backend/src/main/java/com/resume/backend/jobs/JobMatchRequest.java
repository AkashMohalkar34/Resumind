package com.resume.backend.jobs;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record JobMatchRequest(
        @NotBlank String resumeText,
        String role,
        List<String> skills,
        String location
) {
}
