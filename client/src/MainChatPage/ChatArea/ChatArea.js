import React from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import MessageTile from './MessageTile/MessageTile.js'
import SockJsClient from 'react-stomp';
import SideBar from './SideBar/SideBar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MemberTile from './MemberTile/MemberTile.js'
import AddFriendToChat from './AddFriendToChat/AddFriendToChat.js'
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
      addFriendToChatDialog:false,
      messages: [],
      conversations:[],
      topics : [],
      unreadChats:[],
      friendList:[[],[]],
      members:[],
      chatInvites:[],
      selectedFileNull:true,
      selectedFile:null,
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
          this.addUnreadChat(msg.chat_id);
        } 
      }
      else if (msg.type === "JOIN") {
        let current =[...this.state.members] ;
        let idx = current.map((elem)=> { return elem.username; }).indexOf(msg.sender);
        if(idx !== -1)
        {
          current[idx].is_active = "1";
          this.setState({members:current})
        }     
      }
      else if (msg.type === "LEAVE") {
        let current =[...this.state.members] ;
        let idx = current.map((elem)=> { return elem.username; }).indexOf(msg.sender);
        if(idx !== -1)
        {
          current[idx].is_active = "0";
          this.setState({members:current})
        }
      }
      else if (msg.type === 'UPDATE') {
        this.getChatMessages();
        if (msg.message_id !== null) {
          if(document.getElementById(msg.message_id) !== null)
          document.getElementById(msg.message_id).innerHTML = msg.content;
        }
      }
      else if (msg.type === 'CHAT_INVITE') {

        const result = [...this.state.chatInvites, msg.chat_name]
        this.setState({chatInvites:result})
      }
      else if (msg.type === 'FRIEND_REQUEST') { 
          this.fetchFriendList();
      }
      else if (msg.type === 'RELOAD') {
          this.fetchChatList();
          this.fetchFriendList();
          this.getChatMessages();
        
      }
    }
  }


  triggerReload = (chat_id)=>
  {
    
    this.clientRef.sendMessage(`/app/reload/${chat_id}`,
    JSON.stringify({
      sender: this.state.username,
      chat_name: this.state.chat_id,//chat_id is actually then chat_name
      type: 'RELOAD',
    })
  )
  }

  fileIsLoaded = () =>
  {
    if(this.state.selectedFileNull)
    {
      return 'text';
    }
    else
    {
      this.setState({selectedFileNull:true, selectedFile:null});
      return 'file';
    }
  }

  sendJoin = async()=> {

    this.clientRef.sendMessage(`/app/chat.addUser/${this.state.chat_id}`,
      JSON.stringify({ sender: this.state.username, type: 'JOIN' })
    )
    try{
        const response = await fetch("http://localhost:8080/api/goOnline", {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: this.state.user_id,
                  })
              });
            const status = await response.status;
              if (status === 200) {     
                this.componentDidMount();

              }
              else
              {
                  alert("ERROR occured is_active")
              }

    }
    catch (e)
    {
        console.error(e);
    }
    
  }


  sendMessageClient() {
    let messageHeaders = {
      "sender": this.state.username,
      "content": this.state.sendBoxContent,
      'type': 'CHAT',
      "sender_id": this.state.user_id,
      'chat_id': this.state.chat_id,
      'message_type':this.fileIsLoaded(),
    };
    console.log(this.clientRef);
    this.clientRef.sendMessage(`/app/chat.sendMessage/${this.state.chat_id}`, JSON.stringify(messageHeaders));
    this.setState({ sendBoxContent: '' });
  }



  keyPressed=(evnt)=> {
    if (evnt.charCode === 13) {
      this.sendMessageClient();
    }
  }

  handleChange=(event)=>  {
    this.setState({ sendBoxContent: event.target.value })
  }

  
  handleFriendRequest = (username) => {
    console.log("Sending Friend Request to ",username);
    this.clientRef.sendMessage(`/app/friendRequest/${username}`,
      JSON.stringify({
        sender: this.state.username,
        type: 'FRIEND_REQUEST',
      })
    )
  }

  handleMessageUpdate = (msg_id, con) => {
    this.clientRef.sendMessage(`/app/chat.update/${this.state.chat_id}`,
      JSON.stringify({
        sender: this.state.username,
        type: 'UPDATE',
        message_id: msg_id,
        content: con
      })
    )
  }


  addFriendToChat = (username) =>
  {
    const chat_name = this.getChatName(this.state.chat_id);
    this.clientRef.sendMessage(`/app/chatInvite/${username}`,
    JSON.stringify({
      sender: this.state.username,
      chat_name:chat_name,
      type: 'CHAT_INVITE',
    }));
    this.setState({addFriendToChatDialog:false});
    alert("Chat Invite Sent");
  }
  handleNameChange = (username2) =>
  {
    console.log(username2)
    this.clientRef.sendMessage(`/app/reload/`,
        JSON.stringify({
            sender: this.state.username,
            type: 'RELOAD',
        })
    )
    this.setState({username:username2});
  }

  acceptFriend = (accept_id) =>
  {
    console.log("accepting");
    let friends = this.state.friendList[0];
    let pending = this.state.friendList[1];
    let idx = pending.map((elem)=> { return elem.chat_id; }).indexOf(accept_id);
    if(idx !== -1)
    {
      const friendName = pending[idx].username;
      const newFriend = pending.splice(idx,1);
      const newList = [friends.concat(newFriend),pending];
      console.log(newList);
      this.setState({friendList:newList,
        topics:[...this.state.topics,`/channel/${accept_id}`]});
      this.handleFriendRequest(friendName);
    }
    else
    {
      console.error("Could not find friend in friend list")
    }
  }
  
  deleteFriend = (reject_id) =>
  {
    const newList = [this.state.friendList[0],this.state.friendList[1].filter(id => id.chat_id !== reject_id)];
    this.setState({friendList:newList});

  }

  declineChat = (data)=>
  {
    this.setState({chatInvites:this.state.chatInvites.filter(val=>val!==data)})
  }

  addUnreadChat = (unread_chat) =>
  {
    console.log(unread_chat);
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
    
    const convo = this.state.conversations.map((elem) => (`/channel/${elem.chat_id}`));
    const dm =  this.state.friendList[0].map((elem) => (`/channel/${elem.chat_id}`))
    this.setState(
      {topics:[...[`/friend/${this.state.username}`,'/channel/'].concat(convo.concat(dm))]});
    console.log(this.state.topics);
  }
  fetchChatList = async () =>
  {
    //Chat Messages
    const response = await fetch('http://localhost:8080/api/conv/'+ this.state.user_id);
    const data = await response.json();
    this.updateConversations(data);
    //Chat Users

  }

  uploadSingleFile = async(file)=>
  {
      let formData = new FormData();
      formData.append("file", file);

      let xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8080/api/uploadFile");
  
      xhr.onload = () => {
          
          let response = JSON.parse(xhr.responseText);
          if(xhr.status == 200) {
            alert("File Uploaded")
            this.setState({sendBoxContent:response.fileDownloadUri});
                      
          } 
          else {
              console.error("Some Error Occurred") ;
          }
      }
  
      xhr.send(formData);
  }
  onFileChange = (event) =>
  {
    this.setState({selectedFile:event.target.files[0],selectedFileNull:false});
    console.log(event.target.files[0]);
    this.uploadSingleFile(event.target.files[0]);
  }
  updateConversations(data)
  {
    this.setState({conversations:data})
  }

  async getChatMessages() {
    try{

    
    const response = await fetch('http://localhost:8080/api/chats/' + this.state.chat_id);
    const data = await response.json();

    const responseUsers = await fetch('http://localhost:8080/api/chats/users/'+ this.state.chat_id);
    const memberList = await responseUsers.json();
    this.setState({  messages: data,members: memberList  });
  }
  catch (e)
  {
    console.error(e);
  }
    
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
    if(prevState.conversations !== this.state.conversations || prevState.friendList !== this.state.friendList )
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
                <SideBar // Lord forgive me for this many props
                  converstations ={this.state.conversations}
                  currentChat = {this.state.chat_id}
                  updateCurrentChat={this.updateChat}
                  friendList = {this.state.friendList}
                  deleteChat = {this.deleteChat}
                  acceptFriend = {this.acceptFriend}
                  deleteFriend = {this.deleteFriend}
                  user_id={this.state.user_id}
                  onNewChat ={this.fetchChatList}
                  sendFriendRequest = {this.handleFriendRequest}
                  unreadChats = {this.state.unreadChats}
                  chatInvites = {this.state.chatInvites}
                  declineChat = {this.declineChat}
                  triggerReload = {this.triggerReload}
                />
                <div className="message-container-unit">
                    {
                        this.state.messages.map(obj => (<MessageTile username={obj.username}
                            message_id={obj.message_id}
                            content={obj.content}
                            key={obj.message_id}
                            id={obj.message_id}
                            message_type ={obj.message_type }
                            owner = {this.state.username === obj.username}
                            updateChat={(msg, con) => this.handleMessageUpdate(msg, con)} />))
                    }
                    <div ref={(el) => { this.messagesEnd = el; }} />
                </div>
                <div className='current-userlist'>
                    <div className="active-user-list-header">
                        <span>Members</span>
                        <PersonAddIcon 
                        className="personAddIcon"
                        onClick ={()=>this.setState({addFriendToChatDialog:true})}
                        style={{ fontSize: 32 }} />

                       
                    </div>

                    <div className="active-user-container">

                    {
                      this.state.members.map(obj => (<MemberTile username={obj.username}
                      is_active = {obj.is_active === "1"}
                     />))
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
                            onChange={this.handleChange}
                            onKeyPress={this.keyPressed}
                        />
                    </div>
                    <div className="sendButtons">
                    <input type="file" id="file-input" ref={ref => {this.fileRef = ref} } onChange={event=>this.onFileChange(event)} accept="application/pdf" />
                    <AttachFileIcon className="attach" 
                    onClick ={()=> this.fileRef.click()}/>
                        <SendIcon className="send" onClick={()=>this.sendMessageClient()}/> 
                        
                    </div>
                </div>
                <SockJsClient url='http://localhost:8080/ws'
                    topics={this.state.topics}
                    onMessage={(msg) => { this.onMessageRecieve(msg) }}
                    ref={(client) => { this.clientRef = client }}
                    onConnect={this.sendJoin}
                />
                 <AddFriendToChat 
                        open = {this.state.addFriendToChatDialog}
                        click = {this.addFriendToChat}
                
                        handleClose = {()=>this.setState({addFriendToChatDialog:false})}
                        />
            </div>
        </div>
    );
}

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
}

export default ChatArea;
