package com.todo.stepdefinitions;

import com.todo.utils.DriverManager;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

public class Hooks {

    @Before
    public void beforeScenario(Scenario scenario) {
        System.out.println("Starting scenario: " + scenario.getName());
    }

    @After
    public void afterScenario(Scenario scenario) {
        try {
            if (scenario.isFailed()) {
                WebDriver driver = DriverManager.getDriver();
                if (driver != null) {
                    byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                    scenario.attach(screenshot, "image/png", "Failed Screenshot");
                }
            }
        } catch (Exception e) {
            System.out.println("Could not take screenshot: " + e.getMessage());
        } finally {
            DriverManager.quitDriver();
            System.out.println("Finished scenario: " + scenario.getName());
        }
    }
}
