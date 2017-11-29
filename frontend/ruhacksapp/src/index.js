import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { firebaseApp } from './firebase';

import App from './components/App';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

firebaseApp.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('User sign in or signed up', user);
    browserHistory.push('/app');
  } else {
    console.log('User has signed out or still needs to sign in');
    browserHistory.replace('signin');
  }
});

ReactDom.render(
  <Router path="/" history={browserHistory}>
    <Route path="/app" component={App} />
    <Route path="/SignIn" component={SignIn} />
    <Route path="/SignUp" component={SignUp} />
  </Router>,
  document.getElementById('root'),
);
