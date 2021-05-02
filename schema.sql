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
CREATE TABLE Friends (
	user_id1 int not NULL,
    user_id2 int not NULL,
	FOREIGN KEY (user_id1) REFERENCES users(user_id),
    FOREIGN KEY (user_id2) REFERENCES users(user_id)
);

CREATE TABLE Files(
	message_id int not null,
	file_name Varchar(100) not null,
    file_type varchar(15) not null,
    data blob not null,
    FOREIGN KEY (message_id) REFERENCES message(message_id)
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
