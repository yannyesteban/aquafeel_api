const Status = require('../models/status');
const Leads = require('../models/leads');
const LeadHistories = require('../models/leadHistory');


module.exports.list = async (req, res, next) => {
    try {
        const list = await Status.find().select('_id isDisabled name image');
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
        const status = new Status({
            name: name,
            image: path
        })
        await status.save((err, status) => {
            if (err)
                return res.status(400).json({ err: err })
            else
                return res.status(201).json({ status: status })
        })
    }
    catch (e) {
        res.status(400).json(e)
    }
}
module.exports.edit = async (req, res, next) => {
    try {
        let name = req.body.name;
        let path = req.body.image;
        if(Array.isArray(req.files)){
            if(req.files.length > 0){
                path = req.files[0].path;
            }
        }
        let id = req.body.id;
        Status.findByIdAndUpdate(id, { $set: { name, image: path } }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "Status updated successfully",
                    status: result
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
        const isLeadAvailable = await Leads.findOne({status_id: id});
        const isLeadHistoryAvailable = await LeadHistories.findOne({status_id: id});
        if(isLeadAvailable === null && isLeadHistoryAvailable === null){
            Status.findByIdAndDelete({ _id: id }, function (err, result) {
                if (err)
                    res.status(400).json(err)
                else {
                    if (result)
                        res.status(201).json({
                            message: "Status deleted successfully",
                            result: result
                        })
                    else {
                        res.status(404).json({ message: "can not find status" })
                    }
                }
            });
        }else{
            res.status(400).json({ message: "Can not delete this status as it's already in use." })
        }
    }
    catch (e) {
        return res.status(400).json(e)
    }

}

module.exports.enable = async (req, res, next) => {
    try{
        let id = req.query.id;
        let status = await Status.findOne({_id:id});
        let isDisabled = status.isDisabled;
        Status.findByIdAndUpdate(id, { $set: { isDisabled: !isDisabled } }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "Status updated successfully",
                    status: result
                })
        })
    }
    catch(e){
        return res.status(400).json(err)
    }
}