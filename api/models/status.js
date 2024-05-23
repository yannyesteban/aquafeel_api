const mongoose = require('mongoose');

const statusSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        required: true
    }    
})


module.exports = mongoose.model("Status",statusSchema);
