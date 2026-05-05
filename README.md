# ToDo Drag-and-Drop BDD Test Automation

## Project Overview
This project contains BDD test automation for the Drag-and-Drop Reordering enhancement of the ToDo application using Selenium WebDriver and JUnit.

## Test Coverage

### Functional Test Cases (25 Scenarios)

#### 1. Basic Drag and Drop Operations
- **TC001**: Drag and drop to reorder items downward in All view
- **TC002**: Drag and drop to move item upward in All view

#### 2. Filter-Safe Reordering
- **TC003**: Reorder items in Active view without affecting completed items
- **TC004**: Reorder items in Completed view without affecting active items
- **TC014**: Complex filter-safe reordering across multiple views

#### 3. Drag Handle Validation
- **TC004**: Drag only works from drag handle, not from other elements
- **TC005**: Drag handle is disabled during inline edit mode
- **TC006**: Drag capability restored after exiting edit mode

#### 4. Visual Feedback
- **TC013**: Visual feedback during drag operation (lifted styling, placeholder)

#### 5. Persistence
- **TC006**: Order persists after page reload
- **TC007**: Migration assigns order to existing todos without order field

#### 6. CRUD Operations
- **TC011**: New todo item is added at the end with correct order
- **TC012**: Deleting an item maintains proper order values

#### 7. Accessibility
- **TC008**: Drag handle has proper ARIA labels and attributes
- **TC009**: Keyboard-based reordering using Move Up button
- **TC010**: Keyboard-based reordering using Move Down button
- **TC015**: Keyboard sensor allows reordering via Space and Arrow keys

#### 8. Edge Cases
- **TC016**: Single item list shows drag handle but no position change possible
- **TC017**: Empty list does not show drag handles
- **TC018**: Dragging item to its own position does not trigger reorder

#### 9. Validation
- **TC015**: Reordering does not duplicate or lose items
- **TC020**: All items maintain unique keys during reordering
- **TC021**: Only visible items in current filter can be dragged

#### 10. State Management & Performance
- **TC022**: REORDER_TODOS action correctly updates application state
- **TC023**: Drag and drop remains responsive with multiple items

## Technology Stack
- **Java 11**
- **Selenium WebDriver 4.18.1**
- **Cucumber 7.15.0**
- **JUnit 5.10.1**
- **WebDriverManager 5.6.3**
- **Maven 3.x**

## Project Structure
```
todo-dnd-testing/
├── pom.xml
├── README.md
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/
│   │           └── todo/
│   │               ├── pages/
│   │               │   └── TodoPage.java
│   │               └── utils/
│   │                   ├── DriverManager.java
│   │                   └── TestContext.java
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── todo/
│       │           ├── runners/
│       │           │   └── TestRunner.java
│       │           └── stepdefinitions/
│       │               ├── Hooks.java
│       │               └── TodoStepDefinitions.java
│       └── resources/
│           ├── features/
│           │   └── DragDropTodoReorder.feature
│           └── cucumber.properties
└── target/
    └── cucumber-reports/
        └── cucumber-html-report.html
```

## Setup Instructions

### Prerequisites
1. Java JDK 11 or higher
2. Maven 3.6 or higher
3. Chrome browser (latest version)
4. ToDo application running on http://localhost:3000

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd todo-dnd-testing

# Install dependencies
mvn clean install

# Run tests
mvn test

# Generate HTML report
mvn verify
```

## Running Tests

### Run all tests
```bash
mvn clean test
```

### Run specific tags
```bash
mvn test -Dcucumber.filter.tags="@Smoke"
mvn test -Dcucumber.filter.tags="@FilterSafe"
mvn test -Dcucumber.filter.tags="@Accessibility"
```

### Run specific scenario
```bash
mvn test -Dcucumber.filter.tags="@TC001"
```

## Test Reports
After execution, HTML reports are generated at:
- `target/cucumber-reports/cucumber-html-report.html`
- `target/cucumber-reports/cucumber-report.html`

## Configuration
- Application URL: Configure in `TestContext.java` (default: http://localhost:3000)
- Browser: Configure in `DriverManager.java` (default: Chrome)
- Timeouts: Configure in `TodoPage.java` (default: 10 seconds)

## Test Data Management
Test data is managed through Cucumber data tables in feature files. Each scenario sets up its own test data for isolation.

## CI/CD Integration
This project is configured for Maven and can be integrated with:
- Jenkins
- GitHub Actions
- GitLab CI
- Azure DevOps

## Jira Integration
Test cases are created and linked to:
- **Project**: EPMCDMETST
- **Stories**: EPMCDMETST-40745, EPMMCDMETST-40749, EPMMCDMETST-40754
- **Test Cases**: Will be created in Jira with IDs

## Related Documentation
- Enhancement Requirement: [Confluence Link]
- Wireframes: [Confluence Link]
- Architecture: [Confluence Link]
- High Level Design: [Confluence Link]
- Low Level Design: [Confluence Link]

## Contributing
1. Create feature branch from main
2. Write tests following BDD best practices
3. Ensure all tests pass
4. Create pull request

## License
Internal EPAM project

## Contact
For questions or issues, contact the QA team.
