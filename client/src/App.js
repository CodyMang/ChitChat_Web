
import './App.css';
import React from 'react';
import MainPage from './MainChatPage/MainChat/MainPage'
import Login from './pages/login/login';
import SignUp from './pages/signup/signup'

import { BrowserRouter as Router, Route, Switch,Redirect} from "react-router-dom";

function NoPage(props) {
  return <h1>Error 404 No Page Found</h1>;
}
class App extends React.Component{
  
  constructor(props)
  {
    super(props);
    this.state = {userinfo:{},loggedIn:false}
    this.onValid = this.onValid.bind(this);
  }

  onValid =(info)=>{
    console.log(info)
    this.setState({userinfo:info,loggedIn:true})
  }
  render()
  {
  return (
    
    <div className="App">
      <Router>
        <Switch>
        <Route exact path="/" >
            {this.state.loggedIn ? <Redirect to={`/chats/${this.state.userinfo.chat_id}`} /> : <Login onValid ={(info)=>this.onValid(info)}/>}
          </Route>
          <Route exact path="/register"  component = {SignUp}/>
          <Route exact path="/chats/:chat_id"  render={(props)=><MainPage {...props} userinfo = {this.state.userinfo} />}>

          </Route>
          <Route exact path="/*" component = {NoPage}/>  
        </Switch>
      </Router>
    </div>
    
  );
  }
}

export default App;
