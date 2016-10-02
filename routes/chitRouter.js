var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Chits = require('../models/chits');
var Verify = require('./verify');

var chitRouter = express.Router();
chitRouter.use(bodyParser.json());

chitRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.find({}, function (err, chit) {
        if (err) throw err;
        res.json(chit);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.create(req.body, function (err, chit) {
        if (err) throw err;
        console.log('Chit created!');
        var id = chit._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Chit with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

chitRouter.route('/:chitId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.findById(req.params.chitId, function (err, chit) {
        if (err) throw err;
        res.json(chit);
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.findByIdAndUpdate(req.params.chitId, {
        $set: req.body
    }, {
        new: true
    }, function (err, chit) {
        if (err) throw err;
        res.json(chit);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.findByIdAndRemove(req.params.chitId, function (err, resp) {        
        if (err) throw err;
        res.json(resp);
    });
});

chitRouter.route('/:chitId/members')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.findById(req.params.chitId, function (err, chit) {
        if (err) throw err;
        res.json(chit.members);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.findById(req.params.chitId, function (err, chit) {
        if (err) throw err;
        chit.members.push(req.body);
        chit.save(function (err, chit) {
            if (err) throw err;
            console.log('Updated Chit members!');
            res.json(chit);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Chits.findById(req.params.chitId, function (err, chit) {
        if (err) throw err;
        for (var i = (chit.members.length - 1); i >= 0; i--) {
            chit.members.id(chit.members[i]._id).remove();
        }
        chit.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all members!');
        });
    });
});

module.exports = chitRouter;