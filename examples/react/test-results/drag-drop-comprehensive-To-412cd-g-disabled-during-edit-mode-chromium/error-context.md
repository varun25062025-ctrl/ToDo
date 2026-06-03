# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drag-drop-comprehensive.spec.js >> TodoMVC Drag-and-Drop - Comprehensive Test Suite >> TC-005: Drag disabled during edit mode
- Location: tests\drag-drop-comprehensive.spec.js:125:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.todo-list li.editing')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.todo-list li.editing')
    14 × locator resolved to <li class="editing" draggable="false" data-testid="todo-item">…</li>
       - unexpected value "hidden"

```

```yaml
- heading "todos" [level=1]
- textbox "New Todo Input Edit Todo Input":
  - /placeholder: What needs to be done?
- text: New Todo Input
- main:
  - checkbox "❯ Toggle All Input"
  - text: ❯ Toggle All Input
  - list:
    - listitem
- text: 1 item left!
- list:
  - listitem:
    - link "All":
      - /url: "#/"
  - listitem:
    - link "Active":
      - /url: "#/active"
  - listitem:
    - link "Completed":
      - /url: "#/completed"
- button "Clear completed" [disabled]
- contentinfo:
  - paragraph: Double-click to edit a todo
  - paragraph: Created by the TodoMVC Team
  - paragraph:
    - text: Part of
    - link "TodoMVC":
      - /url: http://todomvc.com
```

# Test source

```ts
  36  | 
  37  |     // Reload and verify persistence
  38  |     await page.reload();
  39  |     await page.waitForSelector('.todo-list li');
  40  |     const tasksReloaded = page.locator('.todo-list li label');
  41  |     await expect(tasksReloaded.nth(0)).toHaveText('Task C');
  42  |   });
  43  | 
  44  |   test('TC-002: Drag task downward in completed list', async ({ page }) => {
  45  |     const input = page.locator('.new-todo');
  46  |     await input.fill('Completed A');
  47  |     await input.press('Enter');
  48  |     await input.fill('Completed B');
  49  |     await input.press('Enter');
  50  |     await input.fill('Completed C');
  51  |     await input.press('Enter');
  52  | 
  53  |     // Complete all tasks
  54  |     await page.locator('.todo-list li .toggle').nth(0).check();
  55  |     await page.locator('.todo-list li .toggle').nth(1).check();
  56  |     await page.locator('.todo-list li .toggle').nth(2).check();
  57  | 
  58  |     // Switch to Completed filter
  59  |     await page.locator('a[href="#/completed"]').click();
  60  |     await page.waitForTimeout(300);
  61  | 
  62  |     // Drag first to last
  63  |     const tasks = page.locator('.todo-list li');
  64  |     const firstTask = tasks.nth(0);
  65  |     const lastTask = tasks.nth(2);
  66  |     await firstTask.dragTo(lastTask);
  67  |     await page.waitForTimeout(500);
  68  | 
  69  |     // Verify at least  tasks visible
  70  |     const count = await tasks.count();
  71  |     expect(count).toBeGreaterThan(0);
  72  |   });
  73  | 
  74  |   test('TC-003: Visual feedback during drag operations', async ({ page }) => {
  75  |     const input = page.locator('.new-todo');
  76  |     await input.fill('Visual Test Task');
  77  |     await input.press('Enter');
  78  |     await input.fill('Drop Target Task');
  79  |     await input.press('Enter');
  80  | 
  81  |     // Check drag handle exists and visible
  82  |     const dragHandle = page.locator('.drag-handle').first();
  83  |     await expect(dragHandle).toBeVisible();
  84  | 
  85  |     // Verify drag handle has correct text
  86  |     await expect(dragHandle).toHaveText('⋮⋮');
  87  | 
  88  |     // Check cursor style
  89  |     const cursor = await dragHandle.evaluate(el =>
  90  |       window.getComputedStyle(el).cursor
  91  |     );
  92  |     expect(cursor).toContain('grab');
  93  |   });
  94  | 
  95  |   test('TC-004: Reorder in All filter view', async ({ page }) => {
  96  |     const input = page.locator('.new-todo');
  97  |     await input.fill('Active Task');
  98  |     await input.press('Enter');
  99  |     await input.fill('Completed Task');
  100 |     await input.press('Enter');
  101 | 
  102 |     // Mark second as completed
  103 |     await page.locator('.todo-list li .toggle').nth(1).check();
  104 | 
  105 |     // Ensure All filter
  106 |     await page.locator('a[href="#/"]').click();
  107 |     await page.waitForTimeout(300);
  108 | 
  109 |     // Verify both visible
  110 |     const tasks = page.locator('.todo-list li');
  111 |     const count = await tasks.count();
  112 |     expect(count).toBe(2);
  113 | 
  114 |     // Reorder
  115 |     const task1 = tasks.nth(0);
  116 |     const task2 = tasks.nth(1);
  117 |     await task1.dragTo(task2);
  118 |     await page.waitForTimeout(500);
  119 | 
  120 |     // Verify still 2 tasks
  121 |     const countAfter = await tasks.count();
  122 |     expect(countAfter).toBe(2);
  123 |   });
  124 | 
  125 |   test('TC-005: Drag disabled during edit mode', async ({ page }) => {
  126 |     const input = page.locator('.new-todo');
  127 |     await input.fill('Edit Mode Test');
  128 |     await input.press('Enter');
  129 | 
  130 |     // Double-click to edit
  131 |     const taskLabel = page.locator('.todo-list li label').first();
  132 |     await taskLabel.dblclick();
  133 | 
  134 |     // Verify editing class present
  135 |     const editingTask = page.locator('.todo-list li.editing');
> 136 |     await expect(editingTask).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
  137 | 
  138 |     // Verify draggable is false
  139 |     const isDraggable = await editingTask.getAttribute('draggable');
  140 |     expect(isDraggable).toBe('false');
  141 |   });
  142 | 
  143 |   // ========== EDGE CASE TESTS ==========
  144 | 
  145 |   test('TC-006: Single task list - no errors on drag', async ({ page }) => {
  146 |     const input = page.locator('.new-todo');
  147 |     await input.fill('Single Task');
  148 |     await input.press('Enter');
  149 | 
  150 |     const tasks = page.locator('.todo-list li');
  151 |     const count = await tasks.count();
  152 |     expect(count).toBe(1);
  153 | 
  154 |     // Try to drag (should be no-op)
  155 |     const task = tasks.first();
  156 |     await task.dragTo(task);
  157 |     await page.waitForTimeout(300);
  158 | 
  159 |     const countAfter = await tasks.count();
  160 |     expect(countAfter).toBe(1);
  161 |   });
  162 | 
  163 |   test('TC-007: Empty list - no drag handles shown', async ({ page }) => {
  164 |     const tasks = page.locator('.todo-list li');
  165 |     const count = await tasks.count();
  166 |     expect(count).toBe(0);
  167 | 
  168 |     // Add a task
  169 |     const input = page.locator('.new-todo');
  170 |     await input.fill('First Task');
  171 |     await input.press('Enter');
  172 | 
  173 |     // Verify drag handle appears
  174 |     const dragHandle = page.locator('.drag-handle').first();
  175 |     await expect(dragHandle).toBeVisible();
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
```