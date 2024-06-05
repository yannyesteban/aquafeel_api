const Status = require("../models/status");
const Leads = require("../models/leads");
const LeadHistories = require("../models/leadHistory");
const Users = require("../models/user");


module.exports.leadsByDate = async (req, res, next) => {
  const {
    userId = null
  } = req.query
  let pipeline = []



  try {
    const data = await LeadHistories.aggregate(pipeline);
    res.status(200).json({
      data,
      count: data.length,
    });
  } catch (e) {
    res.status(400).json(e);
  }

}

module.exports.statsMain = async (req, res, next) => {

  const {
    userId = null
  } = req.query

  let pipeline = []


  if (req.user.role === "MANAGER") {
    const userInfo = await Users.findById(req.user.id);
    pipeline.push({
      $match: {
        created_by: { $in: userInfo.assignedSellers }
      }
    })
  } else if (userId !== null) {

    pipeline.push({
      $match: {
        created_by: userId
      }
    })
  }


  pipeline = [...pipeline,
  {
    $lookup: {
      from: "status", // Nombre de la colección de status
      localField: "status_id",
      foreignField: "_id",
      as: "status_info",
    },
  },
  {
    $lookup: {
      from: "users", // Nombre de la colección de usuarios
      localField: "created_by",
      foreignField: "_id",
      as: "user_info",
    },
  },
  {
    $unwind: "$status_info", // Desenrollar status_info array para acceder a los campos
  },
  {
    $unwind: "$user_info", // Desenrollar user_info array para acceder a los campos
  },
  {
    $group: {
      _id: {
        user_id: "$created_by",
        status_id: "$status_info._id", // Usamos el _id del status_info
        name: "$status_info.name",
      },
      count: { $sum: 1 },
      user_name: { $first: "$user_info.firstName" }, // Obtener el nombre del usuario

      firstName: { $first: "$user_info.firstName" },
      lastName: { $first: "$user_info.lastName" },
      role: { $first: "$user_info.role" },
      createdAt: { $first: "$user_info.createdAt" },
      updatedAt: { $first: "$user_info.updatedAt" },
    },
  },
  {
    $group: {
      _id: "$_id.user_id",
      user_name: { $first: "$user_name" }, // Tomar el nombre del usuario del paso anterior
      firstName: { $first: "$firstName" },
      lastName: { $first: "$lastName" },
      role: { $first: "$role" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
      stats: {
        $push: {
          name: "$_id.name",
          count: "$count",
        },
      },
    },
  },
  {
    $project: {
      _id: "$_id",
      id: "$_id",
      name: "$user_name",
      firstName: "$firstName",
      lastName: "$lastName",
      role: "$role",
      createdAt: "$createdAt",
      updatedAt: "$updatedAt",
      stats: 1,
    },
  },
  {
    $sort: {
      "firstName": 1 // Orden ascendente por nombre de usuario
    }
  }
  ];

  

  try {
    const data = await LeadHistories.aggregate(pipeline);
    res.status(200).json({
      data,
      count: data.length,
    });
  } catch (e) {
    res.status(400).json(e);
  }
};

module.exports.list = async (req, res, next) => {
  
  try {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
    let cond = {};
    if (req.user.role === "MANAGER") {
      const userInfo = await Users.findById(req.user.id);
      cond = { _id: { $in: userInfo.assignedSellers } };
    }
    let count = await Users.count(cond);
    const users = await Users.find(cond)
      .select("_id firstName lastName role createdAt updatedAt")
      .limit(limit)
      .skip(offset)
      .sort({ created_on: 1 });
    if (Array.isArray(users)) {
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
      for (let i = 0; i < users.length; i++) {
        let leadHistories = await LeadHistories.find({
          created_by: users[i]._id,
        }).populate("status_id");
        UC_count = leadHistories.filter(
          (history) => history.status_id.name === "UC"
        ).length;
        NI_count = leadHistories.filter(
          (history) => history.status_id.name === "NI"
        ).length;
        INST_count = leadHistories.filter(
          (history) => history.status_id.name === "INST"
        ).length;
        INGL_count = leadHistories.filter(
          (history) => history.status_id.name === "INGL"
        ).length;
        RENT_count = leadHistories.filter(
          (history) => history.status_id.name === "RENT"
        ).length;
        R_count = leadHistories.filter(
          (history) => history.status_id.name === "R"
        ).length;
        APPT_count = leadHistories.filter(
          (history) => history.status_id.name === "APPT"
        ).length;
        DEMO_count = leadHistories.filter(
          (history) => history.status_id.name === "DEMO"
        ).length;
        WIN_count = leadHistories.filter(
          (history) => history.status_id.name === "WIN"
        ).length;
        NHO_count = leadHistories.filter(
          (history) => history.status_id.name === "NHO"
        ).length;
        SM_count = leadHistories.filter(
          (history) => history.status_id.name === "SM"
        ).length;
        MYCL_count = leadHistories.filter(
          (history) => history.status_id.name === "MYCL"
        ).length;
        stats.push({
          ...users[i]._doc,
          stats: {
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
            MYCL_count,
          },
        });
      }
      res.status(200).json({
        stats,
        count,
      });
    } else {
      res.status(200).json({
        users: [],
        count: 0,
      });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
