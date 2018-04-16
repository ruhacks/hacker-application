import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { firebaseApp } from './firebase'

import App from './components/App'
import Login from './components/Login'
import accountManagement from './modules/accountManagement'

firebaseApp.auth().onAuthStateChanged((user) => {
  if (user) {
    if (!user.emailVerified) {
      // console.log('User signed up or still needs to verify their email', user);

      firebaseApp.database().ref(`users/${user.uid}`).once('value',
        snapshot => {
          // send user verification email
          if (snapshot && snapshot.val().verificatonEmailSent < 1) {
            accountManagement.sendVerificationEmail(user, true)
          }
        }, error => {
          // console.log('Failed to check if verification email was sent', error);
        })
    } else {
      // @todo show user actions
      // console.log('User signed in', user);
    }

    let routes = ['/app', '/application', '/invitation']
    if (routes.indexOf(window.location.pathname) < 0) {
      browserHistory.push('/app')
    }
  } else {
    // console.log('User has signed out or still needs to sign in');
    browserHistory.replace(`login`)
  }
})

ReactDom.render(
  <Router path='/' history={browserHistory}>
    <Route path='/app' component={App} />
    <Route path='/application' component={App} />
    <Route path='/invitation' component={App} />
    <Route path='/login' component={Login} />
    {/*<Route path='/register' component={Login} />*/}
    <Route path='/forgotPassword' component={Login} />
  </Router>,
  document.getElementById('root')
)
