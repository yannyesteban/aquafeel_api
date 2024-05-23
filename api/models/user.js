const mongoose = require('mongoose');
const shortid = require('shortid');

const usersSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    isBlocked:{
        type: Boolean,
        required : true,
        default : false
    },
    isVerified:{
        type: Boolean,
        default : false
    },
    assignedSellers: [{
        type: String,
        ref: "Users"
    }],
    role : {
        type: String,
        enum:['SELLER','ADMIN','MANAGER']
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    avatar: {
        type: String
    },
    leadFilters: {
        type: Object,
        default: null
    }      
},
{timestamps:true})


module.exports = mongoose.model("Users",usersSchema);
