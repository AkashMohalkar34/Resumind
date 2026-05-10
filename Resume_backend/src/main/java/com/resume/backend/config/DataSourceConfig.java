package com.resume.backend.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;
import java.util.Locale;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(Environment environment) {
        String rawUrl = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_URL"),
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("MYSQL_URL"),
                environment.getProperty("spring.datasource.url")
        );
        String jdbcUrl = normalizeJdbcUrl(rawUrl);

        String username = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_USERNAME"),
                environment.getProperty("DATABASE_USER"),
                environment.getProperty("MYSQL_USERNAME"),
                extractUsername(rawUrl)
        );
        String password = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_PASSWORD"),
                environment.getProperty("DATABASE_PASSWORD"),
                environment.getProperty("MYSQL_PASSWORD"),
                extractPassword(rawUrl)
        );

        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .driverClassName(detectDriverClass(jdbcUrl))
                .url(jdbcUrl)
                .username(username)
                .password(password)
                .build();
    }

    private String normalizeJdbcUrl(String value) {
        String url = firstNonBlank(value, "jdbc:postgresql://localhost:5432/resume_app");
        if (url.startsWith("jdbc:")) {
            return url;
        }
        URI uri = toUri(url);
        if (url.startsWith("postgres://")) {
            return buildPostgresJdbcUrl(uri);
        }
        if (url.startsWith("postgresql://")) {
            return buildPostgresJdbcUrl(uri);
        }
        return url;
    }

    private String detectDriverClass(String jdbcUrl) {
        String normalized = jdbcUrl.toLowerCase(Locale.ROOT);
        if (normalized.startsWith("jdbc:mysql:")) {
            return "com.mysql.cj.jdbc.Driver";
        }
        return "org.postgresql.Driver";
    }

    private String extractUsername(String value) {
        URI uri = toUri(value);
        if (uri == null || uri.getUserInfo() == null || !uri.getUserInfo().contains(":")) {
            return null;
        }
        return uri.getUserInfo().split(":", 2)[0];
    }

    private String extractPassword(String value) {
        URI uri = toUri(value);
        if (uri == null || uri.getUserInfo() == null || !uri.getUserInfo().contains(":")) {
            return null;
        }
        return uri.getUserInfo().split(":", 2)[1];
    }

    private URI toUri(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = value.startsWith("jdbc:") ? value.substring(5) : value;
        try {
            return URI.create(normalized);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private String buildPostgresJdbcUrl(URI uri) {
        if (uri == null || uri.getHost() == null || uri.getPath() == null || uri.getPath().isBlank()) {
            return "jdbc:postgresql://localhost:5432/resume_app";
        }

        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                .append(uri.getHost());

        if (uri.getPort() > 0) {
            jdbcUrl.append(":").append(uri.getPort());
        }

        jdbcUrl.append(uri.getPath());

        if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
            jdbcUrl.append("?").append(uri.getQuery());
        }

        return jdbcUrl.toString();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }
}
