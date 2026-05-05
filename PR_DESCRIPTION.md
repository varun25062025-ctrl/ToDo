# Pull Request: Add BDD Test Automation Framework for Drag-and-Drop ToDo Reordering

**Branch**: `feature/drag-drop-bdd-testing` → `master`  
**Project**: EPMCDMETST  
**Stories**: EPMCDMETST-40745, EPMMCDMETST-40749, EPMMCDMETST-40754

---

## Summary
This PR adds a comprehensive BDD test automation framework for the drag-and-drop ToDo reordering feature using Selenium WebDriver, Cucumber BDD, and JUnit 5.

### 📦 What's Included
- **15 BDD Gherkin Test Scenarios** covering:
  - Basic drag-and-drop operations (TC001-TC002) - Critical
  - Filter-safe reordering for Active/Completed views (TC003, TC014)
  - Visual feedback and drag handle validation (TC004-TC005, TC013)
  - Persistence and data migration (TC006-TC007)
  - Accessibility features: ARIA labels & keyboard support (TC008-TC009)
  - CRUD operations maintaining order (TC011-TC012)
  - Edge cases and data integrity (TC010, TC015)

- **Page Object Model Architecture**
  - TodoPage.java: Comprehensive page object with drag-drop methods
  - DragDropSteps.java: Step definitions for all Gherkin steps
  - TestRunner.java: JUnit 5 test runner with Cucumber integration

- **Maven Project Configuration**
  - Selenium WebDriver 4.18.1
  - Cucumber 7.15.0
  - JUnit 5.10.1
  - Automated HTML report generation

### 📊 Test Coverage
- **Critical Priority**: 2 scenarios (Smoke tests)
- **High Priority**: 10 scenarios (Core functionality)
- **Medium Priority**: 2 scenarios (Edge cases)
- **Low Priority**: 1 scenario (Regression)

### 🔗 Requirements Traceability
- **EPMCDMETST-40745**: Drag-Drop UI Implementation (6 test cases)
- **EPMMCDMETST-40749**: Accessibility & Keyboard Support (2 test cases)
- **EPMMCDMETST-40754**: Persistence & Data Migration (4 test cases)

### 📄 Documentation
- `README.md`: Complete setup and usage guide
- `TEST_EXECUTION_SUMMARY.md`: Detailed test execution documentation with traceability matrix
- `TEST_REPORT.html`: Interactive HTML test report dashboard
- `JIRA_TEST_CASES_SUMMARY.txt`: Test case descriptions for Jira upload
- `DELIVERABLES_SUMMARY.md`: Comprehensive deliverables documentation
- `COMPLETE_DOCUMENTATION.md`: Consolidated project documentation

### ⚙️ How to Run Tests
```bash
# Install dependencies
mvn clean install

# Run all tests
mvn clean test

# Run specific tags
mvn clean test -Dcucumber.filter.tags="@Smoke"
mvn clean test -Dcucumber.filter.tags="@Critical"

# Generate HTML report
mvn verify
```

### 📋 Prerequisites
- Java 11+
- Maven 3.x
- ToDo application running at http://localhost:3000
- Drag-and-drop feature implemented

### ✅ Test Plan
1. **Smoke Tests** (@Smoke, @Critical): TC001, TC002
2. **Functional Tests**: TC003-TC007, TC011-TC015
3. **Accessibility Tests** (@Accessibility): TC008, TC009
4. **Regression Tests** (@Regression): TC015

### 📈 Reports
- View `TEST_REPORT.html` in browser for interactive dashboard
- Cucumber HTML report: `target/cucumber-reports/cucumber-report.html` (after execution)

### 🎯 Next Steps
1. Deploy ToDo application with drag-and-drop feature
2. Execute test suite: `mvn clean test`
3. Review test results and HTML report
4. Upload test cases to Jira (EPMCDMETST project)
5. Address any test failures

### 📚 Related Documentation
- Enhancement Requirement: [Confluence](https://epam-team-ygykgdb3j.atlassian.net/wiki/spaces/~5b48f7dd7975a22beeaeb712/pages/9732117/)
- Wireframes, Architecture, HLD, LLD documents linked in COMPLETE_DOCUMENTATION.md

### 📂 Files Changed
- **Feature File**: `src/test/resources/features/DragDropTodoReorder.feature` (158 lines)
- **Page Object**: `src/main/java/com/todo/pages/TodoPage.java`
- **Step Definitions**: `src/test/java/com/todo/steps/DragDropSteps.java`
- **Test Runner**: `src/test/java/com/todo/runners/TestRunner.java`
- **Configuration**: `pom.xml`, `cucumber.properties`
- **Documentation**: Multiple .md files and HTML reports

### 🔍 Review Checklist
- [ ] Test framework follows Page Object Model pattern
- [ ] All 15 test scenarios are properly structured
- [ ] Maven dependencies are correctly configured
- [ ] Documentation is comprehensive and clear
- [ ] Test cases map to user stories and requirements
- [ ] ARIA labels and accessibility features are tested
- [ ] Persistence and data migration scenarios covered

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
