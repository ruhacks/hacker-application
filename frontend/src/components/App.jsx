import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { firebaseApp } from '../firebase';

import accountManagement from '../modules/accountManagement';

function CurrentView(props) {
  if (!props.app.state.userVerified) {
    return (
      <div>
        <p>Please verify your account by checking your email inbox. Also, check in your junk/spam box if you cannot find it in your inbox.</p>
        <p>If you cannot find the verification email sent to you, click <a href='#' title='Send verification email again' onClick={() => props.app.sendVerification()}>here</a> to send it again.</p>
      </div>
    );
  } else {
    return (
      <div>You are verfied</div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userVerified: null,
    };

    firebaseApp.auth().onAuthStateChanged((user) => {
      this.state.userVerified = user && user.emailVerified;

      if (document.getElementById('view')) {
        ReactDom.render(<CurrentView app={this} />, document.getElementById('view'));
      }
    });

    let query = props.location.query;
    if ('mode' in query) {

      let mode = query.mode;
      let actionCode = 'oobCode' in query ? query.oobCode : false;
      let continueUrl = 'continueUrl' in query ? query.continueUrl : false;
      let result = accountManagement.handleMode(firebaseApp, mode, actionCode, continueUrl);

      if (document.getElementById('messages')) {
        ReactDom.render(result, document.getElementById('messages'));
      }
    }
  }

  sendVerification() {
    let user = firebaseApp.auth().currentUser;

    accountManagement.sendVerificationEmail(user, false);
  }
 
  signOut() {
    firebaseApp.auth().signOut();
  }

  render() {
    return (
      <div>
        App
        <button className="btn btn-danger" onClick={() => this.signOut()}>
          Sign Out
        </button>
        <div id='messages'></div>
        <div id='view'></div>
      </div>
    );
  }
}

export default App;
