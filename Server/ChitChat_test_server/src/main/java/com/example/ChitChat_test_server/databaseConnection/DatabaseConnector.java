package com.example.ChitChat_test_server.databaseConnection;

import java.sql.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class DatabaseConnector {
    private static String dbusername = "root";
    private static String dbpass = "1234";
    private static String url = "jdbc:mysql://localhost:3306/Chitchat_db";

    public static void storeMessage(String messageContent, String user_id, String chat_id) {
        try {

            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, dbusername, dbpass);

            String query = "INSERT INTO message (user_id,chat_id,content)"
                    + " VALUES (?,?,?);";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1, user_id);
            stmt.setString(2, chat_id);
            stmt.setString(3, messageContent);
            stmt.execute();
            stmt.close();
            con.close();
        } catch (Exception e) {
            System.err.println("SQL storeMessage Error");
            e.printStackTrace();
        }
    }


    public static String getMessagesFromChat(String chat_id) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, dbusername, dbpass);

            String query = "SELECT U.username, M.content " +
                    "FROM message AS M, users as U " +
                    "WHERE U.user_id = M.user_id AND chat_id = ? " +
                    "ORDER BY M.time_stamp";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1, chat_id);
            JsonArray result = new JsonArray();
            JsonObject row = new JsonObject();
            ResultSet set = stmt.executeQuery();
            while (set.next()) {
                row = new JsonObject();
                row.addProperty("username", set.getString("username"));
                row.addProperty("content", set.getString("content"));
                result.add(row);
            }
            stmt.close();
            set.close();
            con.close();
            return result.toString();
        } catch (Exception e) {
            System.err.println("SQL storeMessage Error");
            e.printStackTrace();
        }
        return "NULL";
    }


    public static String getChatsbyUser(String user_id) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, dbusername, dbpass);

            String query = "SELECT C.chat_name, C.chat_id " +
                    "FROM group_users as GU, chats as C " +
                    "WHERE GU.chat_id = C.Chat_id and GU.user_id = ? " +
                    "group by C.chat_name;";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1, user_id);
            JsonArray result = new JsonArray();
            JsonObject row = new JsonObject();
            ResultSet set = stmt.executeQuery();
            while (set.next()) {
                row = new JsonObject();
                row.addProperty("chat_name", set.getString("chat_name"));
                row.addProperty("chat_id", set.getString("chat_id"));
                result.add(row);
            }
            stmt.close();
            set.close();
            con.close();
            return result.toString();
        } catch (Exception e) {
            System.err.println("SQL storeMessage Error");
            e.printStackTrace();
        }
        return "NULL";
    }

    public static String getUserInfoByPass(String userName, String pass) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, dbusername, dbpass);
            //here Chitchat_db is database name, root is username and password

            PreparedStatement stmt = con.prepareStatement("SELECT user_id,username FROM users WHERE username=? and pass =?");
            stmt.setString(1, userName);
            stmt.setString(2, pass);
            ResultSet set = stmt.executeQuery();
            JsonArray result = new JsonArray();
            JsonObject row;

            while (set.next()) {
                row = new JsonObject();
                row.addProperty("user_id", set.getString("user_id"));
                row.addProperty("username", set.getString("username"));
                result.add(row);
            }

            set.close();
            stmt.close();
            con.close();
            if(result.size() == 0)
            {
                return "404";
            }
            return result.toString();
        } catch (Exception e) {
            System.err.println("SQL Database:UserExists Error");
            e.printStackTrace();
        }
        return "404";
    }


    public static String insertNewUser(String userName,String pass, String email, String first_name, String last_name) {
        try {
            Connection con = DriverManager.getConnection(url, dbusername, dbpass);

            String query = "INSERT INTO users (username,pass,email,first_name,last_name)"
                    + " VALUES (?,?,?,?,?);";

            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1, userName);
            stmt.setString(2, pass);
            stmt.setString(3, email);
            stmt.setString(4, first_name);
            stmt.setString(5, last_name);

            stmt.execute();

            stmt.close();
            con.close();
            return ("204");
        }
        catch(java.sql.SQLIntegrityConstraintViolationException e) {
            return "409";
        }
        catch (Exception e) {
            System.err.println("SQL insertNewUser Error");
            e.printStackTrace();
        }
        return "404";
    }

    public static String insertNewChat(String chat_name,String user_id) {
        try {
            Connection con = DriverManager.getConnection(url, dbusername, dbpass);

            String query = "insert into chats set chat_name = ?, size= 1;";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1, chat_name);
            stmt.execute();
            query = "INSERT INTO group_users SET chat_id = (" +
                    "SELECT chat_id " +
                    "FROM chats " +
                    "WHERE chat_name = ? ), user_id = ?;";
            stmt = con.prepareStatement(query);
            stmt.setString(1, chat_name);
            stmt.setString(2, user_id);
            stmt.execute();
            stmt.close();
            con.close();
            return ("204");
        }
        catch(java.sql.SQLIntegrityConstraintViolationException e) {
            return "409";
        }
        catch (Exception e) {
            System.err.println("SQL insertNewChat Error");
            e.printStackTrace();
        }
        return "404";
    }

    public static String joinNewChat(String chat_name,String user_id) {
        try {
            Connection con = DriverManager.getConnection(url, dbusername, dbpass);

            String query = "SELECT chat_id FROM chats WHERE chat_name = ?;";

            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1, chat_name);
            ResultSet set = stmt.executeQuery();
            if(set.next())
            {
                String result = set.getString("chat_id");
                query = "INSERT INTO group_users SET chat_id = ?, user_id = ?;";
                stmt = con.prepareStatement(query);
                stmt.setString(1, result);
                stmt.setString(2, user_id);
                stmt.execute();
            }

            set.close();
            stmt.close();
            con.close();
            return ("204");
        }
        catch(java.sql.SQLIntegrityConstraintViolationException e) {
            return "409";
        }
        catch (Exception e) {
            System.err.println("SQL insertNewChat Error");
            e.printStackTrace();
        }
        return "404";
    }


}
