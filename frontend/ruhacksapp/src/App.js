import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      user: null
    }
    
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">RU Hacks Application Dashboard</h1>
          {this.state.user ?
            <button onClick={this.logout}>Log Out</button>                
            :
            <button onClick={this.login}>Log In</button>              
          }

        </header>
        {this.state.user ?
         
            <div className='user-profile'>
                <img src={this.state.user.photoURL} />
            </div>
            :
            <p>Login to apply for RU Hacks!</p>
        }
        
      </div>
      
    );
  }
}

export default App;
