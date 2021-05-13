import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AddFriendToChat(props)
{
  //const [open,setOpen] = React.useState(props.open)
  const [username,setUser] = React.useState('');

  const handleClose = () =>
  {
    props.handleClose();
  }


  return (
    <div>  
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Friend</DialogTitle>
        
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            id="newFriend"
            label="Friend Username"
            type="text"
            value = {username}
            onChange={(event) => {setUser(event.target.value) }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          
          <Button onClick={()=>props.click(username)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}