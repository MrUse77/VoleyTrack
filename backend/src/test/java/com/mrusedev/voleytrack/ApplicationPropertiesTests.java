package com.mrusedev.voleytrack;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;
import org.junit.jupiter.api.Test;

class ApplicationPropertiesTests {

	@Test
	void productionDatasourceUsesEnvironmentOverridesWithLocalDefaults() throws IOException {
		Properties properties = loadProperties("src/main/resources/application.properties");

		assertThat(properties.getProperty("spring.datasource.url"))
				.isEqualTo("${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/voleytrack?stringtype=unspecified}");
		assertThat(properties.getProperty("spring.datasource.username"))
				.isEqualTo("${SPRING_DATASOURCE_USERNAME:voleytrack}");
		assertThat(properties.getProperty("spring.datasource.password"))
				.isEqualTo("${SPRING_DATASOURCE_PASSWORD:voleytrack}");
		assertThat(properties.getProperty("spring.datasource.driver-class-name"))
				.isEqualTo("org.postgresql.Driver");
	}

	@Test
	void testProfileUsesInMemoryDatasourceWithoutFlyway() throws IOException {
		Properties properties = loadProperties("src/test/resources/application-test.properties");

		assertThat(properties.getProperty("spring.datasource.url"))
				.contains("jdbc:h2:mem:voleytrack")
				.contains("MODE=PostgreSQL");
		assertThat(properties.getProperty("spring.datasource.driver-class-name"))
				.isEqualTo("org.h2.Driver");
		assertThat(properties.getProperty("spring.flyway.enabled")).isEqualTo("false");
	}

	private static Properties loadProperties(String path) throws IOException {
		Properties properties = new Properties();
		try (var input = Files.newInputStream(Path.of(path))) {
			properties.load(input);
		}
		return properties;
	}
}
