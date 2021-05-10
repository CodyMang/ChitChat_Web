import {useState, useEffect} from 'react'

import ChatsTab from "../../../Components/ChatsTab/ChatsTab.js";
import FriendsTab from "../../../Components/FriendsTab/FriendsTab.js";

import ChatIcon from '@material-ui/icons/Chat';
import PersonIcon from '@material-ui/icons/Person';

import "./SideBar.css";

export default function SideBar(props) {
    // True: Chats tab
    // False: Friends tab
    const [tab, setTab] = useState(true);

    useEffect(() => {
        if(tab)
            console.log("Switched to Chats tab");
        else
            console.log("Switched to Friends tab");
    }, [tab])

    console.log(props.friendList);
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
                    currentChat = {props.currentChat}/>
                : <FriendsTab
                    friendList = {props.friendList[0]}
                    pendingFriends= {props.friendList[1]}
                    click = {props.updateCurrentChat}
                    deleteChat = {props.deleteChat}
                    />
            }
        </div>
    );
}