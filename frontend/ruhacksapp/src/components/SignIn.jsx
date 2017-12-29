import React, { Component } from 'react';
import { Link } from 'react-router';
import { firebaseApp } from '../firebase';
import { Button, Card, Input } from 'reactbulma';

class SignIn extends Component {
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
  signIn() {
    const { email, password } = this.state;
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        this.setState({ error });
      });
  }
  render() {
    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>Sign In</Card.Header.Title>
        </Card.Header>
        <Card.Content>
          <Input
            primary
            className="form-control"
            type="text"
            style={{ marginRight: '5px' }}
            placeholder="Email"
            onChange={event => this.setState({ email: event.target.value })}
          />
          <Input
            primary
            className="form-control"
            type="password"
            style={{ marginRight: '5px' }}
            placeholder="password"
            onChange={event => this.setState({ password: event.target.value })}
          />
          <Button success type="button" onClick={() => this.signIn()}>
            Sign In
          </Button>

          <div>{this.state.error.message}</div>
          <div>
            <Link to="/signup">Sign Up Instead</Link>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default SignIn;
