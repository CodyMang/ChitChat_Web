import {useState, useEffect} from 'react'
import AddIcon from '@material-ui/icons/Add';
import ChatTile from './ChatTile/ChatTile.js';

import "./ChatsTab.css";

export default function ChatsTab(props) {

    
    return (
        <div className="chats-tab-container">
            <button className="join-create-button">
                <AddIcon/>
                Join/Create
            </button>
            {
            props.conversations.map(obj =>(<ChatTile
                key = {obj.chat_id}
                chat_id = {obj.chat_id}
                click={props.click}
                name={obj.chat_name}
                focus={obj.chat_id === props.currentChat}
            />))
            }
           
        </div>
    );
}