const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    principleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Principle',
        required: true
    },
    customer: {
        type: String, 
        required: true
    },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
