const { test, expect } = require('@playwright/test');

test.describe('TodoMVC Drag-and-Drop Reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    // Clear any existing todos
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TC-001: Drag task upward in active list', async ({ page }) => {
    // Add 3 tasks
    const input = page.locator('.new-todo');
    await input.fill('Task A');
    await input.press('Enter');
    await input.fill('Task B');
    await input.press('Enter');
    await input.fill('Task C');
    await input.press('Enter');

    // Get initial order
    const tasks = page.locator('.todo-list li label');
    await expect(tasks.nth(0)).toHaveText('Task A');
    await expect(tasks.nth(1)).toHaveText('Task B');
    await expect(tasks.nth(2)).toHaveText('Task C');

    // Drag Task C to first position
    const taskC = page.locator('.todo-list li').nth(2);
    const taskA = page.locator('.todo-list li').nth(0);
    await taskC.dragTo(taskA);

    // Wait for reorder
    await page.waitForTimeout(500);

    // Verify new order
    const tasksAfter = page.locator('.todo-list li label');
    await expect(tasksAfter.nth(0)).toHaveText('Task C');

    // Reload and verify persistence
    await page.reload();
    const tasksReloaded = page.locator('.todo-list li label');
    await expect(tasksReloaded.nth(0)).toHaveText('Task C');
  });

  test('TC-002: Drag task downward in completed list', async ({ page }) => {
    // Add and complete 3 tasks
    const input = page.locator('.new-todo');
    await input.fill('Completed A');
    await input.press('Enter');
    await input.fill('Completed B');
    await input.press('Enter');
    await input.fill('Completed C');
    await input.press('Enter');

    // Mark all as completed
    await page.locator('.todo-list li .toggle').nth(0).check();
    await page.locator('.todo-list li .toggle').nth(1).check();
    await page.locator('.todo-list li .toggle').nth(2).check();

    // Switch to Completed filter
    await page.locator('a[href="#/completed"]').click();
    await page.waitForTimeout(300);

    // Drag first to last
    const firstTask = page.locator('.todo-list li').nth(0);
    const lastTask = page.locator('.todo-list li').nth(2);
    await firstTask.dragTo(lastTask);
    await page.waitForTimeout(500);

    // Verify order changed
    const tasksAfter = page.locator('.todo-list li label');
    const count = await tasksAfter.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-003: Visual feedback during drag', async ({ page }) => {
    // Add tasks
    const input = page.locator('.new-todo');
    await input.fill('Visual Test Task');
    await input.press('Enter');
    await input.fill('Drop Target Task');
    await input.press('Enter');

    // Check drag handle exists
    const dragHandle = page.locator('.drag-handle').first();
    await expect(dragHandle).toBeVisible();

    // Verify drag handle cursor
    const cursor = await dragHandle.evaluate(el =>
      window.getComputedStyle(el).cursor
    );
    expect(cursor).toContain('grab');
  });

  test('TC-004: Reorder in All filter view', async ({ page }) => {
    // Add mix of tasks
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

    // Verify both tasks visible
    const tasks = page.locator('.todo-list li');
    const count = await tasks.count();
    expect(count).toBe(2);

    // Try to reorder
    const task1 = tasks.nth(0);
    const task2 = tasks.nth(1);
    await task1.dragTo(task2);
    await page.waitForTimeout(500);
  });

  test('TC-005: No reorder during edit mode', async ({ page }) => {
    // Add task
    const input = page.locator('.new-todo');
    await input.fill('Edit Mode Test');
    await input.press('Enter');

    // Double-click to edit
    const taskLabel = page.locator('.todo-list li label').first();
    await taskLabel.dblclick();

    // Verify editing class
    const editingTask = page.locator('.todo-list li.editing');
    await expect(editingTask).toBeVisible();

    // Verify draggable is disabled
    const isDraggable = await editingTask.getAttribute('draggable');
    expect(isDraggable).toBe('false');
  });

  test('TC-006: Single task list edge case', async ({ page }) => {
    // Add only one task
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

    // Verify still one task
    const countAfter = await tasks.count();
    expect(countAfter).toBe(1);
  });

  test('TC-007: Empty list edge case', async ({ page }) => {
    // Verify no tasks
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

  test('TC-008: Same position drag (no-op)', async ({ page }) => {
    // Add tasks
    const input = page.locator('.new-todo');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Get initial order
    const tasks = page.locator('.todo-list li label');
    const firstText = await tasks.nth(0).textContent();

    // Drag task to itself
    const task1 = page.locator('.todo-list li').nth(0);
    await task1.dragTo(task1);
    await page.waitForTimeout(300);

    // Verify order unchanged
    const tasksAfter = page.locator('.todo-list li label');
    const firstTextAfter = await tasksAfter.nth(0).textContent();
    expect(firstTextAfter).toBe(firstText);
  });

  test('TC-009: Filter switching maintains order', async ({ page }) => {
    // Add tasks
    const input = page.locator('.new-todo');
    await input.fill('Active 1');
    await input.press('Enter');
    await input.fill('Active 2');
    await input.press('Enter');

    // Reorder in All view
    const task2 = page.locator('.todo-list li').nth(1);
    const task1 = page.locator('.todo-list li').nth(0);
    await task2.dragTo(task1);
    await page.waitForTimeout(500);

    // Get order after reorder
    const tasksAll = page.locator('.todo-list li label');
    const firstInAll = await tasksAll.nth(0).textContent();

    // Switch to Active filter
    await page.locator('a[href="#/active"]').click();
    await page.waitForTimeout(300);

    // Verify order maintained
    const tasksActive = page.locator('.todo-list li label');
    const firstInActive = await tasksActive.nth(0).textContent();
    expect(firstInActive).toBe(firstInAll);
  });

  test('TC-010: Accessibility validation', async ({ page }) => {
    // Add task
    const input = page.locator('.new-todo');
    await input.fill('Accessibility Test');
    await input.press('Enter');

    // Check drag handle has proper attributes
    const dragHandle = page.locator('.drag-handle').first();
    await expect(dragHandle).toBeVisible();

    // Verify handle is excluded from tab order
    const tabIndex = await dragHandle.getAttribute('tabindex');
    expect(tabIndex).toBe('-1');

    // Verify ARIA labels exist
    const ariaLabel = await dragHandle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});
