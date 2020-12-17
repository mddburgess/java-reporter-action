package org.example.pmd;

public class Design {

    public void collapsibleIfStatements(boolean x, boolean y) {
        if (x) {
            if (y) {
                x = y;
            }
        }
    }

    public boolean simplifiedTernary(boolean condition, boolean something) {
        return condition ? true : something;
    }

    public String toString() {
        return super.toString();
    }
}
