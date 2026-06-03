const { test, expect } = require('@playwright/test');

const APP_URL = 'http://localhost:8080';

test.describe('Drag and Drop Task Reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    // Clear any existing todos
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TEST-001: Drag active task upward in list', async ({ page }) => {
    // Create three tasks
    await page.fill('[data-testid="text-input"]', 'Buy milk');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Write report');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Review code');
    await page.press('[data-testid="text-input"]', 'Enter');

    // Get task elements
    const tasks = await page.locator('[data-testid="todo-item"]').all();
    expect(tasks.length).toBe(3);

    // Verify initial order
    const initialOrder = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(initialOrder).toEqual(['Buy milk', 'Write report', 'Review code']);

    // Drag third task to first position
    const source = tasks[2];
    const target = tasks[0];

    await source.dragTo(target);

    // Verify new order
    const newOrder = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(newOrder).toEqual(['Review code', 'Buy milk', 'Write report']);
  });

  test('TEST-002: Drag task downward in list', async ({ page }) => {
    // Create three tasks
    await page.fill('[data-testid="text-input"]', 'Task A');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Task B');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Task C');
    await page.press('[data-testid="text-input"]', 'Enter');

    // Drag first task to last position
    const tasks = await page.locator('[data-testid="todo-item"]').all();
    await tasks[0].dragTo(tasks[2]);

    // Verify new order
    const newOrder = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(newOrder).toEqual(['Task B', 'Task C', 'Task A']);
  });

  test('TEST-003: Reordered list persists after page reload', async ({ page }) => {
    // Create tasks
    await page.fill('[data-testid="text-input"]', 'First');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Second');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Third');
    await page.press('[data-testid="text-input"]', 'Enter');

    // Drag third task to first position
    const tasks = await page.locator('[data-testid="todo-item"]').all();
    await tasks[2].dragTo(tasks[0]);

    // Verify new order
    let order = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(order).toEqual(['Third', 'First', 'Second']);

    // Reload page
    await page.reload();

    // Verify order persists
    order = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(order).toEqual(['Third', 'First', 'Second']);
  });

  test('TEST-004: Drag within completed tasks filter', async ({ page }) => {
    // Create and complete tasks
    await page.fill('[data-testid="text-input"]', 'Done A');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Done B');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Done C');
    await page.press('[data-testid="text-input"]', 'Enter');

    // Mark all as complete
    const checkboxes = await page.locator('[data-testid="todo-item-toggle"]').all();
    for (const checkbox of checkboxes) {
      await checkbox.click();
    }

    // Switch to completed filter
    await page.click('a[href="#/completed"]');
    await page.waitForTimeout(500);

    // Drag within completed tasks
    const tasks = await page.locator('[data-testid="todo-item"]').all();
    await tasks[2].dragTo(tasks[0]);

    // Verify new order
    const order = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(order).toEqual(['Done C', 'Done A', 'Done B']);
  });

  test('TEST-005: Same position drag is no-op', async ({ page }) => {
    // Create tasks
    await page.fill('[data-testid="text-input"]', 'Task 1');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Task 2');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'Task 3');
    await page.press('[data-testid="text-input"]', 'Enter');

    // Get initial order
    const initialOrder = await page.locator('[data-testid="todo-item-label"]').allTextContents();

    // Drag task to itself
    const tasks = await page.locator('[data-testid="todo-item"]').all();
    await tasks[1].dragTo(tasks[1]);

    // Verify order unchanged
    const finalOrder = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(finalOrder).toEqual(initialOrder);
  });

  test('TEST-006: Drag handle visibility and styling', async ({ page }) => {
    // Create a task
    await page.fill('[data-testid="text-input"]', 'Test Task');
    await page.press('[data-testid="text-input"]', 'Enter');

    // Check drag handle exists
    const dragHandle = page.locator('.drag-handle').first();
    await expect(dragHandle).toBeVisible();

    // Check drag handle has correct content
    const handleText = await dragHandle.textContent();
    expect(handleText).toContain('⋮⋮');

    // Check title attribute
    const title = await dragHandle.getAttribute('title');
    expect(title).toBe('Drag to reorder');
  });

  test('TEST-007: Drag disabled during edit mode', async ({ page }) => {
    // Create a task
    await page.fill('[data-testid="text-input"]', 'Editable Task');
    await page.press('[data-testid="text-input"]', 'Enter');

    // Double-click to edit
    await page.locator('[data-testid="todo-item-label"]').first().dblclick();
    await page.waitForTimeout(300);

    // Check if draggable is false
    const taskItem = page.locator('[data-testid="todo-item"]').first();
    const isDraggable = await taskItem.getAttribute('draggable');
    expect(isDraggable).toBe('false');

    // Check drag handle is not visible
    const dragHandle = page.locator('.drag-handle');
    await expect(dragHandle).not.toBeVisible();
  });

  test('TEST-008: Multiple reorder operations in sequence', async ({ page }) => {
    // Create tasks
    await page.fill('[data-testid="text-input"]', 'A');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'B');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'C');
    await page.press('[data-testid="text-input"]', 'Enter');
    await page.fill('[data-testid="text-input"]', 'D');
    await page.press('[data-testid="text-input"]', 'Enter');

    // First drag: A to position 3
    let tasks = await page.locator('[data-testid="todo-item"]').all();
    await tasks[0].dragTo(tasks[2]);

    let order = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(order).toEqual(['B', 'C', 'A', 'D']);

    // Second drag: D to position 0
    tasks = await page.locator('[data-testid="todo-item"]').all();
    await tasks[3].dragTo(tasks[0]);

    order = await page.locator('[data-testid="todo-item-label"]').allTextContents();
    expect(order).toEqual(['D', 'B', 'C', 'A']);
  });
});
