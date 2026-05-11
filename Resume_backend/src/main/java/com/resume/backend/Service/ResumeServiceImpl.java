

package com.resume.backend.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final ObjectMapper objectMapper;

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private static final String MODEL = "llama-3.1-8b-instant";

    public ResumeServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {

        // 1️⃣ Load prompt
        String template = loadPromptFromFile("resume_prompt.txt");
        String finalPrompt = replaceTemplate(template, Map.of(
                "userDescription", userResumeDescription
        ));

        // 2️⃣ Call Groq API
        String rawResponse = callGroqAPI(finalPrompt);
        System.out.println("Raw Groq Response:\n" + rawResponse);

        // 3️⃣ Extract text
        String extractedText = extractText(rawResponse);
        System.out.println("Extracted Text:\n" + extractedText);

        // 4️⃣ Parse JSON
        return parseJsonResponse(extractedText);
    }

    // ================= API CALL =================

    private String callGroqAPI(String prompt) {

        WebClient webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
        );

        try {
            return webClient.post()
                    .uri(GROQ_URL)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

        } catch (WebClientResponseException e) {
            throw new RuntimeException(
                    "Groq API Error: " + e.getRawStatusCode() + " → " + e.getResponseBodyAsString()
            );
        }
    }

    // ================= RESPONSE PARSING =================

    private String extractText(String responseJson) {
        try {
            Map<String, Object> map = objectMapper.readValue(responseJson, Map.class);

            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) map.get("choices");

            if (choices == null || choices.isEmpty()) return "";

            Map<String, Object> message =
                    (Map<String, Object>) choices.get(0).get("message");

            return (String) message.get("content");

        } catch (Exception e) {
            throw new RuntimeException("Error extracting Groq response", e);
        }
    }

    private Map<String, Object> parseJsonResponse(String text) {

        Map<String, Object> result = new HashMap<>();

        if (text == null || text.isBlank()) {
            result.put("data", null);
            return result;
        }

        String json;
        int start = text.indexOf("```json");
        int end = text.lastIndexOf("```");

        if (start != -1 && end != -1) {
            json = text.substring(start + 7, end).trim();
        } else {
            json = text.trim();
        }

        try {
            result.put("data", objectMapper.readValue(json, Map.class));
        } catch (Exception e) {
            result.put("data", null);
        }

        return result;
    }

    // ================= UTIL =================

    private String loadPromptFromFile(String fileName) throws IOException {
        ClassPathResource resource = new ClassPathResource(fileName);
        try (InputStream inputStream = resource.getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private String replaceTemplate(String template, Map<String, String> values) {
        for (var entry : values.entrySet()) {
            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
            template = template.replace("{" + entry.getKey() + "}", entry.getValue());
        }
        return template;
    }
}






























//package com.resume.backend.Service;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//import org.springframework.web.reactive.function.client.WebClientResponseException;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class ResumeServiceImpl implements ResumeService {
//
//    private final ObjectMapper objectMapper;
//
//    @Value("${gemini.api.key}")
//    private String apiKey;
//
//    private static final String GEMINI_MODEL = "openai/gpt-oss-20b";
//
//    public ResumeServiceImpl(ObjectMapper objectMapper) {
//        this.objectMapper = objectMapper;
//    }
//
//    @Override
//    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {
//
//        // 1️⃣ Load prompt
//        String promptTemplate = loadPromptFromFile("resume_prompt.txt");
//        String finalPrompt = replaceTemplate(promptTemplate, Map.of(
//                "userDescription", userResumeDescription
//        ));
//
//        // 2️⃣ Call Gemini API
//        String rawResponse = callGeminiAPI(finalPrompt);
//        System.out.println("Raw Gemini Response:\n" + rawResponse);
//
//        // 3️⃣ Extract text
//        String extractedText = extractText(rawResponse);
//        System.out.println("Extracted Text:\n" + extractedText);
//
//        // 4️⃣ Parse JSON
//        return parseJsonResponse(extractedText);
//    }
//
//    // ================= HELPER METHODS =================
//
//    private String callGeminiAPI(String prompt) {
//
//        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
//                + GEMINI_MODEL + ":generateContent";
//
//        WebClient webClient = WebClient.builder()
//                .baseUrl(url)
//                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
//                .build();
//
//        Map<String, Object> body = Map.of(
//                "contents", List.of(
//                        Map.of(
//                                "parts", List.of(
//                                        Map.of("text", prompt)
//                                )
//                        )
//                )
//        );
//
//        try {
//            return webClient.post()
//                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
//                    .bodyValue(body)
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    .block();
//
//        } catch (WebClientResponseException e) {
//            throw new RuntimeException(
//                    "Gemini API Error: " + e.getRawStatusCode() + " → " + e.getResponseBodyAsString()
//            );
//        }
//    }
//
//    private String extractText(String responseJson) {
//        try {
//            Map<String, Object> map = objectMapper.readValue(responseJson, Map.class);
//
//            List<Map<String, Object>> candidates =
//                    (List<Map<String, Object>>) map.get("candidates");
//
//            if (candidates == null || candidates.isEmpty()) return "";
//
//            Map<String, Object> content =
//                    (Map<String, Object>) candidates.get(0).get("content");
//
//            List<Map<String, Object>> parts =
//                    (List<Map<String, Object>>) content.get("parts");
//
//            return (String) parts.get(0).get("text");
//
//        } catch (Exception e) {
//            throw new RuntimeException("Error extracting Gemini response", e);
//        }
//    }
//
//    private Map<String, Object> parseJsonResponse(String text) {
//
//        Map<String, Object> result = new HashMap<>();
//
//        if (text == null || text.isBlank()) {
//            result.put("data", null);
//            return result;
//        }
//
//        String json;
//        int start = text.indexOf("```json");
//        int end = text.lastIndexOf("```");
//
//        if (start != -1 && end != -1) {
//            json = text.substring(start + 7, end).trim();
//        } else {
//            json = text.trim();
//        }
//
//        try {
//            result.put("data", objectMapper.readValue(json, Map.class));
//        } catch (JsonProcessingException e) {
//            result.put("data", null);
//        }
//
//        return result;
//    }
//
//    private String loadPromptFromFile(String fileName) throws IOException {
//        Path path = new ClassPathResource(fileName).getFile().toPath();
//        return Files.readString(path);
//    }
//
//    private String replaceTemplate(String template, Map<String, String> values) {
//        for (var entry : values.entrySet()) {
//            template = template.replace("{" + entry.getKey() + "}", entry.getValue());
//        }
//        return template;
//    }
//}
//
//
//
//
//
//
//
//
//
//
//
//
////package com.resume.backend.Service;
////
////import com.fasterxml.jackson.core.JsonProcessingException;
////import com.fasterxml.jackson.databind.ObjectMapper;
////import org.springframework.beans.factory.annotation.Value;
////import org.springframework.core.io.ClassPathResource;
////import org.springframework.stereotype.Service;
////import org.springframework.web.reactive.function.client.WebClient;
////
////import java.io.IOException;
////import java.nio.file.Files;
////import java.nio.file.Path;
////import java.util.HashMap;
////import java.util.Map;
////
////@Service
////public class ResumeServiceImpl implements ResumeService {
////
////    private final ObjectMapper objectMapper;
////
////    @Value("${gemini.api.key}")
////    private String apiKey;
////
////    public ResumeServiceImpl(ObjectMapper objectMapper) {
////        this.objectMapper = objectMapper;
////    }
////
////    @Override
////    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {
////        // Load prompt template from file
////        String promptString = loadPromptFromFile("resume_prompt.txt");
////        String promptContent = putValueToTemplates(promptString, Map.of("userDescription", userResumeDescription));
////
////        // Call Gemini API
////        String response = callGeminiAPI(promptContent);
////
////        System.out.println("Raw AI Response: " + response);
////
////        // Parse response (supports JSON inside markdown or plain JSON)
////        return parseMultipleResponses(response);
////    }
////
////    private String loadPromptFromFile(String filename) throws IOException {
////        Path path = new ClassPathResource(filename).getFile().toPath();
////        return Files.readString(path);
////    }
////
////    private String putValueToTemplates(String template, Map<String, String> values) {
////        for (Map.Entry<String, String> entry : values.entrySet()) {
////            template = template.replace("{" + entry.getKey() + "}", entry.getValue());
////        }
////        return template;
////    }
////
////    private String callGeminiAPI(String promptContent) {
////        try {
////            WebClient webClient = WebClient.builder()
////                    .baseUrl("https://generativelanguage.googleapis.com/v1beta")
////                    .build();
////
////            Map<String, Object> requestBody = Map.of(
////                    "contents", new Object[] {
////                            Map.of("parts", new Object[] {
////                                    Map.of("text", promptContent)
////                            })
////                    }
////            );
////
////            String response = webClient.post()
////                    .uri("/models/gemini-pro:generateContent?key=" + apiKey)
////                    .bodyValue(requestBody)
////                    .retrieve()
////                    .bodyToMono(String.class)
////                    .block();
////
////            return response != null ? response : "";
////        } catch (Exception e) {
////            e.printStackTrace();
////            return "";
////        }
////    }
////
////
////    public Map<String, Object> parseMultipleResponses(String response) {
////        Map<String, Object> jsonResponse = new HashMap<>();
////
////        if (response == null || response.isBlank()) {
////            jsonResponse.put("data", null);
////            return jsonResponse;
////        }
////
////        // Extract JSON from Markdown (```json ... ```)
////        int jsonStart = response.indexOf("```json");
////        int jsonEnd = response.lastIndexOf("```");
////
////        String jsonContent;
////        if (jsonStart != -1 && jsonEnd != -1 && jsonStart < jsonEnd) {
////            jsonContent = response.substring(jsonStart + 7, jsonEnd).trim(); // Remove ```json and ```
////        } else {
////            jsonContent = response.trim(); // Assume response is already JSON if no markdown formatting
////        }
////
////        try {
////            Map<String, Object> dataContent = objectMapper.readValue(jsonContent, Map.class);
////            jsonResponse.put("data", dataContent);
////        } catch (JsonProcessingException e) {
////            System.err.println("Invalid JSON Format in Response: " + e.getMessage());
////            jsonResponse.put("data", null);
////        }
////
////        return jsonResponse;
////    }
////}
