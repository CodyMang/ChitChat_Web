import React from 'react';
import './friendTile.css';

export default function FriendTile(props) {
    return (
        

        <div className ={props.focus ? "tile-container": "tile-container focused"} onClick={()=>props.click(props.chat_id)}>
            <div className="text-box">
                <div className="username">{props.chat_name}</div>
            </div>
        </div>
    );
}