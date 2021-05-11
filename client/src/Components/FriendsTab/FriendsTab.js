import AddIcon from '@material-ui/icons/Add';
import FriendTile from "./FriendTile/FriendTile.js";
import PendingTile from "./PendingTile/PendingTile.js";
import "./FriendsTab.css";

export default function FriendsTab(props) {


    return (
        <div className="friends-tab-container">
            <button className="add-friend-button" onClick={props.addFriendClick(true)}>
                <AddIcon/>
                Add a friend
            </button>

            {
            props.pendingFriends.map(obj => (
            <PendingTile
                username={obj.username}
                chat_id ={obj.chat_id}
                accept = {props.onAcceptFriend}
                decline = {props.onRejectFriend}
            />))
            }
            {props.friendList.map(obj => (<FriendTile 
                username={obj.username}
                chat_id ={obj.chat_id}
                status={true}
                click={props.click}
                focus={obj.chat_id === props.currentChat}
            />))
            }

        </div>
    );
}