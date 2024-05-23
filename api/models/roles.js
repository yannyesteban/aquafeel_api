const mongoose = require('mongoose');

const rolesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }    
})


module.exports = mongoose.model("Roles",rolesSchema);
