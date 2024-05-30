const Resource = require('../models/resource');

const Status = require('../models/status');
const Leads = require('../models/leads');
const LeadHistories = require('../models/leadHistory');


module.exports.list = async (req, res, next) => {

    try {
        const list = await Resource.find();//.select('_id isDisabled name image');
        res.status(200).json({
            count: list.length,
            list: list
        })

    }
    catch (e) {

        res.status(400).json(e)
    }

}
module.exports.add = async (req, res, next) => {
    try {
        let name = req.body.name;
        let path = req.files[0].path;
        const resource = new Resource({
            name: name,
            image: path
        })
        await resource.save((err, result) => {
            if (err)
                return res.status(400).json({ err: err })
            else
                return res.status(201).json({ resource: result })
        })
    }
    catch (e) {
        res.status(400).json(e)
    }
}

module.exports.addResource = async (req, res, next) => {


    let { description, type, active } = req.body;

    try {


        let resource = new Resource({
            file_name: req.files[0].filename, description, type, active,
            created_on: Date.now(),
            updated_on: Date.now(),
            created_by: req.user.id
        })
        await resource.save();

        if (!resource)
            return res.status(404).json({ message: "no profile found" })
        return res.status(201).json({
            message: "Resource added successfully",
            resource: resource
        })
    }
    catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

module.exports.edit = async (req, res, next) => {


    let { description, type, active } = req.body;

    try {

        let id = req.body._id;
        Resource.findByIdAndUpdate(id, { $set: { description, type, active } }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "Resource updated successfully",
                    resource: result
                })
        })
    }
    catch (e) {
        console.log(e);
        res.status(400).json(e)
    }
}

module.exports.delete = async (req, res, next) => {
    try {
        let id = req.query.id;
        Resource.findByIdAndDelete({ _id: id }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else {
                if (result)
                    res.status(201).json({
                        message: "Resource deleted successfully",
                        result: result
                    })
                else {
                    res.status(404).json({ message: "can not find resource" })
                }
            }
        });
    }
    catch (e) {
        return res.status(400).json(e)
    }
}


