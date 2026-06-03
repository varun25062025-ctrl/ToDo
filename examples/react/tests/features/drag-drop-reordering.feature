Feature: Drag and Drop Task Reordering
  As a TodoMVC user
  I want to reorder tasks using drag and drop
  So that I can prioritize my tasks visually

  Background:
    Given the TodoMVC application is loaded

  Scenario: Drag active task upward in list
    Given I have active tasks "Buy milk", "Write report", "Review code"
    When I drag task "Review code" above "Buy milk"
    Then the task order should be "Review code", "Buy milk", "Write report"

  Scenario: Drag task downward in list
    Given I have active tasks "Task A", "Task B", "Task C"
    When I drag task "Task A" below "Task C"
    Then the task order should be "Task B", "Task C", "Task A"

  Scenario: Reordered list persists after page reload
    Given I have active tasks "First", "Second", "Third"
    When I drag task "Third" above "First"
    And I reload the page
    Then the task order should be "Third", "First", "Second"

  Scenario: Drag within completed tasks filter
    Given I have completed tasks "Done A", "Done B", "Done C"
    When I switch to "Completed" filter
    And I drag task "Done C" above "Done A"
    Then the completed task order should be "Done C", "Done A", "Done B"

  Scenario: Order consistency across filters
    Given I have tasks "Active 1" as active and "Done 1" as completed
    When I reorder tasks in "All" filter
    And I switch to "Active" filter
    Then the active tasks maintain their relative order

  Scenario: Same position drag is no-op
    Given I have active tasks "Task 1", "Task 2", "Task 3"
    When I drag task "Task 2" to its current position
    Then the task order should remain "Task 1", "Task 2", "Task 3"

  Scenario: Drag handle visibility
    Given I have an active task "Test Task"
    Then I should see a drag handle on the task
    And the drag handle should have tooltip "Drag to reorder"

  Scenario: Drag disabled during edit mode
    Given I have an active task "Editable Task"
    When I double-click the task to edit it
    Then the task should not be draggable
