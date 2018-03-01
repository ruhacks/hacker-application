import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { firebaseApp } from '../firebase'
import * as Bulma from 'reactbulma'

import Dashboard from './Dashboard'
import Application from './Application'
import accountManagement from '../modules/accountManagement'

function GetMessages (props) {
  if (props.app.state.user.verificationMsgSeen === null || !props.app.state.user.verificationMsgSeen) {
    if (!props.app.state.userVerified) {
      return (
        <Bulma.Message info>
          <Bulma.Message.Header>
            <p>Info</p>
          </Bulma.Message.Header>
          <Bulma.Message.Body>
            <Bulma.Content>Please verify your account by checking your email inbox. Also, check in your junk/spam box if you cannot find it in your inbox.</Bulma.Content>
            <Bulma.Content>If you cannot find the verification email sent to you, click <a title='Send verification email again' onClick={() => props.app.sendVerification()}>here</a> to send it again.</Bulma.Content>
          </Bulma.Message.Body>
        </Bulma.Message>
      )
    } else {
      const formMsg = document.getElementById('form-msg')

      if (formMsg) {
        formMsg.setAttribute('style', 'display: block')
      } else {
        return (
          <Bulma.Message info id='form-msg'>
            <Bulma.Message.Header>
              <p>Info</p>
              <Bulma.Delete onClick={() => {
                document.getElementById('form-msg').setAttribute('style', 'display: none')
              }} />
            </Bulma.Message.Header>
            <Bulma.Message.Body>
              <Bulma.Content>You are verified!</Bulma.Content>
            </Bulma.Message.Body>
          </Bulma.Message>
        )
      }
    }
  }

  if (props.app.state.userVerified) {
    if (!props.app.state.user.applicationComplete) {
      return (
        <Bulma.Message info id='form-msg'>
          <Bulma.Message.Header>
            <p>Info</p>
            <Bulma.Delete onClick={() => {
              document.getElementById('form-msg').setAttribute('style', 'display: none')
            }} />
          </Bulma.Message.Header>
          <Bulma.Message.Body>
            <Bulma.Content>You still have not yet completed the application. You can access it by the navigation sidebar or clicking <a href='/application' title='RU Hacks Hacker Application'>here</a>.</Bulma.Content>
          </Bulma.Message.Body>
        </Bulma.Message>
      )
    } else {
      return (
        <Bulma.Message info id='form-msg'>
          <Bulma.Message.Header>
            <p>Info</p>
            <Bulma.Delete onClick={() => {
              document.getElementById('form-msg').setAttribute('style', 'display: none')
            }} />
          </Bulma.Message.Header>
          <Bulma.Message.Body>
            <Bulma.Content>Awesome you've submitted your application. We will be reviewing applications soon. Please feel free to update your application while you wait to hear back from us.</Bulma.Content>
          </Bulma.Message.Body>
        </Bulma.Message>
      )
    }
  }

  return (null)
}

function PanelLink (props) {
  let attr = {}

  if (props.id) attr.id = props.id
  if (props.className) attr.className = props.className

  if (props.external) {
    attr.target = '_blank'
    attr.rel = 'noopener noreferrer'
  }

  return (
    <Bulma.Panel.Block as='a' href={props.link} title={props.title || props.label} {...attr}>
      <Bulma.Panel.Icon>
        <i className={`fa fa-${props.icon}`} />
      </Bulma.Panel.Icon>
      {props.label}
    </Bulma.Panel.Block>
  )
}

function GetView (props) {
  const location = props.app.location.pathname.toLowerCase()

  if (location.indexOf('/application') === 0) {
    return (<Application app={props.app} />)
  } else if (location.indexOf('/app') === 0) {
    return (<Dashboard app={props.app} />)
  }

  return (null)
}

function showNavLinks (props) {
  let links = []

  if (props.userVerified) {
    links.push(<PanelLink link='/application' icon='file-text-o' title='Application' label='Application' className={props.activeTab === 'application' ? 'is-active' : ''} key='0' />)

    if (props.userAccepted) {
      links.push(<PanelLink link='' icon='check-square' title='Confirmation' label='Confirmation' className={props.activeTab === 'confirmation' ? 'is-active' : ''} key='1' />)
      links.push(<PanelLink link='' icon='users' title='Team' label='Team' className={props.activeTab === 'team' ? 'is-active' : ''} key='2' />)
    }
  }

  return (links.length > 0 ? links : null)
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userVerified: null,
      user: {
        accepted: null,
        verificationMsgSeen: null,
        applicationComplete: null,
      },
      activeTab: props.location.pathname === '/app' ? 'dashboard' : props.location.pathname.substr(1, props.location.pathname.length - 1)
    }

    this.location = props.location

    firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({ userVerified: true }) /* user && user.emailVerified */

      firebaseApp.database().ref(`users/${user.uid}`).once('value',
        snapshot => {
          if (snapshot) {
            // ====== Verification Message Seen ======
            let stateExists = true // snapshot.val().verificationMsgSeen !== null && snapshot.val().verificationMsgSeen !== undefined;

            if (stateExists) {
              this.setState({ user: { ...this.state.user, verificationMsgSeen: true } })
            } else if (user.emailVerified) {
              this.setState({ user: { ...this.state.user, verificationMsgSeen: false } })
            }

            // ====== Application Complete ======
            stateExists = snapshot.val().applicationComplete !== null && snapshot.val().applicationComplete !== undefined

            if (stateExists) {
              this.setState({ user: { ...this.state.user, applicationComplete: snapshot.val().applicationComplete } })
            } else {
              this.setState({ user: { ...this.state.user, applicationComplete: false } })
            }

            // ====== Update db ======
            firebaseApp.database().ref(`users/${user.uid}`).set({
              ...snapshot.val(),
              ...this.state.user
            }).then(() => {
              // Update successful.
              // console.log('Updated verified info message seen field', user);
            }).catch(error => {
              // An error happened.
              // console.log('Failed to update verified info message seen field', user);
            })

            // ====== Show Messages ======
            if (document.getElementById('dashboard-messages')) {
              ReactDom.render(<GetMessages app={this} />, document.getElementById('dashboard-messages'))
            } else if (this.location.pathname === '/app') {
              const insertMessages = window.setInterval(() => {
                if (document.getElementById('dashboard-messages')) {
                  ReactDom.render(<GetMessages app={this} />, document.getElementById('dashboard-messages'))
                }

                window.clearInterval(insertMessages)
              }, 500)
            } else if (document.getElementById('messages')) {
              ReactDom.render(<GetMessages app={this} />, document.getElementById('messages'))
            }
          } else {
            // console.log('User data cannot  be found');
          }
        }, error => {
          // console.log('Failed to get user data', error);
        }
      )

      const insertNav = window.setInterval(() => {
        const placeholder = document.getElementById('panel-placeholder')

        if (placeholder) {
          ReactDom.render(showNavLinks(this.state), placeholder) // render the elements into placeholder first

          // insert the elements into their right place
          placeholder.childNodes.forEach((node) => {
            document.getElementById('app-sidebar').insertBefore(node, placeholder)
          })
          placeholder.remove() // remove placeholder container

          if (document.getElementById('view')) {
            ReactDom.render(<GetView app={this} />, document.getElementById('view'))
          }

          window.clearInterval(insertNav)
        }
      }, 500)
    })

    let query = props.location.query
    if ('mode' in query) {
      let mode = query.mode
      let actionCode = 'oobCode' in query ? query.oobCode : false
      let continueUrl = 'continueUrl' in query ? query.continueUrl : false
      this.state.result = accountManagement.handleMode(firebaseApp, mode, actionCode, continueUrl)

      if (document.getElementById('messages')) {
        ReactDom.render(<GetMessages app={this} />, document.getElementById('messages'))
      }
    }
  }

  sendVerification () {
    let user = firebaseApp.auth().currentUser

    accountManagement.sendVerificationEmail(user, false)
  }

  signOut () {
    firebaseApp.auth().signOut()
  }

  render () {
    return (
      <div className='columns'>
        <div className='column is-one-fifth'>
          <Bulma.Panel id='app-sidebar'>
            <Bulma.Panel.Heading>Navigation</Bulma.Panel.Heading>
            <PanelLink link='/app' icon='tachometer' title='Dashboard' label='Dashboard' className={this.state.activeTab === 'dashboard' ? 'is-active' : ''} />
            <div id='panel-placeholder' />
            <PanelLink link='https://2018.ruhacks.com/#FAQ' icon='question-circle-o' title='FAQ' label='FAQ' external />
            <PanelLink link='mailto:hackers@ruhacks.com' icon='envelope-o' title='Contact Us' label='Contact Us' external />
            <Bulma.Panel.Block>
              <Bulma.Button className='button is-link is-outlined is-fullwidth' onClick={() => this.signOut()}>
                Sign out
              </Bulma.Button>
            </Bulma.Panel.Block>
          </Bulma.Panel>
          <Bulma.Content id='messages' />
        </div>
        <div id='app-content' className='column'>
          <div id='view' className='box' />
        </div>
      </div>
    )
  }
}

export default App
