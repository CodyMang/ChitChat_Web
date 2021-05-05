import React from "react";
import './MainPage.css';
import Navbar from "../navbar/navbar";
import FriendBar from "../FriendBar/FriendBar.js";
import ChatArea from "../ChatArea/ChatArea";



class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: this.props.userinfo.user_id,
            username: this.props.userinfo.username,
            chat_id: 0,
            conversations: [],
        }
    }

    fetchChatList = async () => {
        const response = await fetch('http://localhost:8080/api/conv/' + this.state.user_id);
        const data = await response.json();
        this.updateConversations(data);
    }
    updateConversations(data) {
        this.setState({ conversations: data })
    }

    updateChat = (data) => {
        console.log("updated to: " + data);
        this.setState({ chat_id: data });
    }

    async componentDidMount() {
        this.fetchChatList();
    }

    render() {
        return (
            <div className="main-container">
                <Navbar username={this.state.username} />
                
                <ChatArea user_id={this.state.user_id}
                    username={this.state.username}
                    chat_id={this.state.chat_id}
                    chat_name="Doggy Skwod"
                    />
            </div>
        );
    }
}

export default MainPage;

/*
<FriendBar conversations={this.state.conversations}
                    chat_id={this.state.chat_id}
                    user_id={this.state.user_id}
                    click={this.updateChat}
                    onNewChat={this.fetchChatList} />
*/