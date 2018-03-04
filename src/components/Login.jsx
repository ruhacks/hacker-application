import React, { Component } from 'react';
import { Link } from 'react-router';
import { firebaseApp } from '../firebase';
import * as Bulma from 'reactbulma';

function checkError(error) {
  let props = {
    email: {class: '', error: '', icon: ''},
    password: {class: '', error: '', icon: ''}
  };

  if (error.message.toLowerCase().indexOf('email') > -1) {
    props.email.class = 'is-danger';
    props.email.icon = 'fa fa-warning';

    if (error.message.toLowerCase().indexOf('password') === -1) {
      props.email.error = error.message;
      error.message = '';
    }
  }

  if (error.message.toLowerCase().indexOf('password') > -1) {
    props.password.class = 'is-danger';
    props.password.icon = 'fa fa-warning';

    if (error.message.toLowerCase().indexOf('email') === -1) {
      props.password.error = error.message;
      error.message = '';
    }
  }

  return props;
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      props: {
        email: {
          class: '',
          error: '',
          icon: '',
        },
        password: {
          class: '',
          error: '',
          icon: '',
        }
      },
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
        this.setState({ error, props: checkError(error) });
      });
  }

  signUp() {
    const { email, password } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebaseApp.auth().onAuthStateChanged(user => {
            firebaseApp.database().ref(`users/${user.uid}`).set({
              email: user.email,
              verificationEmailSent: 0,
            });
          });
      }).catch((error) => {
        this.setState({ error, props: checkError(error) });
      });
  }

  render() {
    return (
      <div className='columns'>
        <div className='column is-hidden-touch'></div>
        <div className='column is-two-quarters is-block-touch'>
          <Bulma.Card id='signin-card'>
            <Bulma.Card.Header>
              <Bulma.Card.Header.Title>Login</Bulma.Card.Header.Title>
            </Bulma.Card.Header>
            <Bulma.Card.Content>
              <form id='signin-form'>
                <Bulma.Field>
                  <label htmlFor='signin-email' className='label'>Email</label>
                  <Bulma.Control className='has-icons-left has-icons-right'>
                    <Bulma.Input id='signin-email' type='email' placeholder='your.email@here.now' required
                      className={`is-primary ${this.state.props.email.class}`}
                      onChange={event => this.setState({ email: event.target.value, error: { message: ''}, props: { ...this.state.props, email: { class: '', icon: '', error: '' } } })}
                    />
                    <Bulma.Icon className='is-left'>
                      <i className='fa fa-envelope'></i>
                    </Bulma.Icon>
                    <Bulma.Icon className='is-right'>
                      <i className={this.state.props.email.icon}></i>
                    </Bulma.Icon>
                  </Bulma.Control>
                  <p className={`help ${this.state.props.email.error !== '' ? 'is-danger' : ''}`}>{this.state.props.email.error}</p>
                </Bulma.Field>
                <Bulma.Field>
                  <label htmlFor='signin-password' className='label'>Password</label>
                  <Bulma.Control className='has-icons-left has-icons-right'>
                    <Bulma.Input id='signin-password' type='password' placeholder='password (at least 6 characters)' required
                      className={`is-primary ${this.state.props.password.class}`}
                      onChange={event => {this.setState({ password: event.target.value, error: { message: ''}, props: { ...this.state.props, password: { class: '', icon: '', error: '' } } })}}
                    />
                    <Bulma.Icon className='is-left'>
                      <i className='fa fa-gear'></i>
                    </Bulma.Icon>
                    <Bulma.Icon className='is-right'>
                      <i className={this.state.props.password.icon}></i>
                    </Bulma.Icon>
                  </Bulma.Control>
                  <p className={`help ${this.state.props.password.error !== '' ? 'is-danger' : ''}`}>{this.state.props.password.error}</p>
                </Bulma.Field>

                <Bulma.Field className='is-grouped'>
                  <Bulma.Control>
                    <Bulma.Button className='is-link' type='button' onClick={() => this.signIn()}>
                      Login
                    </Bulma.Button>
                  </Bulma.Control>
                  <Bulma.Control>
                    <Bulma.Button className='is-link' type='button' onClick={() => this.signUp()}>
                      Register
                    </Bulma.Button>
                  </Bulma.Control>
                </Bulma.Field>
              </form>

              <div className='help is-danger'>{this.state.error.message}</div>

              {/*<div>
                <Link to='/forgotPassword'>Forgot Password?</Link>
              </div>*/}
            </Bulma.Card.Content>
          </Bulma.Card>
        </div>
        <div className='column is-hidden-touch'></div>
      </div>
    );
  }
}

export default Login;
