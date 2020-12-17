package org.example.pmd;

import java.math.BigInteger;

public class Performance {

    public BigInteger bigIntegerInstantiation() {
        return new BigInteger("1");
    }

    public Boolean booleanInstantiation() {
        return new Boolean("true");
    }
}
