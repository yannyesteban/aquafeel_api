const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const notificationsSchema = mongoose.Schema({
    name: {
        type: String
    },
    interval: {
        type: Number
    },
    unit: {
        type: String
    },
    type: {
        type: String
    },
    message: {
        type: String
    },
    created_by:{
        type: String,
        ref: "Users",
        required: true
    },
    created_on:{
        type: Date,
        default: Date.now
    },
    datetime:{
        type: Date,
        default: Date.now
    },
    is_active:{
        type: Boolean,
        default: false
    },
    repeats:{
        type: Boolean,
        default: false
    },
    updated_on:{
        type: Date,
        required: true
    }    
})


module.exports = mongoose.model("Notifications",notificationsSchema);
