import firebase from 'firebase'

//Firebase Config
const config = {
    apiKey: "AIzaSyAVpnCoyMWehzE-5-ZGk7AUqsE5aqDEykU",
    authDomain: "ru-hacks.firebaseapp.com",
    databaseURL: "https://ru-hacks.firebaseio.com",
    projectId: "ru-hacks",
    storageBucket: "ru-hacks.appspot.com",
    messagingSenderId: "73932887478"
}

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const database = firebase.database();
export default firebase;
