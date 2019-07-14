const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    person: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('order', OrderSchema);