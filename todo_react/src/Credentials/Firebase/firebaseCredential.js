import firebase from "firebase";
import { apiKey, appId, authDomain, databaseURL, measurementId, messagingSenderId, projectId, storageBucket } from "../../Environment";

firebase.initializeApp({
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
}); 

export default firebase