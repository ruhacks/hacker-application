import React from 'react'
import { browserHistory } from 'react-router'
import { firebaseApp } from '../firebase'

function sendVerificationEmail (user, initial) {
  user.sendEmailVerification({
    url: 'https://hackers.ruhacks.com/signin?verified=true',
  }).then(() => {
    // Email sent.
    console.log('Sent verification email', user)

    firebaseApp.database().ref(`users/${user.uid}`).once('value',
      snapshot => {
        if (snapshot) {
          let newValue = initial ? 1 : ++snapshot.val().verificationEmailSent

          firebaseApp.database().ref(`users/${user.uid}`).set({
            ...snapshot.val(),
            verificationEmailSent: newValue,
          }).then(() => {
            // Update successful.
            // console.log('Updated verification email send field', user);
            window.alert('Sent verification email.')
          }).catch(error => {
            // An error happened.
            // console.log('Failed to update verification email send field', user);
            window.alert('Failed to send verification email. Try again later.')
          })
        } else {
          // console.log('User data cannot  be found');
        }
      }, error => {
        // console.log('Failed to get user data', error);
      })
  }).catch(error => {
    // An error happened.
    // console.log('Failed to send verification email', user);
  })
}

function verifyEmail (app, actionCode, nextUrl) {
  // @todo need to check for case where user is not logged in to verify
  app.auth().applyActionCode(actionCode).then(response => {
    if (nextUrl) {
      browserHistory.replace(nextUrl)
    } else {
      return (
        <div>Account is now verified. Please go to sign in page to login.</div>
      )
    }
  }).catch(error => {
    // console.log('Failed to verify account. Try again later.', error)
    return (
      <div>Failed to verify account. Try again later.</div>
    )
  })
}

// refer to https://firebase.google.com/docs/auth/custom-email-handler
function handleMode (app, mode, actionCode, nextUrl) {
  let result

  switch (mode) {
    case 'resetPassword':
      result = <div>Action under dev</div>
      break
    case 'recoverEmail':
      result = <div>Action under dev</div>
      break
    case 'verifyEmail':
      result = verifyEmail(app, actionCode, nextUrl)
      break
    default:
      result = <div>Action not found</div>
      break
  }

  return result
}

const ext = {
  sendVerificationEmail,
  handleMode
}

export default ext
