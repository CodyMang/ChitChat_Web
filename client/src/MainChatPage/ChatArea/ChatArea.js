import React from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import MessageTile from './MessageTile/MessageTile.js'
import SockJsClient from 'react-stomp';
import "./ChatArea.css";
import SideBar from "../SideBar/SideBar.js";

class ChatArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            user_id: this.props.user_id,
            chat_id: this.props.chat_id,
            sendBoxContent: '',
            messages: [],
            activeUsers: []
        };
        this.keyPressed = this.keyPressed.bind(this);
        this.sendMessageClient = this.sendMessageClient.bind(this);
        this.sendJoin = this.sendJoin.bind(this);
        this.shandleMessageUpdate = this.handleMessageUpdate.bind(this);
    }

    onMessageRecieve(msg) {
        console.log(msg)
        if (msg) {
            if (msg.type === "CHAT") {
                let newMessage = {
                    "username": msg.sender,
                    "content": msg.content
                };
                this.setState({
                    messages: [...this.state.messages, newMessage],
                });
            }
            else if (msg.type === "JOIN") {

                this.setState({
                    activeUsers: msg.users,
                });
                // }
                // else
                // {
                // this.setState({
                //   activeUsers: [...this.state.activeUsers, msg.sender],
                // });
                // }
            }
            else if (msg.type === "LEAVE") {
                var array = [...this.state.activeUsers]; // make a separate copy of the array
                var index = array.indexOf(msg.sender)
                if (index !== -1) {
                    this.setState({ activeUsers: array.splice(index, 1) });
                }
            }
            else if (msg.type === 'UPDATE') {
                this.getChatMessages();
                if (msg.message_id !== null) {
                    if (document.getElementById(msg.message_id) !== null)
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
            'chat_id': this.props.chat_id
        };
        console.log(messageHeaders);
        console.log("Current props Chat id: " + this.props.chat_id)
        this.clientRef.sendMessage(`/app/chat.sendMessage/${this.props.chat_id}`, JSON.stringify(messageHeaders));
        this.setState({ sendBoxContent: '' });
    }

    sendJoin() {
        this.clientRef.sendMessage(`/app/chat.addUser/${this.props.chat_id}`,
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
        this.clientRef.sendMessage(`/app/chat.update/${this.props.chat_id}`,
            JSON.stringify({
                sender: this.state.username,
                type: 'UPDATE',
                message_id: msg_id,
                content: con
            })
        )
    }


    // const messages = useFetch(`http://localhost:8080/api/chats/${this.props.chat_id}`),{
    //   onNewData : 
    // }

    async getChatMessages() {
        const response = await fetch('http://localhost:8080/api/chats/' + this.props.chat_id);
        const data = await response.json();
        this.setState({ messages: data });
    }

    componentDidMount() {
        this.getChatMessages();
        this.scrollToBottom();

    }



    componentDidUpdate(prevProps, prevState) {
        if (prevProps.chat_id !== this.props.chat_id) {
            this.getChatMessages();
            this.scrollToBottom();
        }
        else {
            this.scrollToBottom();
        }
    }


    render() {

        return (
            <div className="chatarea-wrapper">
                <div className="chatarea-container" >
                    <div className="chatarea-header-container">
                        <span>{this.props.chat_name}</span>
                    </div>
                    <SideBar />
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
                        topics={[`/channel/${this.props.chat_id}`]}
                        onMessage={(msg) => { this.onMessageRecieve(msg) }}
                        ref={(client) => { this.clientRef = client }}
                        onConnect={this.sendJoin}
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

/*

*/