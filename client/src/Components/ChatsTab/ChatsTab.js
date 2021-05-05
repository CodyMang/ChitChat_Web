import {useState, useEffect} from 'react'
import AddIcon from '@material-ui/icons/Add';
import ChatTile from './ChatTile/ChatTile.js';

import "./ChatsTab.css";

export default function ChatsTab(props) {

    return (
        <div className="chats-tab-container">
            <button className="join-create-button">
                <AddIcon></AddIcon>
                Join/Create
            </button>
            <ChatTile
                name="Doggy Skwod"
                message="Hello my fellow doggiesssss"
            />
        </div>
    );
}