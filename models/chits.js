// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create Schema for member
var memberSchema = new Schema({
    name:  {
        type: String,
        required: true
    }
});

// create montlydata for chit
var monthDataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    bidAmount: {
        type: Number,
        default: 0
    },
    
    bidder: {
        type: String,
        default: ""
    },
    
    paid: [{type: Boolean, default: false}]
});

// create a schema
var chitSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    
    startDate: {
        type: String
    },
    
    months: {
        type: Number,
        min: 12,
        max: 60
    },
    
    chitValue: {
        type: Number,
        min: 10000,
        max: 1000000
    },
    
    members: [memberSchema],
    dataByMonth: [monthDataSchema]
});

// the schema is useless so far
// we need to create a model using it
var Chits = mongoose.model('Chit', chitSchema);

// make this available to our Node applications
module.exports = Chits;