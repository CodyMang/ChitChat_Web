import React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import './MessageTile.css'

const DELETE_API_URL = "http://localhost:8080/api/deleteMessage";
const UPDATE_API_URL = "http://localhost:8080/api/updateMessage"
export default function MessageTile(props){

    const [editor,setEditor] = React.useState(false);
    const [msgContent,setMsgContent] = React.useState(props.content);
    const [tempValue,setTemp ]= React.useState(msgContent);
    const handleSubmit = () =>
    {
        setEditor(false);
        updateMessage();
    }
    
    const keyPressed = (e) => {
        if (e.key === "Escape") {
            setEditor(false);
        }
        if (e.key === "Enter") {
            handleSubmit();
        }
    }


    const handleDelete = async () =>
    {
        if(window.confirm("Delete Message"))
        {
            const response = await fetch(DELETE_API_URL, {
            method: 'DELETE',
            mode:'cors', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message_id:props.message_id}),
            });
            const status = await response.status;
            if(status === 200)
            {
                props.updateChat();
            }
            else
            {
                alert("Message Could not be deleted");
            }

        }
    }

    const updateMessage = async() =>
    {
            const response = await fetch(UPDATE_API_URL, {
            method: 'POST',
            mode:'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message_id:props.message_id,content:msgContent})
            });
            const status = await response.status;
            if(status === 200)
            {
                props.updateChat(props.message_id,msgContent);
            }
            else
            {
                alert("Message Could not be edited");
            }

    }
    
    const getEditor = (edit) =>
    {
        if(edit)
        {
            
            return (<div className="content">
                <input type="textarea"
                     className="content-input"
                    onChange={(event) => {setMsgContent(event.target.value) }}
                    value={msgContent} 
                    onKeyPress={keyPressed}
                    id = {props.message_id}
                    /></div>)
        }
        else
        {
            return (<div id = {props.message_id} className="content">{msgContent}</div>)
        }
    }
    return(
            <div className='message-container'>
                <div className="username">{props.username}</div>
                {props.message_type === "file" ? (<a className="message-link" href={props.content}>{props.content}</a>):getEditor(editor)}  
                {props.owner ?
                    
                    <CreateIcon className='more-horizon' onClick={()=>setEditor(true)}/>
                    :
                    <div className="more-horizon"></div>
                }
                 {props.owner ?
                    
                    <DeleteForeverIcon className="delete-button" onClick={()=>handleDelete()} />   
                    :
                    <div className="delete-button"></div>
                }   
            </div>
    )

}