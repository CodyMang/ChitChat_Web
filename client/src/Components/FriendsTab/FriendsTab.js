import {useState, useEffect} from 'react'
import AddIcon from '@material-ui/icons/Add';

import FriendTile from "./FriendTile/FriendTile.js";
import PendingTile from "./PendingTile/PendingTile.js";
import "./FriendsTab.css";

function selectUser(username) {
    console.log("Selected: " + username);
}


export default function FriendsTab(props) {

    console.log(props.friendList);
    console.log(props.pendingFriends);
    return (
        <div className="friends-tab-container">
            <button className="add-friend-button">
                <AddIcon></AddIcon>
                Add a friend
            </button>

            {
            props.pendingFriends.map(obj => (
            <PendingTile
                username={obj.username}
                chat_id ={obj.chat_id}
                deleteChat = {props.deleteChat}
            />))
            }
            {props.friendList.map(obj => (<FriendTile 
                username={obj.username}
                chat_id ={obj.chat_id}
                status={true}
                click={props.click}
                focus={obj.chat_id === props.currentChat}
            />))
            }

        </div>
    );
}