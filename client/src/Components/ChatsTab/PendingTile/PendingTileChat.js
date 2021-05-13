import { red } from "@material-ui/core/colors";
import "./PendingTile.css";
import logo from './jiggly.png';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {useState} from 'react';

export default function PendingTileChat(props) {
    const [isHoverd,setHovered] = useState(false);

    const changeHover = () =>
    {
        setHovered(!isHoverd);
    }
    
    return (
        <div 
            className="friend-tile-container no-select"
            //onClick={() => props.click(props.chat_id)}
            onMouseEnter={changeHover} 
            onMouseLeave={changeHover}
        >
            <div className="info-container">
                <div className="profile-container">
                    <img src={logo} className="profile-pic"></img>
                    
                </div>
                {
                    isHoverd ?
                    (
                        <div className="accept-decline-container">
                        <CheckCircleIcon className ="accept-decline"
                         style={{ fontSize: 40 }}
                         onClick={()=>props.joinChat(props.chat_name)}/>
                        <HighlightOffIcon 
                        className ="decline-accpet" 
                        style={{ fontSize: 40 }}
                        onClick={()=>props.declineChat(props.chat_name)}
                        />
                        </div>
                    ):
                    (
                        <div className="friend-request-container">
                        <span className="friend-requst"><strong>Join new Chat</strong></span>
                        <span className="username-text">{props.chat_name}</span>
                        </div>
                    )
                }
                
                
                
            </div>
        </div>
    );
}