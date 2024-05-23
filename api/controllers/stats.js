const Status = require('../models/status');
const Leads = require('../models/leads');
const LeadHistories = require('../models/leadHistory');
const Users = require('../models/user');


module.exports.list = async (req, res, next) => {


    try {
        let limit = parseInt(req.query.limit) || 1000;
        let offset = parseInt(req.query.offset) || 0;
        let matchCond = {};
        let pipeline = [];

        
        pipeline.push({ $match: matchCond });

        pipeline.push({
            $lookup: {
                from: "leadhistories",
                localField: "_id",
                foreignField: "created_by",
                as: "leadHistories"
            }
        });

        pipeline.push({
            $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                stats: {
                    $arrayToObject: {
                        $map: {
                            input: ["UC", "NI", "INST", "INGL", "RENT", "R", "APPT", "DEMO", "WIN", "NHO", "SM", "MYCL"],
                            as: "status",
                            in: {
                                k: "$$status",
                                v: {
                                    $size: {
                                        $filter: {
                                            input: "$leadHistories",
                                            as: "lead",
                                            cond: { $eq: ["$$lead.status_id.name", "$$status"] }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        pipeline.push({ $skip: offset });
        pipeline.push({ $limit: limit });

        const users = await Users.aggregate(pipeline);
        const count = await Users.countDocuments(matchCond);

        const prettyJSON = JSON.stringify(users, null, 2)

        console.log(prettyJSON)

        //console.log({ users, count })
        //res.status(200).json({ users, count });
    } catch (e) {
       // res.status(400).json(e);
    }



    try {
        let limit = parseInt(req.query.limit) || 10;
        let offset = parseInt(req.query.offset) || 0;
        let cond = {};
        if(req.user.role === "MANAGER"){
            const userInfo = await Users.findById(req.user.id);
            cond = {'_id': { $in: userInfo.assignedSellers}}
        }
        let count = await Users.count(cond)
        const users = await Users.find(cond)
            .select("_id firstName lastName role createdAt updatedAt")
            .limit(limit)
            .skip(offset)
            .sort({ created_on: 1 });
        if(Array.isArray(users)){
            let UC_count = 0;
            let NI_count = 0;
            let INST_count = 0;
            let INGL_count = 0;
            let RENT_count = 0;
            let R_count = 0;
            let APPT_count = 0;
            let DEMO_count = 0;
            let WIN_count = 0;
            let NHO_count = 0;
            let SM_count = 0;
            let MYCL_count = 0;

            let stats = [];
            for(let i=0; i< users.length ; i++){
                let leadHistories = await LeadHistories.find({created_by: users[i]._id}).populate("status_id");
                UC_count = leadHistories.filter(history => history.status_id.name === "UC").length;
                NI_count = leadHistories.filter(history => history.status_id.name === "NI").length;
                INST_count = leadHistories.filter(history => history.status_id.name === "INST").length;
                INGL_count = leadHistories.filter(history => history.status_id.name === "INGL").length;
                RENT_count = leadHistories.filter(history => history.status_id.name === "RENT").length;
                R_count = leadHistories.filter(history => history.status_id.name === "R").length;
                APPT_count = leadHistories.filter(history => history.status_id.name === "APPT").length;
                DEMO_count = leadHistories.filter(history => history.status_id.name === "DEMO").length;
                WIN_count = leadHistories.filter(history => history.status_id.name === "WIN").length;
                NHO_count = leadHistories.filter(history => history.status_id.name === "NHO").length;
                SM_count = leadHistories.filter(history => history.status_id.name === "SM").length;
                MYCL_count = leadHistories.filter(history => history.status_id.name === "MYCL").length;
                stats.push({
                    ...users[i]._doc,
                    stats:{
                        UC_count,
                        NI_count,
                        INST_count,
                        INGL_count,
                        RENT_count,
                        R_count,
                        APPT_count,
                        DEMO_count,
                        WIN_count,
                        NHO_count,
                        SM_count,
                        MYCL_count
                    }
                })
            }
            res.status(200).json({
                stats,
                count
            })
        }else{
            res.status(200).json({
                users: [],
                count: 0
            })
        }
    }
    catch (e) {
        res.status(400).json(e)
    }
}
