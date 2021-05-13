import "./MemberTile.css";
import logo from './coffee.png';


export default function MemberTile(props) {
    return (
        <div className={`member-tile-container` }>
            <div className="member-tile-wrapper">
                <div className="member-profile-container">
                    <img className="profile-pic" src={logo}/>
                    <div className={`status-container ${props.is_active ? 'member-online':''}`}></div>
                </div>
                <div className="meta-container">
                    <span className="member-name">{props.username}</span>
                </div>
            </div>
        </div>
    );
}