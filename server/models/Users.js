const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String, 
    },
    password: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    }
     
})

module.exports = mongoose.model('users', schema)