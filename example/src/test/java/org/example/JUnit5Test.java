package org.example;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

public class JUnit5Test {


    @Test
    public void testPassing() {

    }

    @Test
    public void testAssertionFailure() {
        var number = 2 + 2;
        assertEquals(5, number);
    }

    @Test
    public void testAssertionFailureWithMessage() {
        var number = 2 + 2;
        assertEquals(5, number, "Assertion message");
    }

    @Test
    public void testFail() {
        fail();
    }

    @Test
    public void testFailWithMessage() {
        fail("Failure message");
    }

    @Test
    public void testError() {
        throw new RuntimeException();
    }

    @Test
    public void testErrorWithMessage() {
        throw new RuntimeException("Error message");
    }

    @Test
    public void testSkipped() {
        assumeTrue(2 + 2 == 5);
    }

    @Test
    public void testSkippedWithMessage() {
        assumeTrue(2 + 2 == 5, "Assumption message");
    }

    @Test
    @Disabled
    public void testDisabled() {

    }

    @Test
    @Disabled("Disable message")
    public void testDisabledWithMessage() {

    }
}
