import * as firebase from 'firebase'
import * as config from './firebase.json'

export const firebaseApp = firebase.initializeApp(config)

// export const provider = new firebase.auth.GoogleAuthProvider();
// export const auth = firebase.auth();
// export const database = firebase.database();
