# BDD Test Automation Deliverables - ToDo Drag-and-Drop Reordering

## Project Overview
**Feature**: Drag-and-Drop Reordering of ToDo Items  
**Project**: EPMCDMETST  
**Related Stories**: EPMCDMETST-40745, EPMMCDMETST-40749, EPMMCDMETST-40754  
**Date**: 2026-05-05  
**Repository**: C:/Users/varun_gupta/Desktop/todo-dnd-testing  
**Branch**: feature/drag-drop-bdd-testing  

## Deliverables Completed

### 1. BDD Feature File
**File**: `src/test/resources/features/DragDropTodoReorder.feature`  
**Content**: 15 comprehensive BDD test scenarios in Gherkin format covering:
- Basic drag and drop operations
- Filter-safe reordering (Active/Completed views)
- Drag handle validation
- Edit mode interactions
- Persistence and migration
- CRUD operations
- Accessibility features
- Visual feedback
- Edge cases and data integrity

### 2. Page Object Model
**File**: `src/main/java/com/todo/pages/TodoPage.java`  
**Features**:
- Complete page object implementation
- Drag and drop operations using Selenium Actions API
- LocalStorage management
- Filter navigation
- CRUD operations
- Accessibility helpers
- Screenshot capture capabilities

### 3. Test Infrastructure
**Files**:
- `src/main/java/com/todo/utils/DriverManager.java` - WebDriver lifecycle management
- `src/main/java/com/todo/utils/TestContext.java` - Test context and dependency injection
- `src/test/java/com/todo/stepdefinitions/Hooks.java` - Cucumber hooks for setup/teardown
- `src/test/java/com/todo/stepdefinitions/TodoStepDefinitions.java` - Step definitions
- `src/test/java/com/todo/runners/TestRunner.java` - JUnit test runner

### 4. Build Configuration
**File**: `pom.xml`  
**Dependencies**:
- Selenium WebDriver 4.18.1
- Cucumber 7.15.0
- JUnit 5.10.1
- WebDriverManager 5.6.3
- Cucumber Reporting 5.7.7

### 5. Documentation
**Files**:
- `README.md` - Complete project documentation
- `JIRA_TEST_CASES_SUMMARY.txt` - Test case descriptions for Jira upload
- `.gitignore` - Git ignore configuration

### 6. Git Repository
**Status**: Initialized and committed
**Commits**:
1. Initial commit with framework (4df5e13)
2. Test case summaries (5428021)
**Branch**: feature/drag-drop-bdd-testing

## Test Case Summary

| ID | Title | Priority | Tags |
|----|-------|----------|------|
| TC001 | Drag and drop downward in All view | High | Smoke, DragDrop |
| TC002 | Drag and drop upward in All view | High | Smoke, DragDrop |
| TC003 | Filter-safe reordering - Active view | High | FilterSafe, Active |
| TC004 | Drag handle validation | High | DragHandle, Validation |
| TC005 | Drag disabled during edit mode | High | EditMode, DragDisabled |
| TC006 | Order persistence after reload | Critical | Persistence, LocalStorage |
| TC007 | Data migration for legacy todos | High | Persistence, Migration |
| TC008 | ARIA labels and attributes | High | Accessibility, ARIA |
| TC009 | Keyboard reordering - Move Up | Medium | Accessibility, Keyboard |
| TC010 | Drag to same position edge case | Low | EdgeCase |
| TC011 | Add item maintains order | High | CRUD, AddItem |
| TC012 | Delete item maintains order | High | CRUD, DeleteItem |
| TC013 | Visual feedback during drag | Medium | VisualFeedback |
| TC014 | Filter-safe reordering - Completed view | High | FilterSafe, Completed |
| TC015 | No item duplication/loss | Critical | Validation, NoItemDuplication |

## Coverage Matrix

### Requirements Traceability

| Requirement | Test Cases | Story |
|-------------|------------|-------|
| FR-1: Draggable items with visual feedback | TC001, TC002, TC004, TC013 | EPMCDMETST-40745 |
| FR-2: Ordering model via order attribute | TC006, TC007, TC011, TC012 | EPMCDMETST-40745 |
| FR-3: REORDER_TODOS reducer action | TC001-TC003, TC014 | EPMMCDMETST-40749 |
| FR-4: Filter-safe reordering | TC003, TC014 | EPMMCDMETST-40749 |
| FR-5: Persist order to localStorage | TC006, TC007 | EPMMCDMETST-40754 |
| FR-6: Accessibility features | TC008, TC009 | EPMMCDMETST-40754 |
| AC: No item loss/duplicate keys | TC015 | EPMMCDMETST-40754 |
| AC: Edit mode disables drag | TC005 | EPMMCDMETST-40749 |

### Functional Area Coverage
- Drag and Drop Operations: 13% (2/15)
- Filter-Safe Reordering: 13% (2/15)
- Persistence: 13% (2/15)
- Accessibility: 13% (2/15)
- CRUD Operations: 13% (2/15)
- Validation: 20% (3/15)
- Edge Cases: 7% (1/15)
- Other: 7% (1/15)

## Execution Instructions

### Prerequisites
1. Java JDK 11+
2. Maven 3.6+
3. Chrome browser (latest)
4. ToDo application at http://localhost:3000

### Run Tests
```bash
# Navigate to project
cd /c/Users/varun_gupta/Desktop/todo-dnd-testing

# Run all tests
mvn clean test

# Run by tag
mvn test -Dcucumber.filter.tags="@Smoke"
mvn test -Dcucumber.filter.tags="@FilterSafe"
mvn test -Dcucumber.filter.tags="@Accessibility"

# Run specific test
mvn test -Dcucumber.filter.tags="@TC001"

# Generate HTML report
mvn verify
```

### View Reports
- HTML Report: `target/cucumber-reports/cucumber-report.html`
- JSON Report: `target/cucumber-reports/cucumber.json`

## Next Steps

### 1. Upload to Remote Repository
```bash
# Create GitHub repository (manual or via gh CLI)
git remote add origin <repository-url>
git push -u origin feature/drag-drop-bdd-testing
```

### 2. Create Pull Request
- Base branch: main
- Compare branch: feature/drag-drop-bdd-testing
- Title: "Add BDD test automation for drag-and-drop reordering"
- Description: Include test coverage summary and traceability matrix

### 3. Create Jira Test Cases
Use the descriptions in `JIRA_TEST_CASES_SUMMARY.txt` to create test cases in project EPMCDMETST:
- Issue Type: Test
- Priority: As specified in summary
- Labels: Add corresponding tags
- Link to stories: EPMCDMETST-40745, EPMMCDMETST-40749, EPMMCDMETST-40754

### 4. Execute Tests
Once the ToDo application with drag-and-drop feature is deployed:
1. Verify application is running at http://localhost:3000
2. Execute test suite
3. Generate and review HTML reports
4. Update Jira test execution results
5. Attach reports to Jira stories

## Technology Stack
- **Language**: Java 11
- **Test Framework**: JUnit 5.10.1
- **BDD Framework**: Cucumber 7.15.0
- **WebDriver**: Selenium 4.18.1
- **Driver Management**: WebDriverManager 5.6.3
- **Build Tool**: Maven 3.x
- **Reporting**: Cucumber HTML Reports 5.7.7

## Project Statistics
- **Total Files**: 10 Java/feature files
- **Lines of Code**: ~750+
- **Test Scenarios**: 15
- **Test Steps**: ~150+
- **Commits**: 2
- **Branch**: feature/drag-drop-bdd-testing

## Quality Metrics
- **Code Coverage**: Framework covers all specified requirements
- **Test Coverage**: 100% of functional requirements
- **Automation Rate**: 100% (all test cases automatable)
- **Maintainability**: High (Page Object Model pattern)
- **Reusability**: High (modular step definitions)

## Contact & Support
For questions or issues with the test automation framework:
- Review README.md for setup instructions
- Check JIRA_TEST_CASES_SUMMARY.txt for test case details
- Refer to feature file for Gherkin scenarios

---
**Status**: ✅ Complete - Ready for repository upload and PR creation  
**Last Updated**: 2026-05-05  
**Author**: QA Automation Team  
**Co-Author**: Claude Opus 4.7
