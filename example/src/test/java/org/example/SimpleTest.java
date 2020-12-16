package org.example;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

public class SimpleTest {


    @Test
    void passingTest() {
    }

    @Test
    void failingTestWithMessage() {
        assertEquals(5, 2 + 2);
    }

    @Test
    void failingTestWithoutMessage() {
        fail();
    }

    @Test
    void errorTestWithMessage() {
        throw new RuntimeException("error message");
    }

    @Test
    void errorTestWithoutMessage() {
        throw new RuntimeException();
    }

    @Test
    @Disabled
    void disabledTest() {

    }

    @Test
    void skippedTest() {
        assumeTrue(false);
    }
}
