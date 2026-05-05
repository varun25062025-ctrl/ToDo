package com.todo.utils;

import org.openqa.selenium.WebDriver;
import com.todo.pages.TodoPage;

public class TestContext {
    private WebDriver driver;
    private TodoPage todoPage;
    private static final String APP_URL = "http://localhost:3000";

    public TestContext() {
        this.driver = DriverManager.getDriver();
        this.todoPage = new TodoPage(driver);
    }

    public WebDriver getDriver() {
        return driver;
    }

    public TodoPage getTodoPage() {
        return todoPage;
    }

    public String getAppUrl() {
        return APP_URL;
    }
}