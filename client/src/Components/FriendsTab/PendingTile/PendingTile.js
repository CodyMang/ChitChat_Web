import { red } from "@material-ui/core/colors";
import "./PendingTile.css";
import logo from './kirby.PNG';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

export default function PendingTile(props) {

    return (
        <div 
            className="friend-tile-container no-select"
            //onClick={() => props.click(props.chat_id)}
        >
            <div className="info-container">
                <div className="profile-container">
                    <img src={logo} className="profile-pic"></img>
                    
                </div>
                <div className="username-container">
                    <span className="username-text">{props.username}</span>
                </div>
            </div>
        </div>
    );
}