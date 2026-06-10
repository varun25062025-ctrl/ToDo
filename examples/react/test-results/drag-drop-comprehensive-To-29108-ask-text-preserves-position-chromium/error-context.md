# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drag-drop-comprehensive.spec.js >> TodoMVC Drag-and-Drop - Comprehensive Test Suite >> REG-005: Editing task text preserves position
- Location: tests\drag-drop-comprehensive.spec.js:332:3

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
        - listitem [ref=e11]:
          - generic [ref=e12]:
            - button "Drag to reorder task" [ref=e13]: ⋮⋮
            - checkbox [ref=e14]
            - generic [ref=e15]: Task 1
            - text: ×
        - listitem
        - listitem [ref=e16]:
          - generic [ref=e17]:
            - button "Drag to reorder task" [ref=e18]: ⋮⋮
            - checkbox [ref=e19]
            - generic [ref=e20]: Task 3
            - button "×" [ref=e21]
    - generic [ref=e22]:
      - generic [ref=e23]: 3 items left!
      - list [ref=e24]:
        - listitem [ref=e25]:
          - link "All" [ref=e26] [cursor=pointer]:
            - /url: "#/"
        - listitem [ref=e27]:
          - link "Active" [ref=e28] [cursor=pointer]:
            - /url: "#/active"
        - listitem [ref=e29]:
          - link "Completed" [ref=e30] [cursor=pointer]:
            - /url: "#/completed"
      - button "Clear completed" [disabled] [ref=e31] [cursor=pointer]
  - contentinfo [ref=e32]:
    - paragraph [ref=e33]: Double-click to edit a todo
    - paragraph [ref=e34]: Created by the TodoMVC Team
    - paragraph [ref=e35]:
      - text: Part of
      - link "TodoMVC" [ref=e36] [cursor=pointer]:
        - /url: http://todomvc.com
```

# Test source

```ts
  246 |     await input.fill('Task 2');
  247 |     await input.press('Enter');
  248 | 
  249 |     // Reorder
  250 |     const task2 = page.locator('.todo-list li').nth(1);
  251 |     const task1 = page.locator('.todo-list li').nth(0);
  252 |     await task2.dragTo(task1);
  253 |     await page.waitForTimeout(500);
  254 | 
  255 |     const firstAfterReorder = await page.locator('.todo-list li label').nth(0).textContent();
  256 | 
  257 |     // Add new task
  258 |     await input.fill('Task 3');
  259 |     await input.press('Enter');
  260 | 
  261 |     // Verify order still maintained
  262 |     const firstAfterAdd = await page.locator('.todo-list li label').nth(0).textContent();
  263 |     expect(firstAfterAdd).toBe(firstAfterReorder);
  264 |   });
  265 | 
  266 |   test('REG-002: Deleting task maintains order of remaining', async ({ page }) => {
  267 |     const input = page.locator('.new-todo');
  268 |     await input.fill('Task A');
  269 |     await input.press('Enter');
  270 |     await input.fill('Task B');
  271 |     await input.press('Enter');
  272 |     await input.fill('Task C');
  273 |     await input.press('Enter');
  274 | 
  275 |     // Delete middle task
  276 |     await page.locator('.todo-list li .destroy').nth(1).click();
  277 |     await page.waitForTimeout(300);
  278 | 
  279 |     // Verify remaining tasks in order
  280 |     const tasks = page.locator('.todo-list li label');
  281 |     await expect(tasks.nth(0)).toHaveText('Task A');
  282 |     await expect(tasks.nth(1)).toHaveText('Task C');
  283 |   });
  284 | 
  285 |   test('REG-003: Toggling completion does not affect order', async ({ page }) => {
  286 |     const input = page.locator('.new-todo');
  287 |     await input.fill('Task 1');
  288 |     await input.press('Enter');
  289 |     await input.fill('Task 2');
  290 |     await input.press('Enter');
  291 |     await input.fill('Task 3');
  292 |     await input.press('Enter');
  293 | 
  294 |     // Get initial order
  295 |     const initialFirst = await page.locator('.todo-list li label').nth(0).textContent();
  296 | 
  297 |     // Toggle middle task
  298 |     await page.locator('.todo-list li .toggle').nth(1).check();
  299 |     await page.waitForTimeout(300);
  300 | 
  301 |     // Verify first task unchanged
  302 |     const afterToggle = await page.locator('.todo-list li label').nth(0).textContent();
  303 |     expect(afterToggle).toBe(initialFirst);
  304 |   });
  305 | 
  306 |   test('REG-004: Clear completed does not affect active task order', async ({ page }) => {
  307 |     const input = page.locator('.new-todo');
  308 |     await input.fill('Active 1');
  309 |     await input.press('Enter');
  310 |     await input.fill('Completed 1');
  311 |     await input.press('Enter');
  312 |     await input.fill('Active 2');
  313 |     await input.press('Enter');
  314 | 
  315 |     // Mark second task as completed
  316 |     await page.locator('.todo-list li .toggle').nth(1).check();
  317 |     await page.waitForTimeout(300);
  318 | 
  319 |     // Clear completed
  320 |     const clearButton = page.locator('.clear-completed');
  321 |     if (await clearButton.isVisible()) {
  322 |       await clearButton.click();
  323 |       await page.waitForTimeout(300);
  324 |     }
  325 | 
  326 |     // Verify active tasks still in order
  327 |     const tasks = page.locator('.todo-list li label');
  328 |     await expect(tasks.nth(0)).toHaveText('Active 1');
  329 |     await expect(tasks.nth(1)).toHaveText('Active 2');
  330 |   });
  331 | 
  332 |   test('REG-005: Editing task text preserves position', async ({ page }) => {
  333 |     const input = page.locator('.new-todo');
  334 |     await input.fill('Task 1');
  335 |     await input.press('Enter');
  336 |     await input.fill('Task 2');
  337 |     await input.press('Enter');
  338 |     await input.fill('Task 3');
  339 |     await input.press('Enter');
  340 | 
  341 |     // Edit middle task
  342 |     const middleLabel = page.locator('.todo-list li label').nth(1);
  343 |     await middleLabel.dblclick();
  344 | 
  345 |     const editInput = page.locator('.todo-list li.editing input.edit');
> 346 |     await editInput.fill('Modified Task 2');
      |                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  347 |     await editInput.press('Enter');
  348 |     await page.waitForTimeout(300);
  349 | 
  350 |     // Verify position unchanged
  351 |     const tasks = page.locator('.todo-list li label');
  352 |     await expect(tasks.nth(1)).toHaveText('Modified Task 2');
  353 |   });
  354 | 
  355 |   // ========== PERFORMANCE & STRESS TESTS ==========
  356 | 
  357 |   test('PERF-001: Drag with 20 tasks completes quickly', async ({ page }) => {
  358 |     const input = page.locator('.new-todo');
  359 | 
  360 |     // Add 20 tasks
  361 |     for (let i = 1; i <= 20; i++) {
  362 |       await input.fill(`Task ${i}`);
  363 |       await input.press('Enter');
  364 |     }
  365 | 
  366 |     const startTime = Date.now();
  367 | 
  368 |     // Drag last to first
  369 |     const lastTask = page.locator('.todo-list li').nth(19);
  370 |     const firstTask = page.locator('.todo-list li').nth(0);
  371 |     await lastTask.dragTo(firstTask);
  372 |     await page.waitForTimeout(500);
  373 | 
  374 |     const duration = Date.now() - startTime;
  375 |     expect(duration).toBeLessThan(3000); // Should complete in under 3s
  376 |   });
  377 | 
  378 |   test('PERF-002: Multiple sequential drags maintain performance', async ({ page }) => {
  379 |     const input = page.locator('.new-todo');
  380 | 
  381 |     // Add 10 tasks
  382 |     for (let i = 1; i <= 10; i++) {
  383 |       await input.fill(`Task ${i}`);
  384 |       await input.press('Enter');
  385 |     }
  386 | 
  387 |     // Perform 5 sequential drags
  388 |     for (let i = 0; i < 5; i++) {
  389 |       const task = page.locator('.todo-list li').nth(i);
  390 |       const target = page.locator('.todo-list li').nth(i + 1);
  391 |       await task.dragTo(target);
  392 |       await page.waitForTimeout(200);
  393 |     }
  394 | 
  395 |     // Verify all tasks still present
  396 |     const count = await page.locator('.todo-list li').count();
  397 |     expect(count).toBe(10);
  398 |   });
  399 | 
  400 |   // ========== INTEGRATION TESTS ==========
  401 | 
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
```