# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drag-drop-comprehensive.spec.js >> TodoMVC Drag-and-Drop - Comprehensive Test Suite >> BOUND-001: Empty string task after drag operations
- Location: tests\drag-drop-comprehensive.spec.js:484:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.todo-list li.editing input.edit')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - heading "todos" [level=1] [ref=e4]
      - generic [ref=e5]:
        - textbox "New Todo Input Edit Todo Input" [ref=e6]:
          - /placeholder: What needs to be done?
        - generic [ref=e7]: New Todo Input
    - main [ref=e8]:
      - generic:
        - checkbox "❯ Toggle All Input" [ref=e9]
        - generic: ❯ Toggle All Input
      - list [ref=e10]:
        - listitem
        - listitem [ref=e11]:
          - generic [ref=e12]:
            - button "Drag to reorder task" [ref=e13]: ⋮⋮
            - checkbox [ref=e14]
            - generic [ref=e15]: Task 1
            - button "×" [ref=e16]
    - generic [ref=e17]:
      - generic [ref=e18]: 2 items left!
      - list [ref=e19]:
        - listitem [ref=e20]:
          - link "All" [ref=e21] [cursor=pointer]:
            - /url: "#/"
        - listitem [ref=e22]:
          - link "Active" [ref=e23] [cursor=pointer]:
            - /url: "#/active"
        - listitem [ref=e24]:
          - link "Completed" [ref=e25] [cursor=pointer]:
            - /url: "#/completed"
      - button "Clear completed" [disabled] [ref=e26] [cursor=pointer]
  - contentinfo [ref=e27]:
    - paragraph [ref=e28]: Double-click to edit a todo
    - paragraph [ref=e29]: Created by the TodoMVC Team
    - paragraph [ref=e30]:
      - text: Part of
      - link "TodoMVC" [ref=e31] [cursor=pointer]:
        - /url: http://todomvc.com
```

# Test source

```ts
  402 |   test('INT-001: Drag works correctly after filter change', async ({ page }) => {
  403 |     const input = page.locator('.new-todo');
  404 |     await input.fill('Task 1');
  405 |     await input.press('Enter');
  406 |     await input.fill('Task 2');
  407 |     await input.press('Enter');
  408 | 
  409 |     // Switch to Active filter
  410 |     await page.locator('a[href="#/active"]').click();
  411 |     await page.waitForTimeout(300);
  412 | 
  413 |     // Drag in active view
  414 |     const task2 = page.locator('.todo-list li').nth(1);
  415 |     const task1 = page.locator('.todo-list li').nth(0);
  416 |     await task2.dragTo(task1);
  417 |     await page.waitForTimeout(500);
  418 | 
  419 |     // Verify drag worked
  420 |     const firstTask = await page.locator('.todo-list li label').nth(0).textContent();
  421 |     expect(firstTask).toBe('Task 2');
  422 |   });
  423 | 
  424 |   test('INT-002: Drag and edit in sequence work correctly', async ({ page }) => {
  425 |     const input = page.locator('.new-todo');
  426 |     await input.fill('Task 1');
  427 |     await input.press('Enter');
  428 |     await input.fill('Task 2');
  429 |     await input.press('Enter');
  430 | 
  431 |     // Drag
  432 |     const task2 = page.locator('.todo-list li').nth(1);
  433 |     const task1 = page.locator('.todo-list li').nth(0);
  434 |     await task2.dragTo(task1);
  435 |     await page.waitForTimeout(500);
  436 | 
  437 |     // Edit first task (now Task 2)
  438 |     const firstLabel = page.locator('.todo-list li label').first();
  439 |     await firstLabel.dblclick();
  440 | 
  441 |     const editInput = page.locator('.todo-list li.editing input.edit');
  442 |     await editInput.fill('Edited Task 2');
  443 |     await editInput.press('Enter');
  444 |     await page.waitForTimeout(300);
  445 | 
  446 |     // Verify
  447 |     await expect(page.locator('.todo-list li label').first()).toHaveText('Edited Task 2');
  448 |   });
  449 | 
  450 |   test('INT-003: Drag, toggle, and filter work together', async ({ page }) => {
  451 |     const input = page.locator('.new-todo');
  452 |     await input.fill('Task 1');
  453 |     await input.press('Enter');
  454 |     await input.fill('Task 2');
  455 |     await input.press('Enter');
  456 |     await input.fill('Task 3');
  457 |     await input.press('Enter');
  458 | 
  459 |     // Drag Task 3 to first
  460 |     const task3 = page.locator('.todo-list li').nth(2);
  461 |     const task1 = page.locator('.todo-list li').nth(0);
  462 |     await task3.dragTo(task1);
  463 |     await page.waitForTimeout(500);
  464 | 
  465 |     // Toggle first task (now Task 3)
  466 |     await page.locator('.todo-list li .toggle').first().check();
  467 |     await page.waitForTimeout(300);
  468 | 
  469 |     // Switch to Active filter
  470 |     await page.locator('a[href="#/active"]').click();
  471 |     await page.waitForTimeout(300);
  472 | 
  473 |     // Verify Task 3 not in active list
  474 |     const activeTasks = page.locator('.todo-list li label');
  475 |     const count = await activeTasks.count();
  476 |     expect(count).toBe(2);
  477 | 
  478 |     const texts = await activeTasks.allTextContents();
  479 |     expect(texts).not.toContain('Task 3');
  480 |   });
  481 | 
  482 |   // ========== BOUNDARY TESTS ==========
  483 | 
  484 |   test('BOUND-001: Empty string task after drag operations', async ({ page }) => {
  485 |     const input = page.locator('.new-todo');
  486 |     await input.fill('Task 1');
  487 |     await input.press('Enter');
  488 |     await input.fill('Task 2');
  489 |     await input.press('Enter');
  490 | 
  491 |     // Drag
  492 |     const task2 = page.locator('.todo-list li').nth(1);
  493 |     const task1 = page.locator('.todo-list li').nth(0);
  494 |     await task2.dragTo(task1);
  495 |     await page.waitForTimeout(500);
  496 | 
  497 |     // Try to edit to empty (should delete)
  498 |     const firstLabel = page.locator('.todo-list li label').first();
  499 |     await firstLabel.dblclick();
  500 | 
  501 |     const editInput = page.locator('.todo-list li.editing input.edit');
> 502 |     await editInput.fill('');
      |                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  503 |     await editInput.press('Enter');
  504 |     await page.waitForTimeout(300);
  505 | 
  506 |     // Verify task deleted
  507 |     const count = await page.locator('.todo-list li').count();
  508 |     expect(count).toBe(1);
  509 |   });
  510 | 
  511 |   test('BOUND-002: Very long task name preserves drag functionality', async ({ page }) => {
  512 |     const longName = 'A'.repeat(200);
  513 |     const input = page.locator('.new-todo');
  514 |     await input.fill(longName);
  515 |     await input.press('Enter');
  516 |     await input.fill('Short task');
  517 |     await input.press('Enter');
  518 | 
  519 |     // Verify drag handle still visible
  520 |     const dragHandle = page.locator('.drag-handle').first();
  521 |     await expect(dragHandle).toBeVisible();
  522 | 
  523 |     // Try to drag
  524 |     const task2 = page.locator('.todo-list li').nth(1);
  525 |     const task1 = page.locator('.todo-list li').nth(0);
  526 |     await task2.dragTo(task1);
  527 |     await page.waitForTimeout(500);
  528 | 
  529 |     const count = await page.locator('.todo-list li').count();
  530 |     expect(count).toBe(2);
  531 |   });
  532 | });
  533 | 
```