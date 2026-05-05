package com.todo.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

public class TodoPage {
    private WebDriver driver;
    private WebDriverWait wait;
    private Actions actions;

    private By todoInput = By.className("new-todo");
    private By todoItem = By.cssSelector(".todo-list li");
    private By checkbox = By.cssSelector("input.toggle");
    private By deleteButton = By.className("destroy");
    private By filterAll = By.cssSelector("a[href='#/']");
    private By filterActive = By.cssSelector("a[href='#/active']");
    private By filterCompleted = By.cssSelector("a[href='#/completed']");

    public TodoPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.actions = new Actions(driver);
    }

    public void navigateToApp(String url) {
        driver.get(url);
        wait.until(ExpectedConditions.presenceOfElementLocated(todoInput));
    }

    public void addTodoItem(String title, boolean completed) {
        WebElement input = driver.findElement(todoInput);
        input.sendKeys(title);
        input.sendKeys(Keys.ENTER);
        if (completed) {
            List<WebElement> items = driver.findElements(todoItem);
            items.get(items.size() - 1).findElement(checkbox).click();
        }
        waitForStabilization();
    }

    public void switchToView(String view) {
        By filter = view.equalsIgnoreCase("active") ? filterActive :
                   view.equalsIgnoreCase("completed") ? filterCompleted : filterAll;
        driver.findElement(filter).click();
        waitForStabilization();
    }

    public WebElement getTodoItemByTitle(String title) {
        return driver.findElements(todoItem).stream()
            .filter(item -> {
                try {
                    return item.findElement(By.tagName("label")).getText().equals(title);
                } catch (Exception e) {
                    return false;
                }
            })
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Todo not found: " + title));
    }

    public WebElement getDragHandleForItem(String title) {
        WebElement item = getTodoItemByTitle(title);
        try {
            return item.findElement(By.cssSelector("[data-testid='drag-handle'], .drag-handle"));
        } catch (NoSuchElementException e) {
            return item.findElement(By.cssSelector("[draggable='true']"));
        }
    }

    public void dragItemByHandle(String sourceTitle, String targetTitle, boolean before) {
        WebElement sourceHandle = getDragHandleForItem(sourceTitle);
        WebElement targetItem = getTodoItemByTitle(targetTitle);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", sourceHandle);
        waitForStabilization();
        actions.clickAndHold(sourceHandle)
               .pause(Duration.ofMillis(300))
               .moveToElement(targetItem, 0, before ? -10 : 10)
               .pause(Duration.ofMillis(300))
               .release()
               .perform();
        waitForStabilization();
    }

    public List<String> getTodoItemTitlesInOrder() {
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(todoItem));
        return driver.findElements(todoItem).stream()
            .map(item -> {
                try {
                    return item.findElement(By.tagName("label")).getText();
                } catch (Exception e) {
                    return "";
                }
            })
            .filter(title -> !title.isEmpty())
            .collect(Collectors.toList());
    }

    public void doubleClickOnTitle(String title) {
        WebElement label = getTodoItemByTitle(title).findElement(By.tagName("label"));
        actions.doubleClick(label).perform();
        waitForStabilization();
    }

    public boolean isItemInEditMode(String title) {
        return getTodoItemByTitle(title).getAttribute("class").contains("editing");
    }

    public boolean isDragHandleDisabled(String title) {
        WebElement handle = getDragHandleForItem(title);
        return "true".equals(handle.getAttribute("aria-disabled"));
    }

    public void reloadPage() {
        driver.navigate().refresh();
        wait.until(ExpectedConditions.presenceOfElementLocated(todoInput));
        waitForStabilization();
    }

    public String getDragHandleAttribute(String title, String attribute) {
        return getDragHandleForItem(title).getAttribute(attribute);
    }

    public void clearAllTodos() {
        driver.findElements(todoItem).forEach(item -> {
            try {
                actions.moveToElement(item).perform();
                item.findElement(deleteButton).click();
                Thread.sleep(100);
            } catch (Exception ignored) {}
        });
    }

    public void setLocalStorage(String key, String value) {
        ((JavascriptExecutor) driver).executeScript(
            "window.localStorage.setItem(arguments[0], arguments[1]);", key, value
        );
    }

    public String getLocalStorage(String key) {
        return (String) ((JavascriptExecutor) driver).executeScript(
            "return window.localStorage.getItem(arguments[0]);", key
        );
    }

    public int getTodoItemCount() {
        try {
            return driver.findElements(todoItem).size();
        } catch (Exception e) {
            return 0;
        }
    }

    public void deleteTodoItem(String title) {
        WebElement item = getTodoItemByTitle(title);
        actions.moveToElement(item).perform();
        item.findElement(deleteButton).click();
        waitForStabilization();
    }

    private void waitForStabilization() {
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}