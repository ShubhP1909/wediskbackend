const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");

// const db = 'mongodb://localhost:27017/Wediscover'
const db = 'mongodb://127.0.0.1:27017/Wediscover'


mongoose.connect(db, err => {
    if (err) {
        console.error('Error' + err);
    } else {
        console.log("server connected to database");
    }
})

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized token')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorized user not find')
    }
    // let payload = jwt.verify(token, 'secretKey')
    // if (!payload) {
    //     return res.status(401).send('Unauthorized payload')
    // }
    // req.userId = payload.subject
    // next()

    try {
        let payload = jwt.verify(token, 'secretKey')
        req.userId = payload.subject
        next()

    } catch (err) {
        return res.status(401).send('Unauthorized request')
    }
}

router.get('/', (req, res) => {
    res.send("api data fetch work");
});

router.post('/signup', (req, res) => {
    let userData = req.body
    let user = new User(userData)
    user.save((error, regesteredUser) => {
        if (error) {
            console.log(error);
        } else {
            let payload = { subject: regesteredUser.id }
            let token = jwt.sign(payload, "secretKey")
            res.status(200).send({ token });
        }
    })
})

router.post('/login', (req, res) => {
    let userData = req.body

    User.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            if (!user) {
                res.status(401).send("Invalid mail")
            } else {
                if (user.password !== userData.password) {
                    res.status(401).send("Invalid Password")
                } else {
                    let payload = { subject: user.id }
                    let token = jwt.sign(payload, "secretKey")
                    res.status(200).send({ token });
                    console.log("user Login successFully!");
                }
            }
        }
    })
})

// router.get('/WeMeet', verifyToken, (req, res) => {
//     let admin = ""

//     res.json(admin);
// })

module.exports = router;