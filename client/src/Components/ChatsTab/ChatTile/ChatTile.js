import "./ChatTile.css";
import logo from './kirby.PNG';


export default function ChatTile(props) {

    return (
        <div className={`chat-tile-container ${props.focus ? 'focus':''} ${props.unread ? 'unread-chat':''}` }
        onClick={()=>props.click(props.chat_id)}>
            <div className="chat-tile-wrapper">
                <div className="profile-container">
                    <img className="profile-pic" src={logo}></img>
                    <div className="chat-status-container" style={{background: "grey"}}></div>
                </div>
                <div className="meta-container">
                    <span className="chat-name">{props.name}</span>
                    <span className="chat-message">{props.message}</span>
                </div>
            </div>
        </div>
    );
}