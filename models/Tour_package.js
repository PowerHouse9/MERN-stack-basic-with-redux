const mongoose = require('mongoose');

const TourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    days: {
        type: String,
        required: true
    },
    agent_email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('tour_Package', TourSchema);