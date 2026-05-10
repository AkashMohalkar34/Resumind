package com.resume.backend.Service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public interface ResumeService {

    Map<String , Object> generateResumeResponse(String userResumeDescription) throws IOException;

}
