Feature: Drag-and-Drop Reordering of ToDo Items

  As a user of the ToDo application
  I want to reorder todo items by dragging and dropping
  So that I can organize my tasks according to my preferences

  Background:
    Given the ToDo application is loaded at "http://localhost:3000"
    And the application has initialized with localStorage

  @TC001 @Smoke @DragDrop
  Scenario: TC001 Drag and drop to reorder items downward in All view
    Given I am on the "All" view
    And I have the following todo items:
      | title          | completed |
      | Buy groceries  | false     |
      | Read book      | false     |
      | Write report   | false     |
    When I drag "Buy groceries" by the drag handle
    And I drop it after "Write report"
    Then the todo items should be displayed in the following order:
      | title          |
      | Read book      |
      | Write report   |
      | Buy groceries  |
    And the order should be persisted in localStorage

  @TC002 @Smoke @DragDrop
  Scenario: TC002 Drag and drop to move item upward in All view
    Given I am on the "All" view
    And I have the following todo items:
      | title  | completed |
      | Task A | false     |
      | Task B | false     |
      | Task C | false     |
    When I drag "Task C" by the drag handle
    And I drop it before "Task A"
    Then the todo items should be displayed in the following order:
      | title  |
      | Task C |
      | Task A |
      | Task B |

  @TC003 @FilterSafe @Active
  Scenario: TC003 Reorder items in Active view without affecting completed items
    Given I am on the "Active" view
    And I have the following todo items:
      | title          | completed |
      | Active Task 1  | false     |
      | Completed Task | true      |
      | Active Task 2  | false     |
      | Active Task 3  | false     |
    When I drag "Active Task 3" by the drag handle
    And I drop it before "Active Task 1"
    Then in current view the visible items should be in order:
      | title         |
      | Active Task 3 |
      | Active Task 1 |
      | Active Task 2 |

  @TC004 @DragHandle @Validation
  Scenario: TC004 Drag only works from drag handle not from other elements
    Given I am on the "All" view
    And I have a todo item "Test Task"
    When I attempt to drag by clicking the checkbox
    Then drag should not start
    When I drag by the drag handle
    Then drag should start successfully

  @TC005 @EditMode @DragDisabled
  Scenario: TC005 Drag handle is disabled during inline edit mode
    Given I am on the "All" view
    And I have a todo item "Task to edit" in the list
    When I double-click on "Task to edit" title
    Then the item should enter inline edit mode
    And the drag handle should be disabled
    And the drag handle should have "aria-disabled" set to "true"

  @TC006 @Persistence @LocalStorage
  Scenario: TC006 Order persists after page reload
    Given I am on the "All" view
    And I have the following todo items:
      | title  | completed |
      | Task A | false     |
      | Task B | false     |
      | Task C | false     |
    When I drag "Task C" and drop it before "Task A"
    And I reload the page
    Then the todo items should still be in order "Task C,Task A,Task B"

  @TC007 @Persistence @Migration
  Scenario: TC007 Migration assigns order to existing todos without order field
    Given localStorage contains todos without "order" field
    When I load the ToDo application
    Then each todo should have an "order" field assigned
    And the migrated data should be persisted

  @TC008 @Accessibility @ARIA
  Scenario: TC008 Drag handle has proper ARIA labels and attributes
    Given I am on the "All" view
    And I have a todo item "Important Task"
    When I inspect the drag handle for "Important Task"
    Then the drag handle should have role "button"
    And the drag handle should have tabIndex "0"
    And the drag handle should have aria-label containing "Important Task"

  @TC009 @Accessibility @Keyboard
  Scenario: TC009 Keyboard-based reordering using Move Up button
    Given I am on the "All" view
    And keyboard reorder controls are enabled
    And I have 3 todo items
    When I focus on the third item
    And I click the "Move Up" button
    Then the third item should move to second position

  @TC010 @EdgeCase @DragToSamePosition
  Scenario: TC010 Dragging item to its own position does not trigger reorder
    Given I am on the "All" view
    And I have 3 todo items
    When I drag the second item to its current position
    Then the order should remain unchanged

  @TC011 @CRUD @AddItem
  Scenario: TC011 New todo item is added at the end with correct order
    Given I am on the "All" view
    And I have 2 todo items
    When I add a new todo item "New Task"
    Then "New Task" should be added at the end

  @TC012 @CRUD @DeleteItem
  Scenario: TC012 Deleting an item maintains proper order
    Given I am on the "All" view
    And I have 3 todo items
    When I delete the second item
    Then remaining items should maintain proper order

  @TC013 @VisualFeedback
  Scenario: TC013 Visual feedback during drag operation
    Given I am on the "All" view
    And I have 3 todo items
    When I start dragging the first item
    Then the item should have lifted styling
    And a placeholder should appear

  @TC014 @FilterSafe @Completed
  Scenario: TC014 Reorder in Completed view without affecting active items
    Given I am on the "Completed" view
    And I have mixed active and completed items
    When I reorder completed items
    Then active items should maintain their position

  @TC015 @Validation @NoItemDuplication
  Scenario: TC015 Reordering does not duplicate or lose items
    Given I am on the "All" view
    And I have 3 todo items
    When I perform multiple drag and drop operations
    Then all 3 items should still be present
    And no items should be duplicated
