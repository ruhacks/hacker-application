import React, { Component } from 'react'
import { firebaseApp } from '../firebase'
import * as Bulma from 'reactbulma'

function checkError (error) {
  let props = {
    email: {class: '', error: '', icon: ''},
    password: {class: '', error: '', icon: ''}
  }

  if (error.message.toLowerCase().indexOf('email') > -1) {
    props.email.class = 'is-danger'
    props.email.icon = 'fa fa-warning'

    if (error.message.toLowerCase().indexOf('password') === -1) {
      props.email.error = error.message
      error.message = ''
    }
  }

  if (error.message.toLowerCase().indexOf('password') > -1) {
    props.password.class = 'is-danger'
    props.password.icon = 'fa fa-warning'

    if (error.message.toLowerCase().indexOf('email') === -1) {
      props.password.error = error.message
      error.message = ''
    }
  }

  return props
}

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordVerify: '',
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
      isLogin: this.props.router.isActive('/login'),
      isRegister: this.props.router.isActive('/register'),
      isForgotPassword: this.props.router.isActive('/forgotPassword'),
      isProcessing: false
    }
  }

  signIn () {
    const { email, password } = this.state
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        this.setState({ error, props: checkError(error) })
        this.setState({isProcesing: false})
      })
  }

  signUp () {
    const { email, password, passwordVerify } = this.state

    if (password !== passwordVerify) {
      let error = {
        message: 'Passwords are not matching!'
      }
      this.setState({ error, props: checkError(error) })
    } else {
      firebaseApp.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          firebaseApp.auth().onAuthStateChanged(user => {
            firebaseApp.database().ref(`users/${user.uid}`).set({
              email: user.email,
              verificationEmailSent: 0,
            })
          })

          this.setState({isProcesing: false})
        }).catch((error) => {
          this.setState({ error, props: checkError(error) })
          this.setState({isProcesing: false})
        })
    }
  }

  forgotPassword () {
    const { email } = this.state

    firebaseApp.auth().sendPasswordResetEmail(email)
      .then(() => {
        window.alert('Email sent. Check your inbox.')
        this.setState({isProcesing: false})
      }).catch((error) => {
        this.setState({ error, props: checkError(error) })
        this.setState({isProcesing: false})
      })
  }

  render () {
    return (
      <div className='columns'>
        <div className='column is-hidden-touch' />
        <div className='column is-two-quarters is-block-touch'>
          <Bulma.Card id='signin-card'>
            <Bulma.Card.Header>
              <Bulma.Card.Header.Title>
                {this.state.isLogin ? 'Login' : 'Register'}
              </Bulma.Card.Header.Title>
            </Bulma.Card.Header>
            <Bulma.Card.Content>
              <form id='signin-form'>
                <Bulma.Field>
                  <label htmlFor='signin-email' className='label'>Email</label>
                  <Bulma.Control className='has-icons-left has-icons-right'>
                    <Bulma.Input
                      id='signin-email'
                      type='email'
                      placeholder='your.email@here.now'
                      required
                      className={`is-primary ${this.state.props.email.class}`}
                      onChange={event => {
                        this.setState({
                          email: event.target.value,
                          error: { message: '' },
                          props: {
                            ...this.state.props,
                            email: { class: '', icon: '', error: '' }
                          }
                        })
                      }}
                    />
                    <Bulma.Icon className='is-left'>
                      <i className='fa fa-envelope' />
                    </Bulma.Icon>
                    <Bulma.Icon className='is-right'>
                      <i className={this.state.props.email.icon} />
                    </Bulma.Icon>
                  </Bulma.Control>
                  <p
                    className={`help ${this.state.props.email.error !== '' ? 'is-danger' : ''}`}
                  >
                    {this.state.props.email.error}
                  </p>
                </Bulma.Field>
                <Bulma.Field style={{display: (this.state.isForgotPassword ? 'none' : 'block')}}>
                  <label htmlFor='signin-password' className='label'>Password</label>
                  <Bulma.Control className='has-icons-left has-icons-right'>
                    <Bulma.Input
                      id='signin-password'
                      type='password'
                      placeholder='password (at least 6 characters)'
                      required
                      className={`is-primary ${this.state.props.password.class}`}
                      onChange={event => {
                        this.setState({
                          password: event.target.value,
                          error: { message: '' },
                          props: {
                            ...this.state.props,
                            password: { class: '', icon: '', error: '' }
                          }
                        })
                      }}
                    />
                    <Bulma.Icon className='is-left'>
                      <i className='fa fa-gear' />
                    </Bulma.Icon>
                    <Bulma.Icon className='is-right'>
                      <i className={this.state.props.password.icon} />
                    </Bulma.Icon>
                  </Bulma.Control>
                  <p
                    className={`help ${this.state.props.password.error !== '' ? 'is-danger' : ''}`}
                  >
                    {this.state.props.password.error}
                  </p>
                </Bulma.Field>
                <Bulma.Field style={{display: (this.state.isRegister ? 'block' : 'none')}}>
                  <label htmlFor='signin-password-verify' className='label'>Verify Password</label>
                  <Bulma.Control className='has-icons-left has-icons-right'>
                    <Bulma.Input
                      id='signin-password-verify'
                      type='password'
                      placeholder='password (at least 6 characters)'
                      required
                      className={`is-primary ${this.state.props.password.class}`}
                      onChange={event => {
                        this.setState({
                          passwordVerify: event.target.value,
                          error: { message: '' },
                          props: {
                            ...this.state.props,
                            password: { class: '', icon: '', error: '' }
                          }
                        })
                      }}
                    />
                    <Bulma.Icon className='is-left'>
                      <i className='fa fa-gear' />
                    </Bulma.Icon>
                    <Bulma.Icon className='is-right'>
                      <i className={this.state.props.password.icon} />
                    </Bulma.Icon>
                  </Bulma.Control>
                  <p
                    className={`help ${this.state.props.password.error !== '' ? 'is-danger' : ''}`}
                  >
                    {this.state.props.password.error}
                  </p>
                </Bulma.Field>

                <Bulma.Control>
                  <Bulma.Button
                    className='is-link'
                    type='button'
                    onClick={() => {
                      this.setState({isProcesing: true})

                      if (this.state.isForgotPassword) {
                        this.forgotPassword()
                      } else if (this.state.isRegister) {
                        this.signUp()
                      } else {
                        this.signIn()
                      }
                    }}
                  >
                    <i className={`fa ${
                      this.state.isProcesing ? 'fa-refresh fa-spin' : 'fa-arrow-circle-right'
                    }`} />
                    <span style={{marginLeft: '0.5em'}}>
                      {
                        this.state.isForgotPassword
                          ? 'Send forgot password email'
                          : (
                            this.state.isRegister
                              ? 'Register'
                              : 'Login'
                          )
                      }
                    </span>
                  </Bulma.Button>
                </Bulma.Control>
              </form>

              <div className='help is-danger'>{this.state.error.message}</div>

              <Bulma.Content style={{marginTop: '1em'}}>
                <a
                  style={{
                    display: (this.state.isLogin ? 'none' : 'block'),
                    marginBottom: '0.5em'
                  }}
                  href='/login'
                  title='Login'
                >
                  Login
                </a>
                <div style={{display: (this.state.isRegister ? 'none' : 'block')}}>
                  <a
                    style={{
                      display: 'block',
                      marginBottom: '0.5em'
                    }}
                    href='/register'
                    title='Register'
                  >
                    Register
                  </a>
                  <a
                    style={{display: (this.state.isForgotPassword ? 'none' : 'block')}}
                    href='/forgotPassword'
                    title='Forgot Password'
                  >
                    Forgot Password
                  </a>
                </div>
              </Bulma.Content>
            </Bulma.Card.Content>
          </Bulma.Card>
        </div>
        <div className='column is-hidden-touch' />
      </div>
    )
  }
}

export default Login
