package com.example.ChitChat_test_server;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import com.example.ChitChat_test_server.databaseConnection.DatabaseConnector;

@Controller
public class ChatController {


    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chat.sendMessage/{chat_id}")
    //@SendTo("/topic/public/{chat_id}")
    public void sendMessage(@Payload ChatMessage chatMessage, @DestinationVariable String chat_id) {
        System.out.println("Message recieved at " + chat_id);
        DatabaseConnector.storeMessage(chatMessage.getContent(),chatMessage.getSender_id(),chat_id);
        messagingTemplate.convertAndSend("/channel/"+chat_id, chatMessage);
        //return chatMessage;
    }

    @MessageMapping("/chat.addUser/{chat_id}")
    //@SendTo("/topic/public/{chat_id}")
    public void addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor,
                               @DestinationVariable String chat_id) {

        String currentRoomId = (String) headerAccessor.getSessionAttributes().put("chat_id",chat_id);
        if (currentRoomId != null) {
            ChatMessage leaveMessage = new ChatMessage();
            leaveMessage.setType(ChatMessage.MessageType.LEAVE);
            leaveMessage.setSender(chatMessage.getSender());
            messagingTemplate.convertAndSend("/channel/"+currentRoomId, leaveMessage);
        }
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        messagingTemplate.convertAndSend("/channel/" + chat_id, chatMessage);
        //return chatMessage;
    }

}
