import { red } from "@material-ui/core/colors";
import "./FriendTile.css";
import logo from './kirby.PNG';

export default function FriendTile(props) {

    return (
        <div 
            className={`friend-tile-container no-select ${props.focus ? 'focus':''}`}
            onClick={() => props.click(props.chat_id)}
        >
            <div className="info-container">
                <div className="profile-container">
                    <img src={logo} className="profile-pic"></img>
                    {props.status
                        ? <div className="status-container" style={{background: "green"}}></div>
                        : <div className="status-container" style={{background: "grey"}}></div>
                    }
                    
                </div>
                <div className="username-container">
                    <span className="username-text">{props.username}</span>
                </div>
            </div>
        </div>
    );
}