package com.mrusedev.voleytrack.architecture;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;

class BackendPackageArchitectureTest {

	private static final Path BACKEND_ROOT = Path.of("");
	private static final Path SRC_MAIN_JAVA = BACKEND_ROOT.resolve("src/main/java/com/mrusedev/voleytrack");

	@Test
	void partidosPackageContractsExist() {
		for (String relativePath : expectedPartidosPackageInfoFiles()) {
			Path packageInfo = SRC_MAIN_JAVA.resolve(relativePath);
			assertThat(packageInfo)
				.as("Expected package contract file at %s", relativePath)
				.isRegularFile();
		}
	}

	@Test
	void partidosPackageContractsAreMeaningful() throws IOException {
		for (String relativePath : expectedPartidosPackageInfoFiles()) {
			Path packageInfo = SRC_MAIN_JAVA.resolve(relativePath);
			String content = Files.readString(packageInfo);

			assertThat(content)
				.as("Expected package-level Javadoc contract in %s", relativePath)
				.contains("/**")
				.contains("package com.mrusedev.voleytrack.partidos");
			assertThat(content.lines().filter(line -> line.strip().startsWith("*")).count())
				.as("Expected non-empty package-level contract in %s", relativePath)
				.isGreaterThanOrEqualTo(3);
		}
	}

	@Test
	void partidosContainsOnlyPackageContractsForThisSlice() throws IOException {
		Path partidosPackage = SRC_MAIN_JAVA.resolve("partidos");
		assertThat(partidosPackage).isDirectory();

		try (var files = Files.walk(partidosPackage)) {
			List<Path> unexpectedJavaFiles = files
				.filter(Files::isRegularFile)
				.filter(path -> path.toString().endsWith(".java"))
				.filter(path -> !path.getFileName().toString().equals("package-info.java"))
				.toList();

			assertThat(unexpectedJavaFiles)
				.as("No controllers, use cases, entities, repositories, or other source types belong in this slice")
				.isEmpty();
		}
	}

	@Test
	void futureContextSourcePackagesDoNotExist() {
		List<String> forbiddenPackages = List.of("usuarios", "plantel", "livestats", "live-stats");

		for (String packageName : forbiddenPackages) {
			Path packageDir = SRC_MAIN_JAVA.resolve(packageName);
			assertThat(packageDir)
				.as("Future context package must not exist: %s", packageName)
				.doesNotExist();
		}
	}

	@Test
	void frameworkFirstRootPackagesDoNotExist() {
		List<String> forbiddenPackages = List.of("controllers", "services", "repositories");

		for (String packageName : forbiddenPackages) {
			Path packageDir = SRC_MAIN_JAVA.resolve(packageName);
			assertThat(packageDir)
				.as("Framework-first package must not exist at root: %s", packageName)
				.doesNotExist();
		}
	}

	@Test
	void architectureDocumentationExists() {
		Path architectureDoc = BACKEND_ROOT.resolve("ARCHITECTURE.md");
		assertThat(architectureDoc)
			.as("Backend architecture documentation must exist")
			.isRegularFile();
	}

	@Test
	void architectureDocumentationNamesAllBoundedContexts() throws IOException {
		Path architectureDoc = BACKEND_ROOT.resolve("ARCHITECTURE.md");
		assertThat(architectureDoc).isRegularFile();

		String content = Files.readString(architectureDoc);
		assertThat(content).contains("partidos");
		assertThat(content).contains("usuarios");
		assertThat(content).contains("plantel");
		assertThat(content).contains("live-stats");
	}

	@Test
	void rootApplicationClassRemainsUnchanged() {
		Path applicationClass = SRC_MAIN_JAVA.resolve("VoleytrackApplication.java");
		assertThat(applicationClass)
			.as("Spring Boot application entry point must remain at the root package")
			.isRegularFile();
	}

	private static List<String> expectedPartidosPackageInfoFiles() {
		return List.of(
			"partidos/package-info.java",
			"partidos/domain/package-info.java",
			"partidos/application/package-info.java",
			"partidos/application/port/package-info.java",
			"partidos/application/port/in/package-info.java",
			"partidos/application/port/out/package-info.java",
			"partidos/adapter/package-info.java",
			"partidos/adapter/in/package-info.java",
			"partidos/adapter/out/package-info.java"
		);
	}

}
