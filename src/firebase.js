import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

const app = firebase.initializeApp({
  apiKey: "AIzaSyCEQ6_bLHv7ma4J4eg0lKSJD5yDKkDVNGI",
  authDomain: "ddg-law.firebaseapp.com",
  databaseURL: "https://ddg-law.firebaseio.com",
  projectId: "ddg-law",
  storageBucket: "ddg-law.appspot.com",
  messagingSenderId: "103277645788",
  appId: "1:103277645788:web:e3e67a1e9f85dac022c919",
})

export const auth = app.auth()
export const database = app.firestore()
export default app

// apiKey: process.env.REACT_APP_NOTARY_API_KEY,
//   authDomain: process.env.REACT_APP_NOTARY_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_NOTARY_DATABASE_URL,
//   projectId: process.env.REACT_APP_NOTARY_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_NOTARY_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_NOTARY_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_NOTARY_APP_ID,
