import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAoq7BYQfe6ZSeIvpjT_wFAswU-CHanWjA",
  authDomain: "bean-tracker-1020e.firebaseapp.com",
  projectId: "bean-tracker-1020e",
  storageBucket: "bean-tracker-1020e.appspot.com",
  messagingSenderId: "602819306670",
  appId: "1:602819306670:web:2599e347f43c7b5d86393f"
};
  // init firebase
  firebase.initializeApp(firebaseConfig)

  // init services
  const projectFirestore = firebase.firestore()
  const projectAuth = firebase.auth()

  export { projectFirestore, projectAuth }