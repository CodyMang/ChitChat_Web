DROP DATABASE IF EXISTS ChitChat_DB;
CREATE DATABASE ChitChat_DB;
USE ChitChat_DB;


CREATE TABLE users (
  user_id int NOT NULL auto_increment,
  username VARCHAR(60) NOT NULL UNIQUE,
  pass VARCHAR(20) NULL,
  email VARCHAR(60) NULL UNIQUE ,
  first_name VARCHAR(40) NULL,
  last_name VARCHAR(40) NULL,
  is_active boolean DEFAULT false,
  PRIMARY KEY(user_id)
);


CREATE TABLE chats (
  chat_id bigint unsigned auto_increment,
  chat_name varchar(20) NOT NULL UNIQUE,
  size int unsigned not NULL, -- number of users in chat
  PRIMARY KEY(chat_id)
);


CREATE TABLE group_users (
  chat_id bigint unsigned,
  user_id int,
  PRIMARY KEY (chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE friends (
	chat_id bigint unsigned PRIMARY KEY,
    user_id1 int not NULL,
    user_id2 int not NULL,
    confirmed boolean DEFAULT false,
    foreign key (chat_id) REFERENCES chats(chat_id),
	FOREIGN KEY (user_id1) REFERENCES users(user_id),
    FOREIGN KEY (user_id2) REFERENCES users(user_id)
);


CREATE TABLE message (
  message_id bigint unsigned auto_increment PRIMARY KEY,
  user_id int,
  chat_id bigint unsigned,
  content TEXT,
  message_type varchar(16) DEFAULT "text",
  time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats (chat_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)    
);  


CREATE TABLE files(
	id int PRIMARY KEY,
	message_id bigint unsigned not null,
	file_name Varchar(100) not null,
    file_type varchar(15) not null,
    data blob not null,
    FOREIGN KEY (message_id) REFERENCES message(message_id)
);


CREATE TABLE notifications (
  notification_id int Primary KEY,
  notification_type VARCHAR(10),
  notification_reciever int,
  notification_sender int,
  time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_sender) REFERENCES users (user_id),
  FOREIGN KEY (notification_reciever) REFERENCES users (user_id)    
);  

delimiter $$
CREATE TRIGGER create_chat BEFORE INSERT ON friends
FOR EACH ROW
       BEGIN
           insert into chats set size = 2, chat_name = SUBSTRING(MD5(RAND()) FROM 1 FOR 20);
                   SET NEW.chat_id = (SELECT MAX(chat_id) from chats);
       END;$$
delimiter ;


delimiter $$
CREATE TRIGGER delete_chat_after_friends AFTER DELETE ON friends
FOR EACH ROW
       BEGIN
           DELETE FROM chats WHERE chat_id = old.chat_id;
           DELETE FROM message WHERE chat_id = old.chat_id;
       END;$$
delimiter ;


