package com.example.ChitChat_test_server;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ChitChat_test_server.databaseConnection.DatabaseConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("api")
class MainController {

    @Autowired
    private DBFileStorageService dbFileStorageService;

    @CrossOrigin
    @GetMapping("/chats/{chat_id}")
    String chatRequests(@PathVariable String chat_id) {
        return DatabaseConnector.getMessagesFromChat(chat_id);
    }

    @CrossOrigin
    @GetMapping("/chats/users/{chat_id}")
    String userRequestFromChat(@PathVariable String chat_id) {
        return DatabaseConnector.getUsersFromChat(chat_id);
    }

    @CrossOrigin
    @GetMapping("/conv/{user_id}")
    String convRequestByUser(@PathVariable String user_id) {
        return DatabaseConnector.getChatsByUser(user_id);
    }


    @CrossOrigin
    @PostMapping("/login")
    ResponseEntity<String> loginUser(@RequestBody Map<String,String> allParams) {
        System.out.println("Logging in");
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

    @CrossOrigin
    @PostMapping("/createNewChat")
    ResponseEntity<String> createChat(@RequestBody Map<String,String> allParams) {
        System.out.println("Recieveing New chat Request");
        String res = DatabaseConnector.insertNewChat(allParams.get("chat_name"),
                allParams.get("user_id"));

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

    @CrossOrigin
    @PostMapping("/joinChatByUser")
    ResponseEntity<String> joinChatByUser(@RequestBody Map<String,String> allParams) {

        String res = DatabaseConnector.joinNewChat(allParams.get("chat_name"),
                allParams.get("user_id"));

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

    @CrossOrigin
    @PostMapping("/RequestReset")
    ResponseEntity<String> resetPassRequest(@RequestBody Map<String,String> allParams) {

        boolean res = DatabaseConnector.userEmailExist(allParams.get("username"),
                allParams.get("email"));

        if(res)
        {
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }

    }


    @CrossOrigin
    @PostMapping("/PassReset")
    ResponseEntity<String> resetPass(@RequestBody Map<String,String> allParams) {

        String res = DatabaseConnector.insertNewPassword(allParams.get("username"),allParams.get("pass"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }

    }

    @CrossOrigin
    @DeleteMapping("/deleteMessage")
    ResponseEntity<String> deleteMessage(@RequestBody Map<String,String> allParams) {

        String res = DatabaseConnector.deleteMessageByid(allParams.get("message_id"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }

    }

    @CrossOrigin
    @PostMapping("/updateMessage")
    ResponseEntity<String> updateMessage(@RequestBody Map<String,String> allParams) {
        System.out.println("UPDATING");
        String res = DatabaseConnector.updateMessageByid(allParams.get("message_id"),allParams.get("content"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }
    }

    @CrossOrigin
    @GetMapping("/getFriends/{user_id}")
    String getFriends(@PathVariable String user_id) {
        
        return DatabaseConnector.getFriends(user_id);
        
    }

    @CrossOrigin
    @PostMapping("/addFriend")
    ResponseEntity<String> addFriend(@RequestBody Map<String,String> allParams) {
        System.out.println("ADD FRIEND");
        String res = DatabaseConnector.addFriend(allParams.get("sender"),allParams.get("newFriend"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }
    }

    @CrossOrigin
    @PostMapping("/confirmFriend")
    ResponseEntity<String> confirmFriend(@RequestBody Map<String,String> allParams) {
        String res = DatabaseConnector.confirmFriend(allParams.get("chat_id"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);//Nothing is returned
        }
    }

    @CrossOrigin
    @PostMapping("/rejectFriend")
    ResponseEntity<String> rejectFriend(@RequestBody Map<String,String> allParams) {
        System.out.println("ADD FRIEND");
        String res = DatabaseConnector.rejectFriend(allParams.get("chat_id"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }
    }


    @CrossOrigin
    @PostMapping("/updateUsername")
    ResponseEntity<String> updateUsername(@RequestBody Map<String,String> allParams) {
        System.out.println("update name");
        String res = DatabaseConnector.updateUsername(allParams.get("user_id"),allParams.get("username"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }
    }

    @CrossOrigin
    @PostMapping("/goOnline")
    ResponseEntity<String> goOnline(@RequestBody Map<String,String> allParams) {
        System.out.println("Storing active");
        String res = DatabaseConnector.goOnline(allParams.get("user_id"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }
    }
    @CrossOrigin
    @PostMapping("/goOffline")
    ResponseEntity<String> goOffline(@RequestBody Map<String,String> allParams) {
        System.out.println("Storing not active");
        String res = DatabaseConnector.logoutUser(allParams.get("user_id"));

        if(res.equals("200"))
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);//Nothing is returned
        }
    }



    @CrossOrigin
    @PostMapping("/uploadFile")
    public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("Recieved upload file request");
        DBFile dbFile = dbFileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/downloadFile/")
                .path(dbFile.getId())
                .toUriString();

        return new UploadFileResponse(dbFile.getFileName(), fileDownloadUri,
                file.getContentType(), file.getSize());
    }

    @CrossOrigin
    @GetMapping("/downloadFile/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
        // Load file from database
        System.out.println("Recieved file download request");
        DBFile dbFile = dbFileStorageService.getFile(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(dbFile.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dbFile.getFileName() + "\"")
                .body(new ByteArrayResource(dbFile.getData()));
    }
}


