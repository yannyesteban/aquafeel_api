const User = require("../models/user");
const Leads = require('../models/leads');
const LeadHistories = require('../models/leadHistory');
const Routes = require('../models/routes');
const Notifications = require('../models/notifications');

const bcrypt = require('bcryptjs');

module.exports.list = async (req, res, next) => {
    try {
        // let pageNo = parseInt(req.query.pageNo);
        let limit = parseInt(req.query.limit) || 10;
        let offset = parseInt(req.query.offset) || 0;
        let count = await User.count({})
        // let skip = (pageNo * limit) - limit
        // console.log(skip)
        let users = await User.aggregate([
            {
                $sort: {
                    createdAt: 1
                }
            },
            {
                $skip: offset
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    role: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    isBlocked: 1,
                    assignedSellers: 1,
                    isVerified: 1
                }
            }
        ]);
        res.status(200).json({
            count,
            users
        })
    }
    catch (e) {
        console.error(e)
        return res.status(400).json(e)
    }
}


module.exports.add = async (req, res, next) => {
    try {
        let { email, firstName, lastName, password, role, assignedSellers } = req.body;
        let userExist = await User.findOne({ email: email });
        if (userExist)
            return res.status(400).json({
                message: "email already exists"
            })

        if (password.length < 8)
            return res.status(400).json({ message: "password must be at least 8 characters long" })

        else {
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err)
                    return res.status(400).json({ message: "password error" })

                else {
                    let user = new User({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: hash,
                        role: role,
                        assignedSellers
                    })

                    await user.save(function (err, user) {
                        if (err)
                            return res.status(400).json(err)
                        else
                            return res.status(201).json({
                                message: "user saved successfully",
                                user: user
                            })

                    });

                }
            })
        }
    }
    catch (e) {
        console.log('inside catch block ==================', e)
        res.status(400).json(e)
    }
}


module.exports.edit = async (req, res, next) => {
    try {
        let { id, firstName, lastName, role, email, password, assignedSellers, isVerified } = req.body;
        if(password.length > 0){
            bcrypt.hash(password, 10, async function (err, hash) {
                User.findByIdAndUpdate(id, { $set: { firstname: firstName, lastName: lastName, email: email, role: role, password: hash, assignedSellers } }, { new: true }, function (err, result) {
                    if (err)
                        res.status(400).json(err)
                    else
                        res.status(201).json({
                            message: "User updated successfully",
                            user: result
                        })
                })
            })
        }else{
            User.findByIdAndUpdate(id, { $set: { 
                firstName, 
                lastName, 
                email, 
                role, 
                assignedSellers, 
                isVerified 
            } }, { new: true }, function (err, result) {
                if (err)
                    res.status(400).json(err)
                else
                    res.status(201).json({
                        message: "User updated successfully",
                        user: result
                    })
            })
        }
    }
    catch (e) {
        console.error(e)
        return res.status(400).json(e)
    }
}


module.exports.delete = async (req, res, next) => {
    try {
        let id = req.query.id;
        User.findByIdAndDelete({ _id: id }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else {
                if (result)
                    res.status(201).json({
                        message: "User deleted successfully",
                        result: result
                    })
                else {
                    res.status(404).json({ message: "can not find user" })
                }
            }
        });
    }
    catch (e) {
        return res.status(400).json(e)
    }
}


module.exports.block = async (req, res, next) => {
    try {
        let id = req.query.id;
        let user = await User.findOne({ _id: id });
        let isBlocked = user.isBlocked;
        User.findByIdAndUpdate(id, { $set: { isBlocked: !isBlocked } }, { new: true }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({
                    message: "User updated successfully",
                })
        })


    }
    catch (e) {
        return res.status(400).json(err)
    }
}

module.exports.details = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.query.id });
        res.status(200).json(user)
    } catch (e) {
        console.error(e)
        return res.status(400).json(e)
    }
}

module.exports.listAllSellers = async (req, res, next) => {
    try {
        let cond = {};
        if(req.user.role === "MANAGER"){
            const userInfo = await User.findById(req.user.id);
            cond = {'_id': { $in: [...userInfo.assignedSellers, req.user.id]}}
        }
        const users = await User
        // .find({role: "SELLER"})
        .find(cond)
        .select("_id firstName lastName role avatar longitude latitude createdAt updatedAt")
        .sort({ created_on: 1 });
        res.status(200).json({users})
    }
    catch (e) {
        console.error(e)
        return res.status(400).json(e)
    }
}
module.exports.getLeadsCount = async (req, res, next) => {
    try {
        const leadsCount = await Leads.count({created_by: req.query.id});
        res.status(200).json({leadsCount});
    }
    catch (e) {
        console.error(e)
        return res.status(400).json(e)
    }
}
module.exports.deleteAllRecord = async (req, res, next) => {
    try {
        let id = req.query.id;
        await Leads.deleteMany({ created_by: id });
        await LeadHistories.deleteMany({ created_by: id });
        await Routes.deleteMany({ created_by: id });

        User.findByIdAndDelete({ _id: id }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else {
                if (result)
                    res.status(201).json({
                        message: "User deleted successfully",
                        result: result
                    })
                else {
                    res.status(404).json({ message: "can not find user" })
                }
            }
        });
    }
    catch (e) {
        return res.status(400).json(e)
    }
}
module.exports.reassignAndDelete = async (req, res, next) => {
    try {
        let id = req.query.id;
        let assign_to = req.query.assign_to;
        await Leads.find({ 'created_by': id }).updateMany({$set: { created_by: assign_to }})
        await LeadHistories.find({ 'created_by': id }).updateMany({$set: { created_by: assign_to }})
        await Routes.find({ 'created_by': id }).updateMany({$set: { created_by: assign_to }})

        User.findByIdAndDelete({ _id: id }, function (err, result) {
            if (err)
                res.status(400).json(err)
            else {
                if (result)
                    res.status(201).json({
                        message: "User deleted successfully",
                        result: result
                    })
                else {
                    res.status(404).json({ message: "can not find user" })
                }
            }
        });
    }
    catch (e) {
        return res.status(400).json(e)
    }
}