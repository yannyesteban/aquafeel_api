const Notifications = require('../models/notifications');

module.exports.list = async (req, res, next) => {
    console.log(req.query.user_id)
    try {
        const list = await Notifications.find({
			created_by: req.query.user_id
		});
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
    console.log(req.body)
    try {
        const status = new Notifications({
            name: req.body.name,
            interval: req.body.interval,
            unit: req.body.unit,
            type: req.body.type,
            message: req.body.message,
            created_by: req.body.created_by,
            is_active: req.body.is_active,
            repeats: req.body.repeats,
            updated_on: Date.now(),
            datetime: req.body.datetime,
        })
        await status.save((err, status) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ err: err })
            }
            else {
                console.log({ status: status })
                return res.status(201).json({ notification: status })
            }
        })
    }
    catch (e) {
        res.status(400).json(e)
    }
}
module.exports.edit = async (req, res, next) => {
    try {
        console.log( req.body)
        let id = req.body._id;
        Notifications.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                interval: req.body.interval,
                unit: req.body.unit,
                type: req.body.type,
                message: req.body.message,
                is_active: req.body.is_active,
                repeats: req.body.repeats,
                updated_on: Date.now(),
                datetime: req.body.datetime,
            }
        }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "Notification updated successfully",
                    notification: result
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
                        notification: result
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