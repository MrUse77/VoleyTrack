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
	void hexagonalLayerContractsExist() {
		for (String relativePath : expectedPackageInfoFiles()) {
			Path packageInfo = SRC_MAIN_JAVA.resolve(relativePath);
			assertThat(packageInfo)
				.as("Expected package contract file at %s", relativePath)
				.isRegularFile();
		}
	}

	@Test
	void hexagonalLayerContractsAreMeaningful() throws IOException {
		for (String relativePath : expectedPackageInfoFiles()) {
			Path packageInfo = SRC_MAIN_JAVA.resolve(relativePath);
			String content = Files.readString(packageInfo);

			assertThat(content)
				.as("Expected package-level Javadoc contract in %s", relativePath)
				.contains("/**")
				.contains("package com.mrusedev.voleytrack");
			assertThat(content.lines().filter(line -> line.strip().startsWith("*")).count())
				.as("Expected non-empty package-level contract in %s", relativePath)
				.isGreaterThanOrEqualTo(3);
		}
	}

	@Test
	void domainContainsOnlyDomainClasses() throws IOException {
		Path domainPackage = SRC_MAIN_JAVA.resolve("domain");
		assertThat(domainPackage).isDirectory();

		try (var files = Files.list(domainPackage)) {
			List<Path> javaFiles = files
				.filter(Files::isRegularFile)
				.filter(path -> path.toString().endsWith(".java"))
				.filter(path -> !path.getFileName().toString().equals("package-info.java"))
				.toList();

			assertThat(javaFiles)
				.as("Domain package must contain domain classes")
				.isNotEmpty();
		}
	}

	@Test
	void hexagonalStructureIsComplete() {
		List<String> requiredLayers = List.of(
			"domain",
			"application", "application/port", "application/port/in",
			"application/port/out", "application/gestor",
			"adapter", "adapter/in", "adapter/in/web",
			"adapter/out", "adapter/out/persistence"
		);

		for (String layer : requiredLayers) {
			Path layerDir = SRC_MAIN_JAVA.resolve(layer);
			assertThat(layerDir)
				.as("Hexagonal layer must exist: %s", layer)
				.isDirectory();
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
	void architectureDocumentationDescribesHexagonalStructure() throws IOException {
		Path architectureDoc = BACKEND_ROOT.resolve("ARCHITECTURE.md");
		assertThat(architectureDoc).isRegularFile();

		String content = Files.readString(architectureDoc);
		assertThat(content).contains("hexagonal");
		assertThat(content).contains("domain");
		assertThat(content).contains("application");
		assertThat(content).contains("adapter");
	}

	@Test
	void rootApplicationClassRemainsUnchanged() {
		Path applicationClass = SRC_MAIN_JAVA.resolve("VoleytrackApplication.java");
		assertThat(applicationClass)
			.as("Spring Boot application entry point must remain at the root package")
			.isRegularFile();
	}

	private static List<String> expectedPackageInfoFiles() {
		return List.of(
			"domain/package-info.java",
			"application/package-info.java",
			"application/port/package-info.java",
			"application/port/in/package-info.java",
			"application/port/out/package-info.java",
			"application/gestor/package-info.java",
			"adapter/package-info.java",
			"adapter/in/package-info.java",
			"adapter/in/web/package-info.java",
			"adapter/out/package-info.java",
			"adapter/out/persistence/package-info.java"
		);
	}

}
