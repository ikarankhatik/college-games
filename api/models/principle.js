const mongoose = require('mongoose');

const principleSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },    
});


const Principle = mongoose.model('Principle', principleSchema);
module.exports = Principle;