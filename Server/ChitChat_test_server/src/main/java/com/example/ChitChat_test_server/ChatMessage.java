package com.example.ChitChat_test_server;
import java.util.ArrayList;
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String chat_id;
    private String sender_id;
    private String message_id;
    private String chat_name;
    private String message_type;
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        UPDATE,
        RELOAD,
        FRIEND_REQUEST,
        CHAT_INVITE
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getChat_name() {return this.chat_name;}
    public void setChat_name(String chat_name){ this.chat_name = chat_name;}

    public String getChat_id() {return this.chat_id;}
    public void setChat_id(String chat_id){ this.chat_id = chat_id;}
    public String getSender_id() { return sender_id;}

    public void setSender_id(String sender_id) {this.sender_id = sender_id;}

    public String getMessage_id() { return message_id;}

    public void setMessage_id(String message_id) {this.message_id = message_id;}

    public String getMessage_type() {
        return message_type;
    }

    public void setMessage_type(String message_type) {
        this.message_type = message_type;
    }


//    public String getChat_id() {return chat_id; }
//
//    public void setChat_id(String chat_id) {this.chat_id = chat_id;}
}
