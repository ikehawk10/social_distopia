const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();

admin.initializeApp();

app.get('/screams', (req, res) => {
  admin.firestore()
    .collection('screams')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push(doc.data());
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
  

exports.api = functions.https.onRequest(app);