$(function (){
  const config = {
  apiKey: "AIzaSyAVpnCoyMWehzE-5-ZGk7AUqsE5aqDEykU",
  authDomain: "ru-hacks.firebaseapp.com",
  databaseURL: "https://ru-hacks.firebaseio.com",
  projectId: "ru-hacks",
  storageBucket: "ru-hacks.appspot.com",
  messagingSenderId: "73932887478"  
  };
  firebase.initializeApp(config);

  $('.js-form').on('submit', event => {
    event.preventDefault();
    const firstname = $('#firstname').val();
    const lastname = $("#lastname").val();
    const email = $('#email').val();
    const gender = $('#gender').val();
    const schoolStatusIn = $('#school-status-in').val();
    const schoolStatusOut = $('#school-status-out').val();
    const schoolName = $('#school-name').val();
    const schoolNameOther = $('#schooll-name-other').val();
    









    firebase.database().ref('user_profiles').push({

    });
  });

});
