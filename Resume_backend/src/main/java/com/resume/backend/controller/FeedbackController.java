package com.resume.backend.controller;

import com.resume.backend.feedback.FeedbackRequest;
import com.resume.backend.feedback.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> sendFeedback(@Valid @RequestBody FeedbackRequest request) {
        feedbackService.sendFeedback(request);
        return ResponseEntity.ok(Map.of("message", "Feedback sent successfully."));
    }
}
