import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function CreateJoinDialog(props)
{
  //const [open,setOpen] = React.useState(props.open)
  const [username,setUser] = React.useState('');

  const handleSubmitCreate = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch("http://localhost:8080/api/createNewChat", {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_name: username,
                user_id: props.user_id,
            })
        });
        const status = await response.status;
        if (status === 204) {     
            handleClose();
            props.onNewChat();
            alert('Created New Chat');
            setUser('');
        }
        else if (status === 409){
            alert("Chat room already taken");
        }
        else
        {
          alert("Error");
        }
    } catch (e) {
        console.error(e);
        alert("Error occured please try again");
    }
}

  const handleClose = () =>
  {
    props.handleClose();
  }

  

  return (
    <div>  
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Join or Create!</DialogTitle>
        
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newFriend"
            label="New Chat room"
            type="text"
            value = {username}
            onChange={(event) => {setUser(event.target.value) }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          
          <Button onClick={()=>props.handleSubmitJoin(username)} fullWidth size="medium" variant="contained" color="primary">
            Join
          </Button>
          <Button onClick={handleSubmitCreate} fullWidth  size="medium" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
        <Button onClick={handleClose}  color="default">
            Cancel
          </Button>
      </Dialog>
      
    </div>
  );
}