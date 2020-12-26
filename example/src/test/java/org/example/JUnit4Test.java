package org.example;

import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.junit.Assume.assumeTrue;

public class JUnit4Test {

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
        assertEquals("Assertion message", 5, number);
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
        assumeTrue("Assumption message", 2 + 2 == 5);
    }

    @Test
    @Ignore
    public void testIgnored() {

    }

    @Test
    @Ignore("Ignore message")
    public void testIgnoredWithMessage() {

    }
}
