
import React from 'react';
import './friendBar.css';

import FriendTile from './FriendTile/FriendTile';


class Sidebar extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            conversations:props.conversations,
            user_id:props.user_id
        };

    }

    

    render(){
    return (
        <div className="sidebar-container">
            <div className="FriendHeader">
               Conversations
            </div>
            
            {this.state.conversations.friendList.map(obj => (<FriendTile username={obj.username} status={obj.status}/>))}
        </div>
    );
    }
}


export default Sidebar;