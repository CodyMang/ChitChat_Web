package com.example.ChitChat_test_server;

import com.example.ChitChat_test_server.databaseConnection.NewUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ChitChat_test_server.databaseConnection.DatabaseConnector;
import org.springframework.web.client.HttpServerErrorException;

import java.util.Map;

@RestController
@RequestMapping("api")
class MainController {
    @CrossOrigin
    @GetMapping("/chats/{chat_id}")
    String chatRequests(@PathVariable String chat_id) {
        return DatabaseConnector.getMessagesFromChat(chat_id);
    }

    @CrossOrigin
    @GetMapping("/conv/{user_id}")
    String convRequestByUser(@PathVariable String user_id) {
        return DatabaseConnector.getChatsbyUser(user_id);
    }


    @CrossOrigin
    @PostMapping("/login")
    ResponseEntity<String> loginUser(@RequestBody Map<String,String> allParams) {
        String res = DatabaseConnector.getUserInfoByPass(allParams.get("username"),allParams.get("pass"));
        if(!res.equals("404"))
        {
            System.out.println(res);
            return new ResponseEntity<>(res,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }


    @CrossOrigin
    @PostMapping("/registerNewUser")
    ResponseEntity<String> registerUser(@RequestBody Map<String,String> allParams) {
        String res = DatabaseConnector.insertNewUser(allParams.get("username"),
                                                        allParams.get("pass"),
                                                        allParams.get("email"),
                                                        allParams.get("first_name"),
                                                        allParams.get("last_name"));

        if(res.equals("409"))
        {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        else if(res.equals("204"))
        {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);//Nothing is returned
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


}
//
//
//@ResponseStatus(value = HttpStatus.CONFLICT)
//class DuplicateError extends RuntimeException {
//    public DuplicateError(String message)
//    {
//        super(message);
//    }
//}


