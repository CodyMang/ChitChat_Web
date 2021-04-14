package com.example.ChitChat_test_server.databaseConnection;


public class NewUser {

    private String username;
    private String pass;
    private String email;
    private String first_name;
    private String last_name;


    public NewUser(String _username,String _pass,String _email,String _first_name,String _last_name) {
        this.username = _username;
        this.pass = _pass;
        this.email = _email;
        this.first_name = _first_name;
        this.last_name = _last_name;
    }

    public String getUsername()
    {
        return this.username;
    }

    public void setUsername(String _un)
    {
        this.username =_un;
    }

    public String getPass()
    {
        return this.pass;
    }

    public void setPass(String _p)
    {
        this.pass = _p;
    }

    public String getEmail()
    {
        return this.email;
    }

    public void setEmail(String _un)
    {
        this.email = _un;
    }
    public String getFirst_name()
    {
        return this.first_name;
    }

    public void setFirst_name(String _un)
    {
        this.first_name =_un;
    }
    public String getLast_name()
    {
        return this.last_name;
    }

    public void setLast_name(String _un)
    {
        this.last_name =_un;
    }
}