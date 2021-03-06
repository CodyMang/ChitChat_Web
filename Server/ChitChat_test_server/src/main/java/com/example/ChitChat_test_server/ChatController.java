package com.example.ChitChat_test_server;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import com.example.ChitChat_test_server.databaseConnection.DatabaseConnector;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import javax.xml.crypto.Data;


@Controller
public class ChatController {


    @Autowired
    private SimpMessageSendingOperations messagingTemplate;


    @MessageMapping("/chat.sendMessage/{chat_id}")
    public void sendMessage(@Payload ChatMessage chatMessage, @DestinationVariable String chat_id) {
        System.out.println("Message recieved at " + chat_id);
        DatabaseConnector.storeMessage(chatMessage.getContent(), chatMessage.getSender_id(), chat_id,chatMessage.getMessage_type());
        System.out.println("Sending message to " + chat_id);
        messagingTemplate.convertAndSend("/channel/" + chat_id, chatMessage);
    }

    @MessageMapping("/chat.addUser/{chat_id}")
    public void addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor,
                               @DestinationVariable String chat_id) {
        String currentRoomId = (String) headerAccessor.getSessionAttributes().put("chat_id",chat_id);
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        messagingTemplate.convertAndSend("/channel/", chatMessage);
    }

    @MessageMapping("/chat.update/{chat_id}")
    public void updateMessage(@Payload ChatMessage chatMessage, @DestinationVariable String chat_id) {
        messagingTemplate.convertAndSend("/channel/"+chat_id, chatMessage);
    }

    @MessageMapping("/friendRequest/{username}")
    public void reloadMessage(@Payload ChatMessage chatMessage, @DestinationVariable String username) {
        System.out.println("Sending Friend Request to "+ username + " from " + chatMessage.getSender());
        messagingTemplate.convertAndSend("/friend/"+username, chatMessage);
    }

    @MessageMapping("/chatInvite/{username}")
    public void chatInvite(@Payload ChatMessage chatMessage, @DestinationVariable String username) {
        System.out.println("Sending ChatInvite to "+ username + " for " +chatMessage.getChat_name() +" from " + chatMessage.getSender());
        messagingTemplate.convertAndSend("/friend/"+username, chatMessage);
    }

    @MessageMapping("/reload/{chat_name}")
    public void reloadChat(@Payload ChatMessage chatMessage, @DestinationVariable String chat_name) {
        String chat_id = DatabaseConnector.getChatIDByChatName(chat_name);
        messagingTemplate.convertAndSend("/channel/"+chat_id, chatMessage);
    }

    @MessageMapping("/reload/")
    public void reloadBroadcast(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSend("/channel/", chatMessage);
    }

    @MessageMapping("/nameChange")
    @SendTo("/channel/")
    public ChatMessage nameChange(@Payload ChatMessage chatMessage, @DestinationVariable String chat_id) {
        System.out.println("Changing Name " + chat_id);
        return chatMessage;
    }



}
