package org.example.pmd;

import java.lang.String;
import java.lang.String;

import static java.time.format.DateTimeFormatter.BASIC_ISO_DATE;
import static java.time.format.DateTimeFormatter.ISO_DATE;
import static java.time.format.DateTimeFormatter.ISO_DATE_TIME;
import static java.time.format.DateTimeFormatter.ISO_LOCAL_TIME;
import static java.time.format.DateTimeFormatter.ISO_INSTANT;

public class CodeStyle extends Object {

    public void forLoopShouldBeWhileLoop() {
        for(; true; ) {

        }
    }

    public void unnecessaryFullyQualifiedName() {
        java.lang.String value = "";
    }

    public static interface UnnecessaryModifier {

    }

    public static enum UnnecessaryModifierEnum {

    }

    public void unnecessaryReturn() {
        return;
    }

    public int uselessParentheses() {
        return (1);
    }

    public void uselessQualifiedThis() {
        CodeStyle instance = CodeStyle.this;
    }
}

interface UnnecessaryModifier {

    public abstract void publicAbstract();
    public static final int publicStaticFinal = 0;
    public static class PublicStaticClass {}
    public static interface PublicStaticInterface {}
}

@interface UnnecessaryModifierAnnotation {

    public abstract int publicAbstract();
    public static final int publicStaticFinal = 0;
    public static class PublicStaticClass {}
    public static interface PublicStaticInterface {}
}
