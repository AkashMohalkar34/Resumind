package com.resume.backend.jobs;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class LiveJobSearchService {

    private static final int LIVE_RESULT_LIMIT = 50;
    private static final int RESULTS_PER_PAGE = 10;

    private static final List<String> SUPPORTED_DOMAINS = List.of(
            "linkedin.com/jobs",
            "indeed.com",
            "naukri.com",
            "foundit.in",
            "unstop.com/jobs",
            "acciojob.com/jobs"
    );

    private final ObjectMapper objectMapper;
    private final WebClient webClient;

    @Value("${serpapi.api-key:}")
    private String serpApiKey;

    public LiveJobSearchService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder().build();
    }

    public Map<String, Object> searchJobs(JobMatchRequest request) {
        if (serpApiKey == null || serpApiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatusCode.valueOf(503),
                    "Live job search is not configured. Set SERPAPI_API_KEY in the backend environment."
            );
        }

        String query = buildQuery(request);

        try {
            List<Map<String, Object>> jobs = new ArrayList<>();
            Set<String> seenLinks = new LinkedHashSet<>();

            for (int start = 0; start < LIVE_RESULT_LIMIT; start += RESULTS_PER_PAGE) {
                String response = fetchResultsPage(query, request.location(), start);
                if (response == null || response.isBlank()) {
                    break;
                }

                Map<String, Object> payload = objectMapper.readValue(
                        response, new TypeReference<>() {
                        });

                List<Map<String, Object>> items =
                        (List<Map<String, Object>>) payload.getOrDefault("organic_results", List.of());

                if (items.isEmpty()) {
                    break;
                }

                int beforePageCount = jobs.size();
                for (Map<String, Object> item : items) {
                    if (jobs.size() >= LIVE_RESULT_LIMIT) {
                        break;
                    }

                    String title = stringValue(item.get("title"));
                    String link = stringValue(item.get("link"));
                    if (title.isBlank() || link.isBlank() || !seenLinks.add(link)) {
                        continue;
                    }

                    String snippet = stringValue(item.get("snippet"));
                    String platform = detectPlatform(link);
                    List<String> matchedKeywords = findMatchedKeywords(title + " " + snippet, request.skills());

                    Map<String, Object> job = new LinkedHashMap<>();
                    job.put("title", title);
                    job.put("company", platform);
                    job.put("location", stringValue(request.location()));
                    job.put("description", snippet);
                    job.put("matchedKeywords", matchedKeywords);
                    job.put("match_score", calculateScore(matchedKeywords, jobs.size()));
                    job.put("platform_links", List.of(Map.of(
                            "name", platform,
                            "url", link
                    )));
                    job.put("search_query", query);
                    jobs.add(job);
                }

                if (jobs.size() == beforePageCount || items.size() < RESULTS_PER_PAGE) {
                    break;
                }
            }

            return Map.of(
                    "query", query,
                    "jobs", jobs,
                    "source", "live"
            );
        } catch (Exception error) {
            throw new ResponseStatusException(
                    HttpStatusCode.valueOf(502),
                    "Unable to parse live job results.",
                    error
            );
        }
    }

    private String fetchResultsPage(String query, String location, int start) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("serpapi.com")
                        .path("/search.json")
                        .queryParam("engine", "google")
                        .queryParam("api_key", serpApiKey)
                        .queryParam("q", query)
                        .queryParam("num", RESULTS_PER_PAGE)
                        .queryParam("start", start)
                        .queryParam("google_domain", "google.com")
                        .queryParamIfPresent("location", optionalString(location))
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    private String buildQuery(JobMatchRequest request) {
        Set<String> queryParts = new LinkedHashSet<>();
        String role = stringValue(request.role());
        if (!role.isBlank()) {
            queryParts.add("\"" + role + "\"");
        }

        List<String> skills = request.skills() == null ? List.of() : request.skills();
        skills.stream()
                .map(this::stringValue)
                .filter(value -> !value.isBlank())
                .limit(4)
                .forEach(queryParts::add);

        String location = stringValue(request.location());
        if (!location.isBlank()) {
            queryParts.add("\"" + location + "\"");
        }

        String domainQuery = SUPPORTED_DOMAINS.stream()
                .map(domain -> "site:" + domain)
                .reduce((left, right) -> left + " OR " + right)
                .orElse("");

        return "(" + domainQuery + ") " + String.join(" ", queryParts) + " jobs";
    }

    private Optional<String> optionalString(String value) {
        String normalized = stringValue(value);
        return normalized.isBlank() ? Optional.empty() : Optional.of(normalized);
    }

    private List<String> findMatchedKeywords(String text, List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return List.of();
        }

        String normalizedText = normalize(text);
        List<String> matches = new ArrayList<>();
        for (String skill : skills) {
            String normalizedSkill = normalize(skill);
            if (!normalizedSkill.isBlank() && normalizedText.contains(normalizedSkill)) {
                matches.add(skill);
            }
            if (matches.size() == 4) {
                break;
            }
        }
        return matches;
    }

    private int calculateScore(List<String> matchedKeywords, int index) {
        int base = matchedKeywords.isEmpty() ? 42 : 55 + (matchedKeywords.size() * 10);
        int rankAdjustment = Math.max(0, 10 - (index * 2));
        return Math.min(100, base + rankAdjustment);
    }

    private String detectPlatform(String link) {
        String normalizedLink = stringValue(link).toLowerCase(Locale.ROOT);
        if (normalizedLink.contains("linkedin.com")) {
            return "LinkedIn";
        }
        if (normalizedLink.contains("indeed.com")) {
            return "Indeed";
        }
        if (normalizedLink.contains("naukri.com")) {
            return "Naukri";
        }
        if (normalizedLink.contains("foundit.in")) {
            return "Foundit";
        }
        if (normalizedLink.contains("unstop.com")) {
            return "Unstop";
        }
        if (normalizedLink.contains("acciojob.com")) {
            return "AccioJob";
        }
        return "Job Platform";
    }

    private String normalize(String value) {
        return stringValue(value)
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9+#.\\s-]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String stringValue(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }
}
