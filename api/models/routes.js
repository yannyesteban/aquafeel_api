const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const routeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },  
    starting_address: {
        type: String,
        required: true,
    },
    starting_address_long: {
        type: String,
    },
    starting_address_lat: {
        type: String,
    },
    ending_address: {
        type: String,
        required: true,
    },
    ending_address_long: {
        type: String,
    },
    ending_address_lat: {
        type: String,
    },
    created_by: {
        type: String,
        ref: "Users",
        required: true
    },
    leads: [
        {
            type: Schema.ObjectId,
            require: true,
            ref: "Leads"
        }
    ],
    created_on:{
        type: Date,
        default: Date.now
    },
    updated_on:{
        type: Date,
        required: true
    }  
})


module.exports = mongoose.model("Routes",routeSchema);
