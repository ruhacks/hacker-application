import React, { Component } from 'react';
import { firebaseApp } from '../firebase';
import { Button } from 'reactbulma';

class App extends Component {
  signOut() {
    firebaseApp.auth().signOut();
  }

  render() {
    return (
      <div>
        App
        <Button className="btn btn-danger" onClick={() => this.signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }
}

export default App;
