import React from 'react';
import './friendTile.css';

export default function FriendTile(props) {
    return (
        

        <div className ={`tile-container ${props.focus ? "current": ""}`} 
                        onClick={()=>props.click(props.chat_id)}>
                            
            <div className="text-box">
                <div className="username"><span className={`dot ${props.unread ? 'notification-unread':''}`}/># {props.chat_name}</div>
                
            </div>
        </div>
    );
}