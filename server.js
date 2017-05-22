const Rx = require('rxjs/Rx');

const express = require('express');

const kweet_app = express();
const bodyParser = require('body-parser');
kweet_app.use(bodyParser());

// MongoDB
const mongojs = require('mongojs');
var db = mongojs('mongodb://127.0.0.1:27017/kwetter', ['kweets', 'users']);

kweet_app.post('/kweets/new', (req, res, next) => {
    const kweet = req.body;

    db.kweets.save(kweet, (error, newKweet) => {
        if (error) {
            res.send(err);
        } else {
            res.json(newKweet);
        }
    });
});

kweet_app.get('/kweets/timeline', (req, res, next) => {
    console.log("timeline kweets");
});

kweet_app.get('/kweets/profile', (req, res, next) => {
    console.log("profile kweets");
});

const getFollowingUserIDs = (userId) => Rx.Observable.fromPromise(new Promise((resolve, reject) => {
    db.users.findOne({ _id: mongojs.ObjectId(userId) }, (err, user) => {
        if (err) {
            resolve(err);
        }
        resolve(JSON.parse(user));
    });
}));

kweet_app.listen(8080, () => {
    console.log('Listening on port 8080');
});