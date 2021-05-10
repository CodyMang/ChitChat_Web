import React from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import MessageTile from './MessageTile/MessageTile.js'
import SockJsClient from 'react-stomp';
import SideBar from './SideBar/SideBar';
import "./ChatArea.css";


const GET_FRIENDS_API = 'http://localhost:8080/api/getFriends/';
class ChatArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      user_id: props.user_id,
      chat_id: props.chat_id,
      sendBoxContent: '',
      messages: [],
      conversations:[],
      topics : [],
      activeUsers:[],
      unreadChats:[],
      friendList:[[],[]],
    };
    console.log(`Chat_id on intialization: ${props.chat_id}`);
    this.keyPressed = this.keyPressed.bind(this);
    this.sendMessageClient = this.sendMessageClient.bind(this);
    this.sendJoin = this.sendJoin.bind(this);
    this.shandleMessageUpdate = this.handleMessageUpdate.bind(this);
  }
  
  async fetchFriendList()
  {
    const response = await fetch(GET_FRIENDS_API+this.state.user_id);
    const data = await response.json();
    this.setState({friendList:data});
  }

  onMessageRecieve(msg) {
    console.log(msg)
    if (msg) {
      if (msg.type === "CHAT") {
        console.log(this.state.chat_id);
        if(msg.chat_id === this.state.chat_id)
        {
          let newMessage = {
            "username": msg.sender,
            "content": msg.content
          };
          
          this.setState({
            messages: [...this.state.messages, newMessage],
          });
        }
        else //user is not currently looking at a chat
        {
          this.props.addUnread(msg.chat_id);
        }
      }
      else if (msg.type === "JOIN") {
          this.setState({
            activeUsers:msg.users,
          });
      }
      else if (msg.type === "LEAVE") {
        var array = [...this.state.activeUsers]; // make a separate copy of the array
        var index = array.indexOf(msg.sender)
        if (index !== -1) {
          this.setState({activeUsers: array.splice(index, 1)});
        }
      }
      else if (msg.type === 'UPDATE') {
        this.getChatMessages();
        if (msg.message_id !== null) {
          if(document.getElementById(msg.message_id) !== null)
          document.getElementById(msg.message_id).innerHTML = msg.content;
        }
      }
    }
  }

  sendMessageClient() {
    let messageHeaders = {
      "sender": this.state.username,
      "content": this.state.sendBoxContent,
      'type': 'CHAT',
      "sender_id": this.state.user_id,
      'chat_id': this.state.chat_id
    };
    this.clientRef.sendMessage(`/app/chat.sendMessage/${this.state.chat_id}`, JSON.stringify(messageHeaders));
    this.setState({ sendBoxContent: '' });
  }

  sendJoin() {
    this.clientRef.sendMessage(`/app/chat.addUser/${this.state.chat_id}`,
      JSON.stringify({ sender: this.state.username, type: 'JOIN' })
    )
  }

  keyPressed(evnt) {
    if (evnt.charCode === 13) {
      this.sendMessageClient();
    }
  }

  handleChange(event) {
    this.setState({ sendBoxContent: event.target.value })
  }

  
  handleMessageUpdate = (msg_id, con) => {
    console.log(msg_id);
    console.log(con);
    this.clientRef.sendMessage(`/app/chat.update/${this.state.chat_id}`,
      JSON.stringify({
        sender: this.state.username,
        type: 'UPDATE',
        message_id: msg_id,
        content: con
      })
    )
  }

  
  deleteFriend(data)
  {
    this.setState({friendList: this.state.friendList[1].filter(id => id !== data)});
  }

  addUnreadChat = (unread_chat) =>
  {
    this.setState({
      unreadChats: [...this.state.unreadChats,unread_chat],
    });
  }
  updateChat = (data) =>
  {
    console.log("updated to: " + data);
    this.setState({chat_id:data,
                  unreadChats: this.state.unreadChats.filter(id => id !== data)});
  }

  setTopics()
  {
    console.log(this.state.conversations);
    this.setState(
      {topics:this.state.conversations.map((elem) => (`/channel/${elem.chat_id}`))});
  }
  fetchChatList = async () =>
  {
    const response = await fetch('http://localhost:8080/api/conv/'+ this.state.user_id);
    const data = await response.json();
    console.log(data);
    this.updateConversations(data);
  }

  updateConversations(data)
  {
    this.setState({conversations:data})
  }

  async getChatMessages() {
    const response = await fetch('http://localhost:8080/api/chats/' + this.state.chat_id);
    const data = await response.json();
    this.setState({ messages: data });
  }

  componentDidMount() {
    this.fetchChatList();
    this.fetchFriendList();
    this.getChatMessages();
    this.scrollToBottom();
  }



  componentDidUpdate(prevProps, prevState) {
    if(prevState.chat_id !== this.state.chat_id)
    {
      this.getChatMessages();
    }
    if(prevState.conversations !== this.state.conversations)
    {
      this.setTopics();
    }
    else {
      this.scrollToBottom();
    }
  }

  getChatName = (data) =>
  {
    const value = this.state.conversations.find(({chat_id}) => chat_id === data);
    if(value)
      return value.chat_name;
    else
      return '';
  }
  render() {

    return (
        <div className="chatarea-wrapper">
            <div className="chatarea-container" >
                <div className="chatarea-header-container">
                    <span>{this.getChatName(this.state.chat_id)}</span>
                </div>
                <SideBar
                converstations ={this.state.conversations}
                currentChat = {this.state.chat_id}
                updateCurrentChat={this.updateChat}
                friendList = {this.state.friendList}
                deleteChat = {this.deleteChat}
                />
                <div className="message-container-unit">
                    {
                        this.state.messages.map(obj => (<MessageTile username={obj.username}
                            message_id={obj.message_id}
                            content={obj.content}
                            key={obj.message_id}
                            id={obj.message_id}
                            updateChat={(msg, con) => this.handleMessageUpdate(msg, con)} />))
                    }
                    <div ref={(el) => { this.messagesEnd = el; }} />
                </div>
                <div className='current-userlist'>
                    <div className="active-user-list-header">
                        <span>Members</span>
                    </div>

                    <div className="active-user-container">

                    {
                        /*
                        this.state.activeUsers.map((elem) => (
                            <div className="active-user-item">{elem}</div>
                        ))*/
                    }

                    </div>
                </div>
                <div className="send-container">
                    <div className="text-box">
                        <input
                            type="text"
                            className="compose-input"
                            placeholder="Type a message..."
                            value={this.state.sendBoxContent}
                            onChange={this.handleChange.bind(this)}
                            onKeyPress={this.keyPressed}
                        />
                    </div>
                    <div className="sendButtons">
                        <AttachFileIcon className="attach" />
                        <SendIcon className="send" />
                    </div>
                </div>
                <SockJsClient url='http://localhost:8080/ws'
                    topics={this.state.topics}
                    onMessage={(msg) => { this.onMessageRecieve(msg) }}
                    ref={(client) => { this.clientRef = client }}
                    onConnect={this.sendJoin}
                />
            </div>
        </div>
    );
}
  // render() {

  //   return (
  //     <div className="chatarea-container" >
  //       <div className="message-container-unit">
  //         {
  //           this.state.messages.map(obj => (<MessageTile username={obj.username}
  //             message_id={obj.message_id}
  //             content={obj.content}
  //             key={obj.message_id}
  //             id={obj.message_id}
  //             updateChat={(msg, con) => this.handleMessageUpdate(msg, con)} />))
  //         }
  //         <div ref={(el) => { this.messagesEnd = el; }} />
  //       </div>
  //       <div className='current-userlist'>
  //         <div className="active-user-list-header">
  //           <span>Active Users</span>
  //         </div>
          
  //         <div className="active-user-container">

  //         {this.state.activeUsers.map((elem) =>(
  //         <div>
  //               <div className="active-username">{elem}</div>
  //           </div>))}

  //         </div>
  //       </div>
  //       <div className="send-container">
  //         <div className="text-box">
  //           <input
  //             type="text"
  //             className="compose-input"
  //             placeholder="Type a message..."
  //             value={this.state.sendBoxContent}
  //             onChange={this.handleChange.bind(this)}
  //             onKeyPress={this.keyPressed}
  //           />
  //         </div>
  //         <div className="sendButtons">
  //           <AttachFileIcon className="attach" />
  //           <SendIcon className="send" />
  //         </div>
  //       </div>
  //       <SockJsClient url='http://localhost:8080/ws'
  //         topics={this.state.topics}
  //         onMessage={(msg) => { this.onMessageRecieve(msg) }}
  //         ref={(client) => { this.clientRef = client }}
  //         onConnect={this.sendJoin}
  //       />
  //     </div>
  //   );
  // }


  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
}

export default ChatArea;
