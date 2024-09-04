const Profile = require('../models/user')

module.exports.get = async (req, res, next) => {
    try {
        const id = req.query.id;
        let profile = await Profile.findById(id).select('_id firstName lastName email role avatar leadFilters');
        if (!profile)
            return res.status(404).json({ message: "no profile found" })

        return res.status(201).json({ profile })
    }
    catch (e) {
        return res.status(400).json(e)
    }
}

module.exports.edit = async (req, res, next) => {
    try {
        const { id, firstName, lastName, email, leadFilters } = req.body;
        let profile = await Profile.findByIdAndUpdate(id, {
            $set: {
                firstName,
                lastName,
                email,
                leadFilters
            }
        }, { new: true })
        .select('_id firstName lastName email role');
        if (!profile)
            return res.status(404).json({ message: "no profile found" })
        return res.status(201).json({
            message: "Profile updated successfully",
            profile: profile
        })
    }
    catch (e) {
        return res.status(400).json(e)
    }
}
module.exports.editEmail = async (req, res, next) => {
    try {
        const { id, email } = req.body;
        let profile = await Profile.findOne({ email });
        if (profile) {
            return res.status(400).json({ message: "Email already exist" })
        } else {
            let profile = await Profile.findByIdAndUpdate(id, { $set: { email } }, { new: true }).select('_id firstName lastName email role avatar');
            if (!profile)
                return res.status(404).json({ message: "no profile found" })
            return res.status(200).json({
                message: "Profile updated successfully",
                profile: profile
            })
        }
    }
    catch (e) {
        return res.status(400).json(e)
    }
}
module.exports.setStatus = async (req, res, next) => {
    try {
       
        let lastConnected = new Date();
        Profile.findByIdAndUpdate(req.user.id, { $set: { lastConnected } }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "User status updated successfully",
                    profile: result
                })
        })
    }
    catch (e) {
       
        return res.status(400).json(e)
    }
}
module.exports.setLocation = async (req, res, next) => {
    try {
        let { longitude, latitude } = req.body;
        let lastPosition = new Date();
        let lastConnected = new Date();
        Profile.findByIdAndUpdate(req.user.id, { $set: { longitude, latitude, lastPosition, lastConnected } }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "User location updated successfully",
                    profile: result
                })
        })
    }
    catch (e) {
        return res.status(400).json(e)
    }
}
module.exports.uploadAvatar = async (req, res, next) => {
    try {
        let profile = await Profile.findByIdAndUpdate(req.user.id, {
            $set: {
                avatar: req.files[0].filename
            }
        }, { new: true }).select('_id firstName lastName email role avatar');
        if (!profile)
            return res.status(404).json({ message: "no profile found" })
        return res.status(201).json({
            message: "Avatar updated successfully",
            profile: profile
        })
    }
    catch (e) {
        return res.status(400).json(e)
    }
}
