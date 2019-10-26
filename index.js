const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

const firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyC537rBkgKOFlEnyY-hZa8EHKNdkVuSHbw",
  authDomain: "social-distopia.firebaseapp.com",
  databaseURL: "https://social-distopia.firebaseio.com",
  projectId: "social-distopia",
  storageBucket: "social-distopia.appspot.com",
  messagingSenderId: "262282507498",
  appId: "1:262282507498:web:62c73aa8c9ca2b5ae75393"
};

firebase.initializeApp(firebaseConfig);

admin.initializeApp();

app.get('/screams', (req, res) => {
  admin.firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      })
      return res.json(screams);
    })
    .catch(err => console.log(err));
});

app.post('/scream', (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed'})
  }
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  }    

  admin.firestore()
    .collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully`});
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong'});
      console.error(err);
    })
});

app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle 
  }

  firebase.auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return res.status(201).json({ message: `user ${data.user.uid} signed up successfully!`})
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
})
  

exports.api = functions.https.onRequest(app);