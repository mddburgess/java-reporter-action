package org.example.pmd;

public class Multithreading {

    Object object = null;

    public void avoidThreadGroup() {
        ThreadGroup tg = new ThreadGroup("thread group");
    }

    public void dontCallThreadRun() {
        new Thread().run();
    }

    public Object doubleCheckedLocking() {
        if (object == null) {
            synchronized (this) {
                if (object == null) {
                    object = new Object();
                }
            }
        }
        return object;
    }
}
