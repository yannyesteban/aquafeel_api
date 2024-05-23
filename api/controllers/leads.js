const mongoose = require("mongoose");
const Leads = require('../models/leads');
const LeadHistories = require('../models/leadHistory');
const Status = require('../models/status');
const User = require('../models/user');
const fetch = require("node-fetch");
const csvFilePath = 'leads.csv'
const csv = require('csvtojson')
const moment = require('moment')
const {generateDateRange} = require("../utils/index");

module.exports.list = async (req, res, next) => {
	try {
		const {
			field,
			fromDate,
			toDate,
			status_id,
			limit = 10,
			offset = 0,
			search_key,
			search_value,
			quickDate
		} = req.query

		let cond = {
			created_by: req.query.user_id
		};
		if (req.query.today === "true") {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			cond.created_on = {
				$gte: today
			}
		}
		//search
		if (search_key === "all") {
			cond = {
				...cond,
				$or: [{
					first_name: new RegExp(`${search_value}`, 'i')
				}, {
					last_name: new RegExp(`${search_value}`, 'i')
				}, {
					street_address: new RegExp(`${search_value}`, 'i')
				}, {
					state: new RegExp(`${search_value}`, 'i')
				}, {
					city: new RegExp(`${search_value}`, 'i')
				}, {
					zip: new RegExp(`${search_value}`, 'i')
				}]
			}
		} else if (search_key && search_value) {
			cond = {
				...cond,
				[search_key]: new RegExp(`${search_value}`, 'i')
			};
		}

		//filter
		if (status_id) {
			cond = {
				...cond,
				status_id: { $in: status_id.split(",") }
			}
		}
		if (field && quickDate !== "all_time") {
			const {_fromDate, _toDate} = generateDateRange(quickDate, fromDate, toDate)
			cond[field] = {
				$gte: _fromDate,
				$lte: _toDate
			}
		}
		const count = await Leads.count(cond)
		const leads = await Leads.find(cond)
			.limit(parseInt(limit))
			.skip(parseInt(offset))
			.sort({ created_on: -1, _id: -1 })
			.populate("status_id");
		res.status(200).json({
			leads,
			count
		})
	}
	catch (e) {
		res.status(400).json(e)
	}
}

module.exports.listAll = async (req, res, next) => {
	try {
		const {
			field,
			fromDate,
			toDate,
			status_id,
			owner_id,
			limit = 10,
			offset = 0,
			search_key,
			search_value,
			quickDate
		} = req.query

		console.log("..... list All")
		let cond = {};
		if (req.user.role === "MANAGER") {
			const userInfo = await User.findById(req.user.id);
			cond = { created_by: { $in: userInfo.assignedSellers } }
		}

		//search
		if (search_key === "all") {
			cond = {
				...cond,
				$or: [{
					first_name: new RegExp(`${search_value}`, 'i')
				}, {
					last_name: new RegExp(`${search_value}`, 'i')
				}, {
					street_address: new RegExp(`${search_value}`, 'i')
				}, {
					state: new RegExp(`${search_value}`, 'i')
				}, {
					city: new RegExp(`${search_value}`, 'i')
				}, {
					zip: new RegExp(`${search_value}`, 'i')
				}, {
					owned_by: new RegExp(`${search_value}`, 'i')
				}]
			}
		} else if (search_key && search_value) {
			cond = {
				...cond,
				[search_key]: new RegExp(`${search_value}`, 'i')
			};
		}

		//filter
		if (status_id) {
			cond = {
				...cond,
				status_id: { $in: status_id.split(",") }
			}
		}
		if (field && quickDate !== "all_time") {
			const {_fromDate, _toDate} = generateDateRange(quickDate, fromDate, toDate)
			cond[field] = {
				$gte: _fromDate,
				$lte: _toDate
			}
		}
		if (owner_id) {
			cond = {
				...cond,
				created_by: owner_id.split(",")
			}
		}
		let count = await Leads.count(cond)
		const leads = await Leads.find(cond)
			.limit(parseInt(limit))
			.skip(parseInt(offset))
			.sort({ created_on: -1, _id: -1 })
			.populate("status_id created_by");
		res.status(200).json({
			leads,
			count
		})
	}
	catch (e) {
		console.log(e)
		res.status(400).json(e)
	}
}

module.exports.listByStatus = async (req, res, next) => {
	try {
		let cond = {};
		if (req.body.status_id.length > 0) {
			cond = {
				status_id: { $in: req.body.status_id },
				created_by: req.body.user_id
			}
		} else {
			cond = {
				created_by: req.body.user_id
			}
		}
		const leads = await Leads.find(cond).populate("status_id");
		res.status(200).json({
			leads
		})
	}
	catch (e) {
		res.status(400).json(e)
	}
}

module.exports.listByMonth = async (req, res, next) => {
	try {
		const leads = await Leads.find({
			"appointment_date": {
				"$gte": req.body.date_start,
				"$lte": req.body.date_end
			},
			created_by: req.body.user_id
		});
		res.status(200).json({
			leads
		})
	}
	catch (e) {
		res.status(400).json(e)
	}
}

module.exports.details = async (req, res, next) => {
	try {
		let lead = await Leads.findOne({ _id: req.query.id }).populate("status_id");
		let leadHistory = await LeadHistories.find({ lead_id: req.query.id }).populate("status_id");
		lead = { ...lead._doc, history: leadHistory };

		res.status(200).json({
			lead
		})
	}

	catch (e) {
		res.status(400).json(e)
	}
}

module.exports.add = async (req, res, next) => {
	try {
		let { business_name, first_name, last_name, phone, phone2, email, street_address, apt, city, state, zip, country, longitude, latitude, appointment_date, appointment_time, status_id, owned_by, user_id, note } = req.body;
		let lead = new Leads({
			business_name,
			first_name,
			last_name,
			phone,
			phone2,
			email,
			street_address,
			apt,
			city,
			state,
			zip,
			country,
			longitude,
			latitude,
			appointment_date,
			appointment_time,
			status_id,
			note,
			owned_by,
			created_on: Date.now(),
			updated_on: Date.now(),
			created_by: user_id
		})
		await lead.save();
		let leadHistory = new LeadHistories({
			lead_id: lead._id,
			first_name,
			last_name,
			street_address,
			apt,
			city,
			state,
			zip,
			country,
			status_id,
			note,
			created_on: Date.now(),
			updated_on: Date.now(),
			created_by: user_id
		})
		await leadHistory.save();
		res.status(201).json(lead)
	}
	catch (e) {
		console.log(e);
		res.status(400).json(e)
	}
}


module.exports.edit = async (req, res, next) => {
	try {
		let { business_name, first_name, last_name, phone, phone2, email, street_address, apt, city, state, zip, country, longitude, latitude, appointment_date, appointment_time, status_id, owned_by, id, note, user_id } = req.body;
		let lead = await Leads.findByIdAndUpdate(id, {
			$set: {
				business_name,
				first_name,
				last_name,
				phone,
				phone2,
				email,
				street_address,
				apt,
				city,
				state,
				zip,
				country,
				longitude,
				latitude,
				appointment_date,
				appointment_time,
				status_id,
				note,
				owned_by,
				created_by: user_id
			}
		}, { new: true })
		let leadHistory = new LeadHistories({
			lead_id: id,
			first_name,
			last_name,
			street_address,
			apt,
			city,
			state,
			zip,
			country,
			status_id,
			note,
			updated_on: Date.now(),
			created_by: user_id
		})
		await leadHistory.save();
		res.status(201).json(lead)
	}
	catch (e) {
		console.log(e);
		res.status(400).json(e)
	}

}


module.exports.delete = async (req, res, next) => {
	let id = req.query.id;
	let deletedLead = await Leads.deleteOne({ _id: id });
	await LeadHistories.deleteMany({ lead_id: id });
	if (deletedLead.deletedCount > 0) {
		res.status(200).json({
			message: "Lead deleted successfully"
		})
	}
	else {
		res.status(404).json({
			message: "no lead found"
		})
	}

}
module.exports.bulkStatusUpdate = async (req, res, next) => {
	Leads
		.find({ '_id': { $in: req.body.ids } })
		.updateMany({ $set: { status_id: req.body.status_id } })
		.then(function (docs) {
			res.json(docs)
		})
		.catch((err) => {
			res.status(400).json(err)
		})
}

module.exports.search = async (req, res, next) => {
	try {
		let leads = [];
		const search_key = req.query.search_key;
		const search_value = req.query.search_value;
		if (search_key === "status_id") {
			leads = await Leads.find({
				status_id: {
					$in: search_value.split(",")
				}
			}).populate("status_id created_by");
		} else {
			if (search_key === "all") {
				leads = await Leads.find({
					$or: [{
						first_name: new RegExp(`${search_value}`, 'i')
					}, {
						last_name: new RegExp(`${search_value}`, 'i')
					}, {
						street_address: new RegExp(`${search_value}`, 'i')
					}, {
						state: new RegExp(`${search_value}`, 'i')
					}, {
						city: new RegExp(`${search_value}`, 'i')
					}, {
						zip: new RegExp(`${search_value}`, 'i')
					}, {
						owned_by: new RegExp(`${search_value}`, 'i')
					}]
				}).populate("status_id created_by");
			} else {
				leads = await Leads.find({ [search_key]: new RegExp(`${search_value}`, 'i') }).populate("status_id created_by");
			}
		}
		let count = await Leads.count({})
		res.status(200).json({
			leads,
			count
		})
	}
	catch (e) {
		res.status(400).json(e)
	}
}
module.exports.filter = async (req, res, next) => {
	try {
		const { field, fromDate, toDate, status_id, owner_id } = req.query
		let condition = {}
		if (status_id) {
			condition = {
				status_id: { $in: status_id.split(",") }
			}
		}
		if (field) {
			if (fromDate === toDate) {
				condition[field] = {
					$gte: moment(fromDate).startOf("day"),
					$lte: moment(fromDate).endOf("day")
				}
			} else {
				condition = {
					...condition,
					[field]: {
						$gte: fromDate,
						$lte: toDate
					}
				}
			}
		}
		if (owner_id) {
			condition = {
				...condition,
				created_by: owner_id.split(",")
			}
		}
		const leads = await Leads
			.find(condition)
			.sort({ created_on: -1 })
			.populate("status_id created_by");
		let count = await Leads.count(condition)
		res.status(200).json({
			leads,
			count
		})
	} catch (e) {
		res.status(400).json(e)
	}
}
const fetchLocationDetails = (destination) => {
	return new Promise((resolve, reject) => {
		fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&sensor=true&key=AIzaSyA4Jqk-dU9axKNYJ6qjWcBcvQku0wTvBC4`, { method: "get" })
			.then((res) => res.json())
			.then(async (json) => {
				if (json.results.length) {
					if (json.results[0].geometry) {
						resolve(json.results[0].geometry.location)
					} else {
						resolve(null)
					}
				} else {
					resolve(null)
				}
			})
			.catch((err) => {
				console.log(err);
				resolve(null)
			});
	})
}
module.exports.addBulk = async (req, res, next) => {
	try {
		let leadArr = []
		for (let i = 0; i < req.body.length; i++) {
			//Create status if not exist
			let status_id = mongoose.Types.ObjectId();
			let status = await Status.findOne({ name: req.body[i].status_id ?  req.body[i].status_id.trim() : "NHO"})
			// // let status = await Status.findOne({ name: req.body[i].status_id })
			if (status) {
				status_id = status._id
			} else {
				let statusNHO = await Status.findOne({ name: "NHO" })
				if (statusNHO) {
					status_id = statusNHO._id
				}
			}
			// const statusResp = await status.save();
			// status_id = statusResp._id

			// }
			//Check for assigned user
			let created_by = req.body[i].created_by
			let userResp = await User.findOne({ _id: created_by });
			if (userResp) {
				// created_by = req.body[i].profile_id
			} else {
				created_by = req.body[i].profile_id
			}
			let leadObj = {
				...req.body[i],
				status_id,
				created_by
			}
			//Fetch logitude and latitude from address
			if (req.body[i].street_address) {
				let address = req.body[i].street_address.trim();
				if (req.body[i].city) {
					address += `, ${req.body[i].city.trim()}`;
				}
				if (req.body[i].state) {
					address += `, ${req.body[i].state.trim()}`;
				}
				if (req.body[i].zip) {
					address += `, ${req.body[i].zip.trim()}`;
				}
				let locationResp = await fetchLocationDetails(address)
				// console.log(locationResp);
				if (locationResp) {
					leadObj = {
						...leadObj,
						longitude: locationResp.lng,
						latitude: locationResp.lat
					}
				}
			}
			leadArr.push(leadObj)
			// let lead = new Leads(leadObj)
			// respArr.push(await lead.save());
		}
		Leads.insertMany(leadArr, (err, docs) => {
			if (err) {
				res.status(400).json(err)
			}
			res.status(201).json(docs)
		})
	}
	catch (e) {
		console.log(e);
		res.status(400).json(e)
	}
}
module.exports.deleteBulk = async (req, res, next) => {
	console.log(req.body.leadIds);
	Leads.deleteMany({ _id: { $in: req.body.leadIds } }, async function (err) {
		if (err) {
			res.status(400).json(err)
		} else {
			await LeadHistories.deleteMany({ lead_id: { $in: req.body.leadIds } });
			res.json({ message: "Deleted successfully" });
		}
	})
}
module.exports.bulkAssignToSeller = async (req, res, next) => {
	try {
		const docsLeads = await Leads
			.find({ '_id': { $in: req.body.ids } })
			.updateMany({ $set: { created_by: req.body.created_by } })
		const docsLeadHistories = await LeadHistories
			.find({ 'lead_id': { $in: req.body.ids } })
			.updateMany({ $set: { created_by: req.body.created_by } })
		console.log(docsLeads, docsLeadHistories)
		res.json(docsLeads)
	} catch (err) {
		res.status(400).json(err)
	}
}
module.exports.importLeadsFromCSV = async (req, res, next) => {
	csv()
		.fromFile(csvFilePath)
		.then(async (jsonObj) => {
			try {
				let respArr = []
				for (let i = 0; i < jsonObj.length; i++) {
					//Create status if not exist
					let status_id = mongoose.Types.ObjectId();
					// let status = await Status.findOne({ _id: req.body[i].status_id })
					let status = await Status.findOne({ name: jsonObj[i]["Status"] })
					if (status) {
						status_id = status._id
					} else {
						let statusNHO = await Status.findOne({ name: "NHO" })
						if (statusNHO) {
							status_id = statusNHO._id
						}
					}
					//Check for assigned user
					let ownerName = jsonObj[i]["Lead Owner"]
					let userResp = await User.findOne({ firstName: ownerName.split(" ")[0] });
					if (userResp) {
						created_by = userResp._id
					} else {
						created_by = "Wh52noB4T"
					}
					let leadObj = {
						business_name: jsonObj[i]["Business Name"],
						first_name: jsonObj[i]["First Name"],
						last_name: jsonObj[i]["Last Name"],
						phone: jsonObj[i]["Primary Phone"],
						phone2: jsonObj[i]["Alternate Phone"],
						email: jsonObj[i]["Email"],
						street_address: jsonObj[i]["Address 1"],
						apt: "",
						city: jsonObj[i]["City"],
						state: jsonObj[i]["State"],
						zip: jsonObj[i]["Zip"],
						country: "",
						longitude: jsonObj[i]["Longitude"],
						latitude: jsonObj[i]["Latitude"],
						appointment_date: new Date(jsonObj[i]["Appointment"]),
						appointment_time: moment(jsonObj[i]["Appointment"], "MM/DD/YYYY").format("h:mm A"),
						note: jsonObj[i]["Note"],
						status_id,
						created_by,
						updated_on: Date.now()
					}
					respArr.push(leadObj)
					break;
				}
				Leads.insertMany(respArr, (err, docs) => {
					if (err) {
						res.status(400).json(err)
					}
					res.json(docs)
				})
			}
			catch (e) {
				console.log(e);
			}
		})
}
module.exports.listAppointments = async (req, res, next) => {
	try {
		let cond = {
			created_by: req.query.user_id
		};
		const status = await Status.findOne({ name: "APPT" })
		if (status) {
			cond.status_id = status._id
		}
		if (req.query.today === "true") {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			cond.appointment_date = {
				$gte: today
			}
		} else if (req.query.last_month === "true") {
			cond.appointment_date = {
				$gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000)
			}
		}
		const leads = await Leads
			.find(cond)
			.sort({ appointment_date: -1 })
			.populate("status_id");
		res.status(200).json({
			leads
		})
	}
	catch (e) {
		res.status(400).json(e)
	}
}
