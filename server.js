const Rx = require('rxjs/Rx');
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');

const kweet_app = express();
kweet_app.use(bodyParser());

var database = mongojs('mongodb://127.0.0.1:27017/kwetter', ['kweets', 'users']);

kweet_app.get('/users/:username', (req, res) => {
    const username = req.params.username;

    getUserByUsername(username).subscribe((result) => {
        res.send(result);
    });
});

const getUserByUsername = (username) => Rx.Observable.fromPromise(new Promise((resolve, reject) => {
    database.users.findOne({ username: username }, (error, user) => {
        if (error) {
            resolve(error);
        }
        resolve(user);
    });
}));

kweet_app.post('/kweets/new', (req, res, next) => {
    const kweet = req.body.body ? req.body.body : req.body;

    createKweet(kweet).subscribe((createdKweet) => {
        res.send(createdKweet);
    });
});

const createKweet = (kweet) => Rx.Observable.fromPromise(new Promise((resolve, reject) => {
    database.kweets.save(kweet, (error, createdKweet) => {
        if (error) {
            resolve(error);
        }
        resolve(createdKweet);
    });
}));

kweet_app.get('/kweets/timeline/:userId/:offset/:amount', (req, res, next) => {
    const userId = req.params.userId;

    getKweets(userId).subscribe(timelineKweets => {
        res.send(timelineKweets);
    });
});

kweet_app.get('/kweets/profile/:userId/:offset/:amount', (req, res, next) => {
    const userId = req.params.userId;

    getKweets(userId).subscribe(userKweets => {
        res.send(userKweets);
    });
});

const getKweets = (userId) => Rx.Observable.fromPromise(new Promise((resolve, reject) => {
    database.kweets.find({ creatorId: Number(userId) }, (error, kweets) => {
        if (error) {
            resolve(error);
        }
        resolve(kweets);
    });
}));

const getFollowingUserIDs = (userId) => Rx.Observable.fromPromise(new Promise((resolve, reject) => {
    database.users.findOne({ _id: mongojs.ObjectId(userId) }, (error, user) => {
        if (error) {
            resolve(error);
        }
        resolve(user);
    });
}));

kweet_app.listen(8080, () => {
    console.log('Listening on port 8080');
});