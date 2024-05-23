const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const leadsSchema = mongoose.Schema({
    business_name: {
        type: String,
    },
    first_name: {
        type: String,
    },  
    last_name: {
        type: String,
    },       
    phone: {
        type: String,
    },
    phone2: {
        type: String,
    },
    email: {
        type: String,
    },
    street_address: {
        type: String,
    },
    apt: {
        type: String,
    },       
    city: {
        type: String,
    },
    state: {
        type: String,
    },    
    zip: {
        type: String,
    },
    country: {
        type: String,
    },
    longitude: {
        type: String,
    },
    latitude: {
        type: String,
    },
    appointment_date: {
        type: Date
    },
    appointment_time:{
        type: String
    },
    status_id:{
        type: Schema.Types.ObjectId,
        ref: "Status",
        required: true
    },
    note:{
        type: String,
    },
    owned_by:{
        type: String,
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
    updated_on:{
        type: Date,
        required: true
    },
    favorite:{
        type: Boolean
    }     
})


module.exports = mongoose.model("Leads",leadsSchema);
