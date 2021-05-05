import {useState, useEffect} from 'react'
import AddIcon from '@material-ui/icons/Add';

import FriendTile from "./FriendTile/FriendTile.js";
import "./FriendsTab.css";

function selectUser(username) {
    console.log("Selected: " + username);
}

function addFriend(username) {
    console.log("Adding friend");
}

export default function FriendsTab(props) {
    return (
        <div className="friends-tab-container">
            <button className="add-friend-button" onClick={() => addFriend("")}>
                <AddIcon></AddIcon>
                Add a friend
            </button>
            <FriendTile 
                profile=""
                username="bchau1000" 
                status={true}
                onClick={selectUser}
            />
            <FriendTile 
                profile="" 
                username="bchau1000" 
                status={true}
                onClick={selectUser}
            />
            <FriendTile 
                profile="" 
                username="bchau1000" 
                status={true}
                onClick={selectUser}
            />
        </div>
    );
}