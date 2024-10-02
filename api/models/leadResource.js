const mongoose = require('mongoose'),
    Schema = mongoose.Schema;;

const resource = mongoose.Schema({
    lead_id:{
        type: Schema.Types.ObjectId,
        ref: "Leads",
        required: true
    },
    file_name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
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


module.exports = mongoose.model("leadResource", resource);
