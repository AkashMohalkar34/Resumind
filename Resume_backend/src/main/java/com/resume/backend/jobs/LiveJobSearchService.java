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
                    String company = resolveCompany(item, title, snippet, platform);
                    String location = resolveLocation(item, snippet, request.location());
                    String vacancies = resolveVacancies(item, title, snippet);
                    List<String> matchedKeywords = findMatchedKeywords(title + " " + snippet, request.skills());

                    Map<String, Object> job = new LinkedHashMap<>();
                    job.put("title", title);
                    job.put("company", company);
                    job.put("location", location);
                    job.put("vacancies", vacancies);
                    job.put("description", snippet);
                    job.put("matchedKeywords", matchedKeywords);
                    job.put("match_score", calculateScore(matchedKeywords, jobs.size()));
                    job.put("apply_url", link);
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

    private String resolveCompany(Map<String, Object> item, String title, String snippet, String platform) {
        String snippetCompany = extractCompanyFromSnippet(snippet);
        if (!snippetCompany.isBlank()) {
            return snippetCompany;
        }

        String source = stringValue(item.get("source"));
        if (!source.isBlank() && !looksLikePlatformName(source)) {
            return source;
        }

        String metadata = stringValue(item.get("displayed_link"));
        if (!metadata.isBlank() && !metadata.equalsIgnoreCase(platform) && !looksLikePlatformName(metadata)) {
            return metadata;
        }

        if (title.contains(" - ")) {
            String[] parts = title.split("\\s-\\s", 2);
            if (parts.length == 2 && !parts[1].isBlank() && !looksLikePlatformName(parts[1])) {
                return parts[1].trim();
            }
        }

        return platform;
    }

    private String resolveLocation(Map<String, Object> item, String snippet, String requestLocation) {
        String richSnippetLocation = extractRichSnippetLocation(item);
        if (!richSnippetLocation.isBlank()) {
            return richSnippetLocation;
        }

        if (!stringValue(requestLocation).isBlank()) {
            return stringValue(requestLocation);
        }

        String normalizedSnippet = stringValue(snippet);
        if (normalizedSnippet.toLowerCase(Locale.ROOT).contains("remote")) {
            return "Remote";
        }

        return "Not specified";
    }

    private String resolveVacancies(Map<String, Object> item, String title, String snippet) {
        String richSnippetVacancies = extractRichSnippetValue(item, "vacancies");
        if (!richSnippetVacancies.isBlank()) {
            return richSnippetVacancies;
        }

        String text = stringValue(title) + ". " + stringValue(snippet);
        String lower = text.toLowerCase(Locale.ROOT);

        java.util.regex.Matcher countMatcher = java.util.regex.Pattern
                .compile("\\b(\\d+)\\+?\\s+(openings?|vacancies?|positions?|roles?)\\b", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(text);
        if (countMatcher.find()) {
            return countMatcher.group(1) + " openings";
        }

        if (lower.contains("multiple openings") || lower.contains("multiple positions") || lower.contains("multiple vacancies")) {
            return "Multiple openings";
        }

        if (lower.contains("urgent hiring") || lower.contains("hiring now")) {
            return "Hiring now";
        }

        return "Not specified";
    }

    @SuppressWarnings("unchecked")
    private String extractRichSnippetLocation(Map<String, Object> item) {
        return extractRichSnippetValue(item, "location");
    }

    @SuppressWarnings("unchecked")
    private String extractRichSnippetValue(Map<String, Object> item, String key) {
        Object richSnippet = item.get("rich_snippet");
        if (!(richSnippet instanceof Map<?, ?> richSnippetMap)) {
            return "";
        }

        Object top = richSnippetMap.get("top");
        if (!(top instanceof Map<?, ?> topMap)) {
            return "";
        }

        Object detectedExtensions = topMap.get("detected_extensions");
        if (!(detectedExtensions instanceof Map<?, ?> extensionsMap)) {
            return "";
        }

        return stringValue(extensionsMap.get(key));
    }

    private String extractCompanyFromSnippet(String snippet) {
        String normalized = stringValue(snippet);
        if (normalized.isBlank()) {
            return "";
        }

        String firstSentence = normalized.split("\\.", 2)[0].trim();
        if (looksLikeCompanyName(firstSentence)) {
            return firstSentence;
        }

        String[] segments = normalized.split("\\.");
        for (String segment : segments) {
            String candidate = segment.trim();
            if (looksLikeCompanyName(candidate)) {
                return candidate;
            }
        }

        return "";
    }

    private boolean looksLikeCompanyName(String value) {
        String candidate = stringValue(value);
        if (candidate.isBlank()) {
            return false;
        }

        String lower = candidate.toLowerCase(Locale.ROOT);
        if (looksLikePlatformName(candidate)) {
            return false;
        }
        if (lower.contains("apply") || lower.contains("jobs in") || lower.contains("job opening")) {
            return false;
        }
        if (lower.contains("developer") || lower.contains("engineer") || lower.contains("analyst")) {
            return false;
        }
        if (lower.contains("remote")) {
            candidate = candidate.replaceAll("(?i)\\bremote\\b", "").replaceAll("\\s+", " ").trim();
            lower = candidate.toLowerCase(Locale.ROOT);
        }
        if (candidate.isBlank()) {
            return false;
        }

        return candidate.equals(candidate.toUpperCase(Locale.ROOT))
                || lower.contains("consulting")
                || lower.contains("solutions")
                || lower.contains("technologies")
                || lower.contains("systems")
                || lower.contains("labs")
                || lower.contains("tech")
                || lower.contains("software")
                || lower.contains("analytics")
                || lower.contains("digital")
                || lower.contains("services")
                || candidate.split("\\s+").length <= 5;
    }

    private boolean looksLikePlatformName(String value) {
        String lower = stringValue(value).toLowerCase(Locale.ROOT);
        return lower.contains("linkedin")
                || lower.contains("indeed")
                || lower.contains("naukri")
                || lower.contains("foundit")
                || lower.contains("unstop")
                || lower.contains("acciojob");
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
