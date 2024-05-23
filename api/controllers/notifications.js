const Notifications = require('../models/notifications');

module.exports.list = async (req, res, next) => {
    try {
        const list = await Notifications.find();
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
        const status = new Notifications({
            name: req.body.name,
            interval: req.body.interval,
            unit: req.body.unit,
            type: req.body.type,
            message: req.body.message,
            created_by: req.body.created_by,
            updated_on: Date.now(),
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
        let id = req.body.id;
        Notifications.findByIdAndUpdate(id, { $set: { 
            name: req.body.name,
            interval: req.body.interval,
            unit: req.body.unit,
            type: req.body.type,
            message: req.body.message,
            updated_on: Date.now(),
         } }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "Notification updated successfully",
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
        Notifications.findByIdAndDelete({ _id: id }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else {
                if (result)
                    res.status(201).json({
                        message: "Notification deleted successfully",
                        result: result
                    })
                else {
                    res.status(404).json({ message: "can not find notification" })
                }
            }
        });

    }
    catch (e) {
        return res.status(400).json(e)
    }
}