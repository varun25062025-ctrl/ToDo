# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drag-drop.spec.js >> TodoMVC Drag-and-Drop Reordering >> TC-005: No reorder during edit mode
- Location: tests\drag-drop.spec.js:122:3

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
  34  | 
  35  |     // Verify new order
  36  |     const tasksAfter = page.locator('.todo-list li label');
  37  |     await expect(tasksAfter.nth(0)).toHaveText('Task C');
  38  | 
  39  |     // Reload and verify persistence
  40  |     await page.reload();
  41  |     const tasksReloaded = page.locator('.todo-list li label');
  42  |     await expect(tasksReloaded.nth(0)).toHaveText('Task C');
  43  |   });
  44  | 
  45  |   test('TC-002: Drag task downward in completed list', async ({ page }) => {
  46  |     // Add and complete 3 tasks
  47  |     const input = page.locator('.new-todo');
  48  |     await input.fill('Completed A');
  49  |     await input.press('Enter');
  50  |     await input.fill('Completed B');
  51  |     await input.press('Enter');
  52  |     await input.fill('Completed C');
  53  |     await input.press('Enter');
  54  | 
  55  |     // Mark all as completed
  56  |     await page.locator('.todo-list li .toggle').nth(0).check();
  57  |     await page.locator('.todo-list li .toggle').nth(1).check();
  58  |     await page.locator('.todo-list li .toggle').nth(2).check();
  59  | 
  60  |     // Switch to Completed filter
  61  |     await page.locator('a[href="#/completed"]').click();
  62  |     await page.waitForTimeout(300);
  63  | 
  64  |     // Drag first to last
  65  |     const firstTask = page.locator('.todo-list li').nth(0);
  66  |     const lastTask = page.locator('.todo-list li').nth(2);
  67  |     await firstTask.dragTo(lastTask);
  68  |     await page.waitForTimeout(500);
  69  | 
  70  |     // Verify order changed
  71  |     const tasksAfter = page.locator('.todo-list li label');
  72  |     const count = await tasksAfter.count();
  73  |     expect(count).toBeGreaterThan(0);
  74  |   });
  75  | 
  76  |   test('TC-003: Visual feedback during drag', async ({ page }) => {
  77  |     // Add tasks
  78  |     const input = page.locator('.new-todo');
  79  |     await input.fill('Visual Test Task');
  80  |     await input.press('Enter');
  81  |     await input.fill('Drop Target Task');
  82  |     await input.press('Enter');
  83  | 
  84  |     // Check drag handle exists
  85  |     const dragHandle = page.locator('.drag-handle').first();
  86  |     await expect(dragHandle).toBeVisible();
  87  | 
  88  |     // Verify drag handle cursor
  89  |     const cursor = await dragHandle.evaluate(el =>
  90  |       window.getComputedStyle(el).cursor
  91  |     );
  92  |     expect(cursor).toContain('grab');
  93  |   });
  94  | 
  95  |   test('TC-004: Reorder in All filter view', async ({ page }) => {
  96  |     // Add mix of tasks
  97  |     const input = page.locator('.new-todo');
  98  |     await input.fill('Active Task');
  99  |     await input.press('Enter');
  100 |     await input.fill('Completed Task');
  101 |     await input.press('Enter');
  102 | 
  103 |     // Mark second as completed
  104 |     await page.locator('.todo-list li .toggle').nth(1).check();
  105 | 
  106 |     // Ensure All filter
  107 |     await page.locator('a[href="#/"]').click();
  108 |     await page.waitForTimeout(300);
  109 | 
  110 |     // Verify both tasks visible
  111 |     const tasks = page.locator('.todo-list li');
  112 |     const count = await tasks.count();
  113 |     expect(count).toBe(2);
  114 | 
  115 |     // Try to reorder
  116 |     const task1 = tasks.nth(0);
  117 |     const task2 = tasks.nth(1);
  118 |     await task1.dragTo(task2);
  119 |     await page.waitForTimeout(500);
  120 |   });
  121 | 
  122 |   test('TC-005: No reorder during edit mode', async ({ page }) => {
  123 |     // Add task
  124 |     const input = page.locator('.new-todo');
  125 |     await input.fill('Edit Mode Test');
  126 |     await input.press('Enter');
  127 | 
  128 |     // Double-click to edit
  129 |     const taskLabel = page.locator('.todo-list li label').first();
  130 |     await taskLabel.dblclick();
  131 | 
  132 |     // Verify editing class
  133 |     const editingTask = page.locator('.todo-list li.editing');
> 134 |     await expect(editingTask).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
  135 | 
  136 |     // Verify draggable is disabled
  137 |     const isDraggable = await editingTask.getAttribute('draggable');
  138 |     expect(isDraggable).toBe('false');
  139 |   });
  140 | 
  141 |   test('TC-006: Single task list edge case', async ({ page }) => {
  142 |     // Add only one task
  143 |     const input = page.locator('.new-todo');
  144 |     await input.fill('Single Task');
  145 |     await input.press('Enter');
  146 | 
  147 |     const tasks = page.locator('.todo-list li');
  148 |     const count = await tasks.count();
  149 |     expect(count).toBe(1);
  150 | 
  151 |     // Try to drag (should be no-op)
  152 |     const task = tasks.first();
  153 |     await task.dragTo(task);
  154 |     await page.waitForTimeout(300);
  155 | 
  156 |     // Verify still one task
  157 |     const countAfter = await tasks.count();
  158 |     expect(countAfter).toBe(1);
  159 |   });
  160 | 
  161 |   test('TC-007: Empty list edge case', async ({ page }) => {
  162 |     // Verify no tasks
  163 |     const tasks = page.locator('.todo-list li');
  164 |     const count = await tasks.count();
  165 |     expect(count).toBe(0);
  166 | 
  167 |     // Add a task
  168 |     const input = page.locator('.new-todo');
  169 |     await input.fill('First Task');
  170 |     await input.press('Enter');
  171 | 
  172 |     // Verify drag handle appears
  173 |     const dragHandle = page.locator('.drag-handle').first();
  174 |     await expect(dragHandle).toBeVisible();
  175 |   });
  176 | 
  177 |   test('TC-008: Same position drag (no-op)', async ({ page }) => {
  178 |     // Add tasks
  179 |     const input = page.locator('.new-todo');
  180 |     await input.fill('Task 1');
  181 |     await input.press('Enter');
  182 |     await input.fill('Task 2');
  183 |     await input.press('Enter');
  184 | 
  185 |     // Get initial order
  186 |     const tasks = page.locator('.todo-list li label');
  187 |     const firstText = await tasks.nth(0).textContent();
  188 | 
  189 |     // Drag task to itself
  190 |     const task1 = page.locator('.todo-list li').nth(0);
  191 |     await task1.dragTo(task1);
  192 |     await page.waitForTimeout(300);
  193 | 
  194 |     // Verify order unchanged
  195 |     const tasksAfter = page.locator('.todo-list li label');
  196 |     const firstTextAfter = await tasksAfter.nth(0).textContent();
  197 |     expect(firstTextAfter).toBe(firstText);
  198 |   });
  199 | 
  200 |   test('TC-009: Filter switching maintains order', async ({ page }) => {
  201 |     // Add tasks
  202 |     const input = page.locator('.new-todo');
  203 |     await input.fill('Active 1');
  204 |     await input.press('Enter');
  205 |     await input.fill('Active 2');
  206 |     await input.press('Enter');
  207 | 
  208 |     // Reorder in All view
  209 |     const task2 = page.locator('.todo-list li').nth(1);
  210 |     const task1 = page.locator('.todo-list li').nth(0);
  211 |     await task2.dragTo(task1);
  212 |     await page.waitForTimeout(500);
  213 | 
  214 |     // Get order after reorder
  215 |     const tasksAll = page.locator('.todo-list li label');
  216 |     const firstInAll = await tasksAll.nth(0).textContent();
  217 | 
  218 |     // Switch to Active filter
  219 |     await page.locator('a[href="#/active"]').click();
  220 |     await page.waitForTimeout(300);
  221 | 
  222 |     // Verify order maintained
  223 |     const tasksActive = page.locator('.todo-list li label');
  224 |     const firstInActive = await tasksActive.nth(0).textContent();
  225 |     expect(firstInActive).toBe(firstInAll);
  226 |   });
  227 | 
  228 |   test('TC-010: Accessibility validation', async ({ page }) => {
  229 |     // Add task
  230 |     const input = page.locator('.new-todo');
  231 |     await input.fill('Accessibility Test');
  232 |     await input.press('Enter');
  233 | 
  234 |     // Check drag handle has proper attributes
```