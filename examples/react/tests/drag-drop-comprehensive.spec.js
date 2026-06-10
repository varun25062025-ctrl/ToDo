const { test, expect } = require('@playwright/test');

test.describe('TodoMVC Drag-and-Drop - Comprehensive Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // ========== CORE FUNCTIONALITY TESTS ==========

  test('TC-001: Drag task upward in active list with persistence', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task A');
    await input.press('Enter');
    await input.fill('Task B');
    await input.press('Enter');
    await input.fill('Task C');
    await input.press('Enter');

    // Verify initial order
    const tasks = page.locator('.todo-list li label');
    await expect(tasks.nth(0)).toHaveText('Task A');
    await expect(tasks.nth(2)).toHaveText('Task C');

    // Drag Task C to first position
    const taskC = page.locator('.todo-list li').nth(2);
    const taskA = page.locator('.todo-list li').nth(0);
    await taskC.dragTo(taskA);
    await page.waitForTimeout(500);

    // Verify order changed
    const tasksAfterDrag = page.locator('.todo-list li label');
    const firstTaskText = await tasksAfterDrag.nth(0).textContent();
    expect(firstTaskText).toBe('Task C');

    // Reload and verify persistence
    await page.reload();
    await page.waitForSelector('.todo-list li');
    const tasksReloaded = page.locator('.todo-list li label');
    await expect(tasksReloaded.nth(0)).toHaveText('Task C');
  });

  test('TC-002: Drag task downward in completed list', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Completed A');
    await input.press('Enter');
    await input.fill('Completed B');
    await input.press('Enter');
    await input.fill('Completed C');
    await input.press('Enter');

    // Complete all tasks
    await page.locator('.todo-list li .toggle').nth(0).check();
    await page.locator('.todo-list li .toggle').nth(1).check();
    await page.locator('.todo-list li .toggle').nth(2).check();

    // Switch to Completed filter
    await page.locator('a[href="#/completed"]').click();
    await page.waitForTimeout(300);

    // Drag first to last
    const tasks = page.locator('.todo-list li');
    const firstTask = tasks.nth(0);
    const lastTask = tasks.nth(2);
    await firstTask.dragTo(lastTask);
    await page.waitForTimeout(500);

    // Verify at least  tasks visible
    const count = await tasks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-003: Visual feedback during drag operations', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Visual Test Task');
    await input.press('Enter');
    await input.fill('Drop Target Task');
    await input.press('Enter');

    // Check drag handle exists and visible
    const dragHandle = page.locator('.drag-handle').first();
    await expect(dragHandle).toBeVisible();

    // Verify drag handle has correct text
    await expect(dragHandle).toHaveText('⋮⋮');

    // Check cursor style
    const cursor = await dragHandle.evaluate(el =>
      window.getComputedStyle(el).cursor
    );
    expect(cursor).toContain('grab');
  });

  test('TC-004: Reorder in All filter view', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Active Task');
    await input.press('Enter');
    await input.fill('Completed Task');
    await input.press('Enter');

    // Mark second as completed
    await page.locator('.todo-list li .toggle').nth(1).check();

    // Ensure All filter
    await page.locator('a[href="#/"]').click();
    await page.waitForTimeout(300);

    // Verify both visible
    const tasks = page.locator('.todo-list li');
    const count = await tasks.count();
    expect(count).toBe(2);

    // Reorder
    const task1 = tasks.nth(0);
    const task2 = tasks.nth(1);
    await task1.dragTo(task2);
    await page.waitForTimeout(500);

    // Verify still 2 tasks
    const countAfter = await tasks.count();
    expect(countAfter).toBe(2);
  });

  test('TC-005: Drag disabled during edit mode', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Edit Mode Test');
    await input.press('Enter');

    // Double-click to edit
    const taskLabel = page.locator('.todo-list li label').first();
    await taskLabel.dblclick();

    // Verify editing class present
    const editingTask = page.locator('.todo-list li.editing');
    await expect(editingTask).toBeVisible();

    // Verify draggable is false
    const isDraggable = await editingTask.getAttribute('draggable');
    expect(isDraggable).toBe('false');
  });

  // ========== EDGE CASE TESTS ==========

  test('TC-006: Single task list - no errors on drag', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Single Task');
    await input.press('Enter');

    const tasks = page.locator('.todo-list li');
    const count = await tasks.count();
    expect(count).toBe(1);

    // Try to drag (should be no-op)
    const task = tasks.first();
    await task.dragTo(task);
    await page.waitForTimeout(300);

    const countAfter = await tasks.count();
    expect(countAfter).toBe(1);
  });

  test('TC-007: Empty list - no drag handles shown', async ({ page }) => {
    const tasks = page.locator('.todo-list li');
    const count = await tasks.count();
    expect(count).toBe(0);

    // Add a task
    const input = page.locator('.new-todo');
    await input.fill('First Task');
    await input.press('Enter');

    // Verify drag handle appears
    const dragHandle = page.locator('.drag-handle').first();
    await expect(dragHandle).toBeVisible();
  });

  test('TC-008: Same position drag is no-op', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    const tasks = page.locator('.todo-list li label');
    const firstText = await tasks.nth(0).textContent();

    // Drag task to itself
    const task1 = page.locator('.todo-list li').nth(0);
    await task1.dragTo(task1);
    await page.waitForTimeout(300);

    const firstTextAfter = await tasks.nth(0).textContent();
    expect(firstTextAfter).toBe(firstText);
  });

  test('TC-009: Filter switching maintains order', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Active 1');
    await input.press('Enter');
    await input.fill('Active 2');
    await input.press('Enter');

    // Reorder
    const task2 = page.locator('.todo-list li').nth(1);
    const task1 = page.locator('.todo-list li').nth(0);
    await task2.dragTo(task1);
    await page.waitForTimeout(500);

    const tasksAll = page.locator('.todo-list li label');
    const firstInAll = await tasksAll.nth(0).textContent();

    // Switch to Active filter
    await page.locator('a[href="#/active"]').click();
    await page.waitForTimeout(300);

    const tasksActive = page.locator('.todo-list li label');
    const firstInActive = await tasksActive.nth(0).textContent();
    expect(firstInActive).toBe(firstInAll);
  });

  test('TC-010: Accessibility attributes present', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Accessibility Test');
    await input.press('Enter');

    const dragHandle = page.locator('.drag-handle').first();
    await expect(dragHandle).toBeVisible();

    // Check tabindex
    const tabIndex = await dragHandle.getAttribute('tabindex');
    expect(tabIndex).toBe('-1');

    // Check aria-label
    const ariaLabel = await dragHandle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('reorder');
  });

  // ========== REGRESSION TESTS ==========

  test('REG-001: Adding task does not affect existing order', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Reorder
    const task2 = page.locator('.todo-list li').nth(1);
    const task1 = page.locator('.todo-list li').nth(0);
    await task2.dragTo(task1);
    await page.waitForTimeout(500);

    const firstAfterReorder = await page.locator('.todo-list li label').nth(0).textContent();

    // Add new task
    await input.fill('Task 3');
    await input.press('Enter');

    // Verify order still maintained
    const firstAfterAdd = await page.locator('.todo-list li label').nth(0).textContent();
    expect(firstAfterAdd).toBe(firstAfterReorder);
  });

  test('REG-002: Deleting task maintains order of remaining', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task A');
    await input.press('Enter');
    await input.fill('Task B');
    await input.press('Enter');
    await input.fill('Task C');
    await input.press('Enter');

    // Delete middle task
    await page.locator('.todo-list li .destroy').nth(1).click();
    await page.waitForTimeout(300);

    // Verify remaining tasks in order
    const tasks = page.locator('.todo-list li label');
    await expect(tasks.nth(0)).toHaveText('Task A');
    await expect(tasks.nth(1)).toHaveText('Task C');
  });

  test('REG-003: Toggling completion does not affect order', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Get initial order
    const initialFirst = await page.locator('.todo-list li label').nth(0).textContent();

    // Toggle middle task
    await page.locator('.todo-list li .toggle').nth(1).check();
    await page.waitForTimeout(300);

    // Verify first task unchanged
    const afterToggle = await page.locator('.todo-list li label').nth(0).textContent();
    expect(afterToggle).toBe(initialFirst);
  });

  test('REG-004: Clear completed does not affect active task order', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Active 1');
    await input.press('Enter');
    await input.fill('Completed 1');
    await input.press('Enter');
    await input.fill('Active 2');
    await input.press('Enter');

    // Mark second task as completed
    await page.locator('.todo-list li .toggle').nth(1).check();
    await page.waitForTimeout(300);

    // Clear completed
    const clearButton = page.locator('.clear-completed');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(300);
    }

    // Verify active tasks still in order
    const tasks = page.locator('.todo-list li label');
    await expect(tasks.nth(0)).toHaveText('Active 1');
    await expect(tasks.nth(1)).toHaveText('Active 2');
  });

  test('REG-005: Editing task text preserves position', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Edit middle task
    const middleLabel = page.locator('.todo-list li label').nth(1);
    await middleLabel.dblclick();

    const editInput = page.locator('.todo-list li.editing input.edit');
    await editInput.fill('Modified Task 2');
    await editInput.press('Enter');
    await page.waitForTimeout(300);

    // Verify position unchanged
    const tasks = page.locator('.todo-list li label');
    await expect(tasks.nth(1)).toHaveText('Modified Task 2');
  });

  // ========== PERFORMANCE & STRESS TESTS ==========

  test('PERF-001: Drag with 20 tasks completes quickly', async ({ page }) => {
    const input = page.locator('.new-todo');

    // Add 20 tasks
    for (let i = 1; i <= 20; i++) {
      await input.fill(`Task ${i}`);
      await input.press('Enter');
    }

    const startTime = Date.now();

    // Drag last to first
    const lastTask = page.locator('.todo-list li').nth(19);
    const firstTask = page.locator('.todo-list li').nth(0);
    await lastTask.dragTo(firstTask);
    await page.waitForTimeout(500);

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(3000); // Should complete in under 3s
  });

  test('PERF-002: Multiple sequential drags maintain performance', async ({ page }) => {
    const input = page.locator('.new-todo');

    // Add 10 tasks
    for (let i = 1; i <= 10; i++) {
      await input.fill(`Task ${i}`);
      await input.press('Enter');
    }

    // Perform 5 sequential drags
    for (let i = 0; i < 5; i++) {
      const task = page.locator('.todo-list li').nth(i);
      const target = page.locator('.todo-list li').nth(i + 1);
      await task.dragTo(target);
      await page.waitForTimeout(200);
    }

    // Verify all tasks still present
    const count = await page.locator('.todo-list li').count();
    expect(count).toBe(10);
  });

  // ========== INTEGRATION TESTS ==========

  test('INT-001: Drag works correctly after filter change', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Switch to Active filter
    await page.locator('a[href="#/active"]').click();
    await page.waitForTimeout(300);

    // Drag in active view
    const task2 = page.locator('.todo-list li').nth(1);
    const task1 = page.locator('.todo-list li').nth(0);
    await task2.dragTo(task1);
    await page.waitForTimeout(500);

    // Verify drag worked
    const firstTask = await page.locator('.todo-list li label').nth(0).textContent();
    expect(firstTask).toBe('Task 2');
  });

  test('INT-002: Drag and edit in sequence work correctly', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Drag
    const task2 = page.locator('.todo-list li').nth(1);
    const task1 = page.locator('.todo-list li').nth(0);
    await task2.dragTo(task1);
    await page.waitForTimeout(500);

    // Edit first task (now Task 2)
    const firstLabel = page.locator('.todo-list li label').first();
    await firstLabel.dblclick();

    const editInput = page.locator('.todo-list li.editing input.edit');
    await editInput.fill('Edited Task 2');
    await editInput.press('Enter');
    await page.waitForTimeout(300);

    // Verify
    await expect(page.locator('.todo-list li label').first()).toHaveText('Edited Task 2');
  });

  test('INT-003: Drag, toggle, and filter work together', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Drag Task 3 to first
    const task3 = page.locator('.todo-list li').nth(2);
    const task1 = page.locator('.todo-list li').nth(0);
    await task3.dragTo(task1);
    await page.waitForTimeout(500);

    // Toggle first task (now Task 3)
    await page.locator('.todo-list li .toggle').first().check();
    await page.waitForTimeout(300);

    // Switch to Active filter
    await page.locator('a[href="#/active"]').click();
    await page.waitForTimeout(300);

    // Verify Task 3 not in active list
    const activeTasks = page.locator('.todo-list li label');
    const count = await activeTasks.count();
    expect(count).toBe(2);

    const texts = await activeTasks.allTextContents();
    expect(texts).not.toContain('Task 3');
  });

  // ========== BOUNDARY TESTS ==========

  test('BOUND-001: Empty string task after drag operations', async ({ page }) => {
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Drag
    const task2 = page.locator('.todo-list li').nth(1);
    const task1 = page.locator('.todo-list li').nth(0);
    await task2.dragTo(task1);
    await page.waitForTimeout(500);

    // Try to edit to empty (should delete)
    const firstLabel = page.locator('.todo-list li label').first();
    await firstLabel.dblclick();

    const editInput = page.locator('.todo-list li.editing input.edit');
    await editInput.fill('');
    await editInput.press('Enter');
    await page.waitForTimeout(300);

    // Verify task deleted
    const count = await page.locator('.todo-list li').count();
    expect(count).toBe(1);
  });

  test('BOUND-002: Very long task name preserves drag functionality', async ({ page }) => {
    const longName = 'A'.repeat(200);
    const input = page.locator('.new-todo');
    await input.fill(longName);
    await input.press('Enter');
    await input.fill('Short task');
    await input.press('Enter');

    // Verify drag handle still visible
    const dragHandle = page.locator('.drag-handle').first();
    await expect(dragHandle).toBeVisible();

    // Try to drag
    const task2 = page.locator('.todo-list li').nth(1);
    const task1 = page.locator('.todo-list li').nth(0);
    await task2.dragTo(task1);
    await page.waitForTimeout(500);

    const count = await page.locator('.todo-list li').count();
    expect(count).toBe(2);
  });
});
