// import { initializeApp } from '@firebase/app'
// import { getApps, getApp } from '@firebase/app'
// import { getFirestore } from "@firebase/firestore"
// import { getAuth, GoogleAuthProvider } from '@firebase/auth'
import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyC3veHATAeuQWCDwtG9iybwoxvw9Y1RFzg",
    authDomain: "whatsappclone-fe4e9.firebaseapp.com",
    projectId: "whatsappclone-fe4e9",
    storageBucket: "whatsappclone-fe4e9.appspot.com",
    messagingSenderId: "180323849546",
    appId: "1:180323849546:web:4b05f591488c3ac55f5db3"
};

const firebaseApp = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };
// const firebaseApp = !getApps().length
//     ? initializeApp(firebaseConfig)
//     : getApp()

// const db = getFirestore();
// const auth = getAuth();
// const provider = new GoogleAuthProvider();
// export { db, auth, provider }