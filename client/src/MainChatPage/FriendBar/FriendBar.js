
import React from 'react';
import './friendBar.css';
import Button from '@material-ui/core/Button';
import FriendTile from './FriendTile/FriendTile';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddRoundedIcon from '@material-ui/icons/AddRounded';
//import FormDialog from './Dialog/FormDialog'
import ForumIcon from '@material-ui/icons/Forum';

const CREATE_API_URL = "http://localhost:8080/api/createNewChat";
const JOIN_API_URL = "http://localhost:8080/api/joinChatByUser";
export default function Sidebar(props) {
    const [open, setOpen] = React.useState(false);
    const [joinOpen, setJoinOpen] = React.useState(false);
    const [joinChat, setJoinChat] = React.useState("");
    const [name, setName] = React.useState("");
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleJoinChat = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(JOIN_API_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_name: joinChat,
                    user_id: props.user_id
                })
            });
            const status = await response.status;
            if (status === 204) {
                alert(`Joined Chat ${joinChat}`);
                setJoinOpen(false);
                setName('');
                props.onNewChat();
            }
            else {
                alert("Failed to join chat");
            }
        } catch (e) {
            console.error(e)
        }
    }
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(CREATE_API_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_name: name,
                    user_id: props.user_id
                })
            });
            const status = await response.status;
            if (status === 204) {
                alert("Chat Created");
                handleClose();
                setName('');
                props.onNewChat();
            }
            else {
                alert("Failed to make chat");
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="sidebar-container">
            <div className="FriendHeader">
                <span>Conversations</span>
                <ForumIcon onClick={()=>setJoinOpen(true)} className='new-chat-icon' />
                <AddRoundedIcon onClick={handleClickOpen} className='new-chat-icon' />
                <div>

                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Create New Chat</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Create a new chat with you and your friends
                            </DialogContentText>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Chat Name"
                                type="text"
                                fullWidth
                                value={name}
                                onChange={(event) => {  setName(event.target.value) }}
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>

                            <Button onClick={handleSubmit} color="primary">
                                Create
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={joinOpen} onClose={()=>setJoinOpen(false)} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Join a Chat</DialogTitle>
                        <DialogContent>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Chat Name"
                                type="text"
                                fullWidth
                                value={joinChat}
                                onChange={(event) => { setJoinChat(event.target.value) }}
                            />


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>setJoinOpen(false)} color="primary">
                                Cancel
                            </Button>

                            <Button onClick={handleJoinChat} color="primary">
                                Join
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
            {props.conversations.map(obj => (<FriendTile chat_name={obj.chat_name}
                unread={props.unreadChats.includes(obj.chat_id)}
                chat_id={obj.chat_id}
                focus={obj.chat_id === props.chat_id}
                key={obj.chat_id} click={props.click} />))}
        </div>
    );

}
