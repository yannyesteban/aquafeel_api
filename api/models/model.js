const mongoose = require('mongoose'),
    Schema = mongoose.Schema;;

const model = mongoose.Schema({

    brand:{
        type: Schema.Types.ObjectId,
        ref: "Brands",
        required: false
    },
    name: {
        type: String,
        required: false
    },
    createdBy: {
        type: String,
        ref: "Users",
        required: false
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: false
    },
    updatedOn: {
        type: Date,
        required: false
    }
})


module.exports = mongoose.model("Models", model);
