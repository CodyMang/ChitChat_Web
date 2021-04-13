package com.example.ChitChat_test_server.databaseConnection;

import java.sql.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class DatabaseConnector{
        private static String username = "root";
        private static String pass = "1234";
        private static String url = "jdbc:mysql://localhost:3306/Chitchat_db";

    public static void storeMessage(String messageContent,String user_id, String chat_id)
    {
        try
        {

            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url,username,pass);

            String query = "INSERT INTO message (user_id,chat_id,content)"
                    +" VALUES (?,?,?);";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1,user_id);
            stmt.setString(2,chat_id);
            stmt.setString(3,messageContent);
            stmt.execute();
            stmt.close();
            con.close();
        }

        catch(Exception e)
        {
            System.err.println("SQL storeMessage Error");
            e.printStackTrace();
        }
    }


    public static String getMessagesFromChat(String chat_id)
    {
        try
        {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url,username,pass);

            String query = "SELECT U.username, M.content " +
                    "FROM message AS M, users as U " +
                    "WHERE U.user_id = M.user_id AND chat_id = ? " +
                    "ORDER BY M.time_stamp";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1,chat_id);
            JsonArray result = new JsonArray();
            JsonObject row = new JsonObject();
            ResultSet set = stmt.executeQuery();
            while(set.next())
            {
                row = new JsonObject();
                row.addProperty("username",set.getString("username"));
                row.addProperty("content",set.getString("content"));
                result.add(row);
            }
            stmt.close();
            set.close();
            con.close();
            return result.toString();
        }

        catch(Exception e)
        {
            System.err.println("SQL storeMessage Error");
            e.printStackTrace();
        }
        return "NULL";
    }
}
