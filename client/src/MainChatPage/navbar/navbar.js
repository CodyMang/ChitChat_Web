import React from 'react';
import "./navbar.css";
import MenuListComposition from './Dropdown Menu/MenuList';
export default function Navbar(props){
    return (
        <div className="navbar-container">
            <div className="left">
                <div className="title">
                    <a href="/">ChitChat</a>
                </div>
            </div>
            
            <div className="right">
               <MenuListComposition username={props.username} />
            </div>
        </div>
    );

}
/* <div className="button">
<a href="/">Logout</a> */