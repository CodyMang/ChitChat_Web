import {useState, useEffect} from 'react'

import ChatsTab from "../../../Components/ChatsTab/ChatsTab.js";
import FriendsTab from "../../../Components/FriendsTab/FriendsTab.js";

import ChatIcon from '@material-ui/icons/Chat';
import PersonIcon from '@material-ui/icons/Person';
import AddFriendDialog from './AddFriendDialog/AddFriendDialog.js'
import "./SideBar.css";

export default function SideBar(props) {
    // True: Chats tab
    // False: Friends tab
    const [tab, setTab] = useState(true);
    const [addDialogOpen, setAddOpen]= useState(false);

    const onRejectFriend = async(reject_id) =>
    {
        console.log("we tried");
        const response = await fetch("http://localhost:8080/api/rejectFriend", {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id:reject_id,
            })
        });
        const status = await response.status;
        if (status === 200) {     
            props.deleteFriend(reject_id);
        }
        else {
            alert("could not decline");
        }
    }
    const onAcceptFriend = async(accept_id) =>
    {
        console.log("we accept your ",accept_id);
        const response = await fetch("http://localhost:8080/api/confirmFriend", {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: accept_id,
            })
        });
        const status = await response.status;
        if (status === 200) {     
            props.acceptFriend(accept_id);
        }
        else {
            alert("could not decline");
        }
    }

    useEffect(() => {
        if(tab)
            console.log("Switched to Chats tab");
        else
            console.log("Switched to Friends tab");
    }, [tab])
    return (
        <div className="sidebar-container">
            <div className="tabs-container">
                <button className={`tabs-button left ${tab ? "selected": ""}`} onClick={() => setTab(true)}>
                    <ChatIcon/>
                </button>
                <button className={`tabs-button right ${!tab ? "selected": ""}`} onClick={() => setTab(false)}>
                    <PersonIcon/>
                </button>
            </div>
            {tab
                ? <ChatsTab
                    conversations = {props.converstations}
                    click = {props.updateCurrentChat}
                    currentChat = {props.currentChat}
                    unreadChats = {props.unreadChats}
                    user_id={props.user_id}
                    onNewChat={props.onNewChat}
                    chatInvites = {props.chatInvites}
                    declineChat = {props.declineChat}/>
                    
                : <FriendsTab
                    pendingFriends= {props.friendList[1]}
                    friendList = {props.friendList[0]}
                    currentChat = {props.currentChat}
                    click = {props.updateCurrentChat}
                    addFriendClick = {()=>setAddOpen}
                    onAcceptFriend = {onAcceptFriend}
                    onRejectFriend = {onRejectFriend}
                    unreadChats= {props.unreadChats}
                    />
            }
            <AddFriendDialog open = {addDialogOpen}
            sendRequest = {props.sendFriendRequest}
            handleClose ={()=>setAddOpen(false)} 
            user_id={props.user_id}
            />
        </div>
    );
}