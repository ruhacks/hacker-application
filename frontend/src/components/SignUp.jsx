import React, { Component } from 'react';
import { Link } from 'react-router';
import { firebaseApp } from '../firebase';
import { Button, Card, Input } from 'reactbulma';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: {
        message: '',
      },
    };
  }
  signUp() {
    const { email, password } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebaseApp.auth().onAuthStateChanged(user => {
            firebaseApp.database().ref(`users/${user.uid}`).set({
              email: user.email,
              verificatonEmailSent: 0,
            });
          });
      }).catch((error) => {
        this.setState({ error });
      });
  }
  render() {
    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>Sign Up</Card.Header.Title>
        </Card.Header>
        <Card.Content>
          <Input
            primary
            type="text"
            style={{ marginRight: '5px' }}
            placeholder="Email"
            onChange={event => this.setState({ email: event.target.value })}
          />

          <Input
            primary
            type="password"
            style={{ marginRight: '5px' }}
            placeholder="password"
            onChange={event => this.setState({ password: event.target.value })}
          />
          <Button success type="button" onClick={() => this.signUp()}>
            Sign Up
          </Button>

          <div>{this.state.error.message}</div>
          <div>
            <Link to="/signin">Sign In Instead</Link>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default SignUp;
