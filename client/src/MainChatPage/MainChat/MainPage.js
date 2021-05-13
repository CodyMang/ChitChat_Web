import React from "react";
import './MainPage.css';
import Navbar from  "../navbar/navbar";
import FriendBar from "../FriendBar/FriendBar.js"
import ChatArea from "../ChatArea/ChatArea"


class MainPage extends React.Component {

  constructor(props)
  {
    super(props);
    console.log(props.userinfo);
    this.state = {
      user_id: props.userinfo.user_id,
      username: props.userinfo.username,
      chat_id: props.userinfo.chat_id,
      conversations:[],
      unreadChats:[],
    }
    this.chatAreaRef = React.createRef();
  }


  setUserName = (data) =>
  {
    console.log("changing name")
    this.setState({username:data})
  }

  render() {
    return (
      <div className="main-container">
          <Navbar user_id ={this.state.user_id} 
          username={this.state.username} 
          setUserName = {this.setUserName}
          chatAreaRef = {this.chatAreaRef}/>

          <ChatArea 
          ref = {this.chatAreaRef}
          user_id = {this.state.user_id} 
          username = {this.state.username}
          chat_id={this.state.chat_id}
          />
      </div>
    );
  }
}

export default MainPage;
