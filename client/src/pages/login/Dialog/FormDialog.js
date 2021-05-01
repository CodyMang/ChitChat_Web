import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props)
{
  //const [open,setOpen] = React.useState(props.open)
  const [username,setUser] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [pass,setPass]= React.useState('');
const handleSubmit = async (event) => {
      event.preventDefault();
      try {
          const response = await fetch("http://localhost:8080/api/ResetRequest", {
              method: 'POST',
              mode: 'cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  chat_name: username,
                  email: email
              })
          });
          const status = await response.status;
          if (status === 204) {
              
              handleClose();
              this.setUser('');
              setEmail('');
              props.onNewChat();
          }
          else {
              alert("Incorrect Credentials");
          }
      } catch (e) {
          console.error(e);
          alert("Password Reset");
      }
  }

  const handleClose = () =>
  {
    this.setState({open:false});
  }


  return (
    <div>  
      <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
        
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            value = {username}
            onChange={(event) => {setUser(event.target.value) }}
            fullWidth
          />

          <TextField
            margin="dense"
            id="users"
            label="E-mail"
            type="text"
            value ={email}
            onChange={(event) => {setEmail(event.target.value) }}
            fullWidth
          />

          
          <TextField
            margin="dense"
            id="password"
            label="New Password"
            type="password"
            value ={pass}
            onChange={(event) => {setPass(event.target.value) }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          
          <Button onClick={handleSubmit} color="primary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}

