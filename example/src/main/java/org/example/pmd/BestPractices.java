package org.example.pmd;

import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class BestPractices {

    public String ipAddress = "127.0.0.1";
    private String unusedPrivateField;

    public void checkResultSet() throws SQLException {
        Connection conn = null;
        Statement stat = conn.createStatement();
        ResultSet rst = stat.executeQuery("SELECT * FROM example");
        rst.next();
    }

    private void unusedPrivateMethod(String unusedFormalParameter) {
        int unusedLocalVariable = 0;
    }
}
