import * as firebase from "firebase";
import "firebase/database";
import "firebase/firebase-app";
import "firebase/firebase-firestore";
import "firebase/firebase-storage"

let config = {
    apiKey: "AIzaSyADHPF27NmjsCDQVSMHKc0PqbUiVVBf9q0",
    authDomain: "notepad-andrii-bilianskyi.firebaseapp.com",
    databaseURL: "https://notepad-andrii-bilianskyi-default-rtdb.firebaseio.com",
    projectId: "notepad-andrii-bilianskyi",
    storageBucket: "notepad-andrii-bilianskyi.appspot.com",
    messagingSenderId: "461405161826",
    appId: "1:461405161826:web:26e874b7e3a8433e87443b",
    measurementId: "G-QJ0CZ0WP7N"
};

firebase.initializeApp(config);

export default firebase.database();