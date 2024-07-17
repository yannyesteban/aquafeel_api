const mongoose = require('mongoose'),
    Schema = mongoose.Schema;;

const brand = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        ref: "Users",
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedOn: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model("Brands", brand);
