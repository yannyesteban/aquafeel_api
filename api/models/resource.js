const mongoose = require('mongoose'),
    Schema = mongoose.Schema;;

const resource = mongoose.Schema({
    file_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    created_by: {
        type: String,
        ref: "Users",
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_on: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model("resource", resource);
