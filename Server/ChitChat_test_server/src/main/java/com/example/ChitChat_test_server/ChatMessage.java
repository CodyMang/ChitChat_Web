package com.example.ChitChat_test_server;

public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String chat_id;
    private String sender_id;
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
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

    public String getSender_id() { return sender_id;}

    public void setSender_id(String sender_id) {this.sender_id = sender_id;}

//    public String getChat_id() {return chat_id; }
//
//    public void setChat_id(String chat_id) {this.chat_id = chat_id;}
}
