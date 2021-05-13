import {useState, useEffect} from 'react'
import AddIcon from '@material-ui/icons/Add';
import ChatTile from './ChatTile/ChatTile.js';
import CreateJoinDialog from './CreateJoinDialog/CreateJoinDialog.js'
import PendingTileChat from './PendingTile/PendingTileChat.js'
import "./ChatsTab.css";

export default function ChatsTab(props) {

    const [dialogOpen, setDialogOpen]= useState(false);

    
    const handleSubmitJoin = async (username) => {
        try {
            const response = await fetch("http://localhost:8080/api/joinChatByUser", {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_name:username,
                    user_id: props.user_id,
                })
            });
            const status = await response.status;
            if (status === 204) {     
                setDialogOpen(false);
                alert(`Joined New Chat "${username}"`);
                props.onNewChat();
            }
            else {
                alert("Chat room does not exist");
            }
        } catch (e) {
            console.error(e);
            alert("Error occured please try again");
        }
    }
    console.log(props.chatInvites)
    return (
        <div className="chats-tab-container">
            <button className="join-create-button"
            onClick = {()=>setDialogOpen(!dialogOpen)}>
                <AddIcon/>
                Join/Create
            </button>
            { 
                props.chatInvites.map(val=> (<PendingTileChat
                chat_name ={val}
                joinChat = {handleSubmitJoin}
                declineChat ={props.declineChat}
             />))
             }
            {
            props.conversations.map(obj =>(<ChatTile
                key = {obj.chat_id}
                chat_id = {obj.chat_id}
                click={props.click}
                name={obj.chat_name}
                unread={props.unreadChats.indexOf(obj.chat_id) !== -1}
                focus={obj.chat_id === props.currentChat}
            />))
            }
           <CreateJoinDialog 
           onNewChat ={props.onNewChat}
           open = {dialogOpen}
           handleClose ={()=>setDialogOpen(false)}
           user_id={props.user_id} />
            
        </div>
    );
}