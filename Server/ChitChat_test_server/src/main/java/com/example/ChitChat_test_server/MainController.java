package com.example.ChitChat_test_server;

import org.springframework.web.bind.annotation.*;
import com.example.ChitChat_test_server.databaseConnection.DatabaseConnector;

@RestController
@RequestMapping("api")
class MainController {
    @CrossOrigin
    @GetMapping("/chats/{chat_id}")
    String hello(@PathVariable String chat_id) {
        System.out.println("Chats Requested" + chat_id);
        return DatabaseConnector.getMessagesFromChat(chat_id);
    }
}


