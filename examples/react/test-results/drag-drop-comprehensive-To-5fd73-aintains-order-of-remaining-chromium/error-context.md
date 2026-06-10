# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drag-drop-comprehensive.spec.js >> TodoMVC Drag-and-Drop - Comprehensive Test Suite >> REG-002: Deleting task maintains order of remaining
- Location: tests\drag-drop-comprehensive.spec.js:266:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.todo-list li .destroy').nth(1)
    - locator resolved to <button class="destroy" data-testid="todo-item-button"></button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    56 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - heading "todos" [level=1] [ref=e4]
      - generic [ref=e5]:
        - textbox "New Todo Input" [active] [ref=e6]:
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
            - generic [ref=e15]: Task A
            - text: ×
        - listitem [ref=e16]:
          - generic [ref=e17]:
            - button "Drag to reorder task" [ref=e18]: ⋮⋮
            - checkbox [ref=e19]
            - generic [ref=e20]: Task B
            - text: ×
        - listitem [ref=e21]:
          - generic [ref=e22]:
            - button "Drag to reorder task" [ref=e23]: ⋮⋮
            - checkbox [ref=e24]
            - generic [ref=e25]: Task C
            - text: ×
    - generic [ref=e26]:
      - generic [ref=e27]: 3 items left!
      - list [ref=e28]:
        - listitem [ref=e29]:
          - link "All" [ref=e30] [cursor=pointer]:
            - /url: "#/"
        - listitem [ref=e31]:
          - link "Active" [ref=e32] [cursor=pointer]:
            - /url: "#/active"
        - listitem [ref=e33]:
          - link "Completed" [ref=e34] [cursor=pointer]:
            - /url: "#/completed"
      - button "Clear completed" [disabled] [ref=e35] [cursor=pointer]
  - contentinfo [ref=e36]:
    - paragraph [ref=e37]: Double-click to edit a todo
    - paragraph [ref=e38]: Created by the TodoMVC Team
    - paragraph [ref=e39]:
      - text: Part of
      - link "TodoMVC" [ref=e40] [cursor=pointer]:
        - /url: http://todomvc.com
```

# Test source

```ts
  176 |   });
  177 | 
  178 |   test('TC-008: Same position drag is no-op', async ({ page }) => {
  179 |     const input = page.locator('.new-todo');
  180 |     await input.fill('Task 1');
  181 |     await input.press('Enter');
  182 |     await input.fill('Task 2');
  183 |     await input.press('Enter');
  184 | 
  185 |     const tasks = page.locator('.todo-list li label');
  186 |     const firstText = await tasks.nth(0).textContent();
  187 | 
  188 |     // Drag task to itself
  189 |     const task1 = page.locator('.todo-list li').nth(0);
  190 |     await task1.dragTo(task1);
  191 |     await page.waitForTimeout(300);
  192 | 
  193 |     const firstTextAfter = await tasks.nth(0).textContent();
  194 |     expect(firstTextAfter).toBe(firstText);
  195 |   });
  196 | 
  197 |   test('TC-009: Filter switching maintains order', async ({ page }) => {
  198 |     const input = page.locator('.new-todo');
  199 |     await input.fill('Active 1');
  200 |     await input.press('Enter');
  201 |     await input.fill('Active 2');
  202 |     await input.press('Enter');
  203 | 
  204 |     // Reorder
  205 |     const task2 = page.locator('.todo-list li').nth(1);
  206 |     const task1 = page.locator('.todo-list li').nth(0);
  207 |     await task2.dragTo(task1);
  208 |     await page.waitForTimeout(500);
  209 | 
  210 |     const tasksAll = page.locator('.todo-list li label');
  211 |     const firstInAll = await tasksAll.nth(0).textContent();
  212 | 
  213 |     // Switch to Active filter
  214 |     await page.locator('a[href="#/active"]').click();
  215 |     await page.waitForTimeout(300);
  216 | 
  217 |     const tasksActive = page.locator('.todo-list li label');
  218 |     const firstInActive = await tasksActive.nth(0).textContent();
  219 |     expect(firstInActive).toBe(firstInAll);
  220 |   });
  221 | 
  222 |   test('TC-010: Accessibility attributes present', async ({ page }) => {
  223 |     const input = page.locator('.new-todo');
  224 |     await input.fill('Accessibility Test');
  225 |     await input.press('Enter');
  226 | 
  227 |     const dragHandle = page.locator('.drag-handle').first();
  228 |     await expect(dragHandle).toBeVisible();
  229 | 
  230 |     // Check tabindex
  231 |     const tabIndex = await dragHandle.getAttribute('tabindex');
  232 |     expect(tabIndex).toBe('-1');
  233 | 
  234 |     // Check aria-label
  235 |     const ariaLabel = await dragHandle.getAttribute('aria-label');
  236 |     expect(ariaLabel).toBeTruthy();
  237 |     expect(ariaLabel).toContain('reorder');
  238 |   });
  239 | 
  240 |   // ========== REGRESSION TESTS ==========
  241 | 
  242 |   test('REG-001: Adding task does not affect existing order', async ({ page }) => {
  243 |     const input = page.locator('.new-todo');
  244 |     await input.fill('Task 1');
  245 |     await input.press('Enter');
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
> 276 |     await page.locator('.todo-list li .destroy').nth(1).click();
      |                                                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  346 |     await editInput.fill('Modified Task 2');
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
```