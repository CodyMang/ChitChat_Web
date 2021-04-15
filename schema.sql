
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

CREATE TABLE message (
  message_id bigint unsigned auto_increment PRIMARY KEY,
  user_id int, -- who sent the message
  chat_id bigint unsigned,
  content TEXT,
  time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats (chat_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)    
);  



SELECT * FROM users;
select * from group_users;
select * from message;
select * from chats;
insert into chats set chat_name = "A group of friends", size= 1;
insert into message set chat_id = 6, user_id=8, content="what is up dawg";
insert into group_users set chat_id = 5, user_id = 7;

SELECT C.chat_name, C.chat_id
FROM group_users as GU, chats as C
WHERE GU.chat_id = C.Chat_id and GU.user_id = 7
group by C.chat_name;
insert into group_users set chat_id = (
SELECT chat_id
FROM chats
WHERE chat_name = "First Chat"), user_id = 7;
insert into message set chat_id = , user_id=16;

SELECT U.username, M.content 
                    FROM message AS M, users as U 
                    WHERE U.user_id = M.user_id AND chat_id = 5
                    ORDER BY M.time_stamp;
SELECT C.chat_name, C.chat_id 
                    FROM group_users as GU, chats as C 
                    WHERE GU.chat_id = C.Chat_id and GU.user_id = 16
                    group by C.chat_name;
SELECT user_id,username FROM users WHERE username="c" and pass ="c";