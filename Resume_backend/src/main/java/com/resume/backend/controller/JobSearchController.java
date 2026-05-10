package com.resume.backend.controller;

import com.resume.backend.jobs.JobMatchRequest;
import com.resume.backend.jobs.LiveJobSearchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/jobs")
public class JobSearchController {

    private final LiveJobSearchService liveJobSearchService;

    public JobSearchController(LiveJobSearchService liveJobSearchService) {
        this.liveJobSearchService = liveJobSearchService;
    }

    @PostMapping("/match")
    public ResponseEntity<Map<String, Object>> matchJobs(@Valid @RequestBody JobMatchRequest request) {
        return ResponseEntity.ok(liveJobSearchService.searchJobs(request));
    }
}
