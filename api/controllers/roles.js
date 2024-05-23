const mongoose = require("mongoose");
const Role = require('../models/roles');



module.exports.list = async (req, res, next) => {
    try {
        const roles = await Role.find().select('_id name');
        res.status(200).json({
            roles: roles
        })
    }

    catch (e) {
        res.status(400).json(e)
    }
}


module.exports.add = async (req, res, next) => {
    try {
        let { name } = req.body;
        let role = new Role({
            name: name
        })

        await role.save();
       
        res.status(201).json(role)
    }
    catch (e) {
        res.status(400).json(e)
    }
}


module.exports.edit = async (req, res, next) => {
    try {
        let { id, name } = req.body;
        let role = await Role.findByIdAndUpdate(id, { $set: { name: name } }, { new: true })
        res.status(201).json(role)
    }
    catch (e) {
        res.status(400).json(e)
    }

}


module.exports.delete = async (req, res, next) => {
    let id = req.query.id;
    let deletedRole = await Role.deleteOne({ _id: id });
    if (deletedRole.deletedCount > 0) {
        res.status(201).json({
            message: "role deleted successfully"
        })
    }
    else {
        res.status(404).json({
            message: "no role found"
        })
    }

}



