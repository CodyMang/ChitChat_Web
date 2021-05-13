import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ChangeNameDialog(props)
{
  //const [open,setOpen] = React.useState(props.open)
  const [username,setUser] = React.useState('');
  const handleSubmit = async (event) => {
      event.preventDefault();
      try {
          const response = await fetch("http://localhost:8080/api/updateUsername", {
              method: 'POST',
              mode: 'cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  user_id: props.user_id,
                  username: username,
              })
          });
          const status = await response.status;
          if (status === 200) {     
              handleClose();
              
              props.reload(username);
              alert('Name Changed');
          }
          else {
              alert("Username Taken");
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
        <DialogTitle id="form-dialog-title">Change Name</DialogTitle>
        
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Desired Username"
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
          
          <Button onClick={handleSubmit} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}