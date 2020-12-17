package org.example.pmd;

import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;

import org.example.pmd.BestPractices;

public class ErrorProne {

    static {}

    public void avoidBranchingStatementAsLastInLoop() {
        for (int i = 0; i < 10; i++) {
            if (i * i <= 25) {
                continue;
            }
            break;
        }
    }

    public BigDecimal avoidDecimalLiteralsInBigDecimalConstructor() {
        return new BigDecimal(1.123);
    }

    public boolean avoidMultipleUnaryOperators() {
        return !!true;
    }

    public int avoidUsingOctalValues() {
        return 010;
    }

    public String brokenNullCheck(String string) {
        if (string != null || !string.equals("")) {
            return string;
        }
        return null;
    }

    public void checkSkipResult() throws IOException {
        FileInputStream fis = new FileInputStream("file");
        fis.skip(1);
    }

    public void classCastExceptionWithToArray() {
        Collection collection = new ArrayList();
        collection.add(1);
        Integer[] array = (Integer[]) collection.toArray();
    }

    public void dontUseFloatTypeForLoopIndices() {
        for (float i = 0; i < 10; i++) {

        }
    }

    public void emptyTryCatchFinallyBlocks() {
        try {

        } catch (Exception exception) {

        } finally {

        }
    }

    public void emptyIfBlock(boolean condition) {
        if (condition) {

        }
    }

    public void emptyStatementBlock() {
        {}
    }

    public void emptyStatementNotInLoop() {
        ;
    }

    public void emptySwitchStatements() {
        int x = 0;
        switch (x) {

        }
    }

    public void emptySynchronizedBlock() {
        synchronized (this) {

        }
    }

    public void emptyWhileStmt() {
        while (true) {

        }
    }

    public void jumbledIncrementer() {
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 20; i++) {
                System.out.println(i + j);
            }
        }
    }

    public boolean misplacedNullCheck(String string) {
        return string.equals("string") && string != null;
    }

    public boolean equals(Object other) {
        return this == other;
    }

    public boolean returnFromFinallyBlock() {
        try {
            return true;
        } finally {
            return false;
        }
    }

    public boolean unconditionalIfStatement() {
        if (true) {
            return true;
        }
        return false;
    }

    public String unnecessaryConversionTemporary(int x) {
        return new Integer(x).toString();
    }

    public boolean unusedNullCheckInEquals(String a, String b) {
        return a != null && b.equals(a);
    }

    public void uselessOperationOnImmutable() {
        BigDecimal bd = new BigDecimal(5);
        bd.add(new BigDecimal(6));
    }
}
