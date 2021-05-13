import React from 'react';
import "./navbar.css";
import MenuListComposition from './Dropdown Menu/MenuList';
import SockJsClient from 'react-stomp';
export default function Navbar(props){
    const sockRef = React.useRef(null);
    const sendReload = (username) =>
    {
        console.log(username);
        props.chatAreaRef.current.handleNameChange(username);
        

    }
    return (
        <div className="navbar-container">
            <div className="left">
                <div className="title">
                    <a href="/">ChitChat</a>
                </div>
            </div>
            
            <div className="right">
               <MenuListComposition
                reload = {sendReload}
                username={props.username}
                user_id={props.user_id} 
                setUserName = {props.setUserName}/>
            </div>
            <SockJsClient url='http://localhost:8080/ws'
                    topics={['/channel/']}
                    ref={sockRef}
                    onMessage={()=>{}}
                />
        </div>
    );

}
/* <div className="button">
<a href="/">Logout</a> */