package com.resume.backend.controller;


import com.resume.backend.ResumeRequest;
import com.resume.backend.Service.ResumeService;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")

public class ResumeController {

    private ResumeService resumeService;

    public ResumeController(ResumeService  resumeService){
        this.resumeService = resumeService;
    }

    @GetMapping("/hi")
    public String hello(){
        return "hielsdkfasdkf";
    }
    @PostMapping("/generate")
    public ResponseEntity<Map<String ,Object>> getResumeData
            (@RequestBody ResumeRequest request) throws IOException {
       Map<String , Object> stringObjectMap =  resumeService.generateResumeResponse(request.userDescription());

       return new ResponseEntity<>(stringObjectMap , HttpStatus.OK);
    }
}
