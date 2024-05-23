const mongoose = require('mongoose'),
    Schema = mongoose.Schema;;

const leadHistorySchema = mongoose.Schema({
    lead_id:{
        type: Schema.Types.ObjectId,
        ref: "Leads",
        required: true
    },
    status_id:{
        type: Schema.Types.ObjectId,
        ref: "Status",
        required: true
    },
    first_name: {
        type: String,
    },  
    last_name: {
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
    note: {
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
    }    
})


module.exports = mongoose.model("LeadHistories",leadHistorySchema);
