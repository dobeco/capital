const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    type: {
        type: String,
    },
    describe: {
        type: String,
    },

    income: {
        type: String,
        required: true
    },
    expend: {
        type: String,
        required: true
    },
    cash: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    }
  

})

module.exports = mongoose.model('profiles', schema)