import React from "react";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Link,
} from "@material-ui/core";

//import axios from 'axios';
import "./login.css";
import FormDialog from './Dialog/FormDialog';

const API_URL = "http://localhost:8080/api/login";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "",
     password: "", 
     authflag: 1,
     onValid: this.props.onValid,
     open:false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeUserInfo = this.changeUserInfo.bind(this);
  }

  setOpen = (value) =>
  {
    this.setState({open:value});
  }
  handleChange(event) {
    this.setState({
      username: event.state.username,
      password: event.state.password,
    });
  }
  changeUserInfo(info)
  {
      console.log(info);
  }

  async handleSubmit(event) {
    
    event.preventDefault();
    
    const response = await fetch(API_URL,{
      method:'POST',
      mode:'cors', 
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({username: this.state.username,
                          pass: this.state.password})
    });
    const status = await response.status;
    if(status === 200)
    {
      const data = await response.json();
      this.state.onValid(data[0]);
    }
    else
    {
      alert("Wrong Username/password");
    }
    
  }

  render() {
    return (
      <div >
        <Grid container spacing={0} justify="center" direction="row">
          <Grid item>
            <Grid
              container
              direction="column"
              justify="center"
              spacing={2}
              className="login-form"
            >
              <Paper
                variant="elevation"
                elevation={2}
                className="login-background"
              >
                <Grid item>
                  <Typography component="h1" variant="h5" align="center">
                    Sign in
                  </Typography>
                </Grid>
                <Grid item>
                  <form onSubmit={this.handleSubmit}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <TextField
                          fullWidth
                          required
                          label="Username"
                          name="username"
                          variant="outlined"
                          value={this.state.username}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          type="password"
                          label="Password"
                          fullWidth
                          name="password"
                          variant="outlined"
                          value={this.state.password}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          fullWidth
                        >
                          Sign In
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <Link className="forgetPass" onClick={()=>this.setOpen(true)} variant="body2">
                      Forgot Password?
                    </Link>
                    <FormDialog open = {this.state.open} handleClose ={()=>this.setOpen(false)} />
                  </Grid>
                  <Grid item>
                    <Link href="/register" variant="body2">
                      Not a member? Register Here
                    </Link>
                      
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
       
      </div>
    );
  }
}
export default Login;
