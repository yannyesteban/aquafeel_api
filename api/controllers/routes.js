const mongoose = require("mongoose");
const Routes = require('../models/routes');
const Status = require('../models/status');



module.exports.list = async (req, res, next) => {
	try {
		const routes = await Routes
		.find({ created_by: req.query.user_id })
		.sort({created_on: -1})
		.populate("leads", "_id street_address apt city state zip country longitude latitude");
		res.status(200).json({
			routes
		})
	}
	catch (e) {
		res.status(400).json(e)
	}
}

module.exports.details = async (req, res, next) => {
	try {
		const route = await Routes.findOne({ _id: req.query.id }).populate("leads");
		Status.populate(route,
			{ path: "leads.status_id", select: { _id: 1, name: 1, image: 1 } },
			async function (err, populatedData) {
				if(err){
					return res.status(400).json(err);
				}
				res.status(200).json({
					route: populatedData
				})
			})
	}
	catch (e) {
		res.status(400).json(e)
	}
}

module.exports.add = async (req, res, next) => {
	try {
		let { name, starting_address, starting_address_long, starting_address_lat, ending_address, ending_address_long, ending_address_lat, leads, user_id } = req.body;

		if(leads[0] && leads[0].id) {
			leads = leads.map(data => data.id);
		}
		
		let route = new Routes({
			name: name,
			starting_address,
			ending_address,
			leads,
			starting_address_long, 
			starting_address_lat,
			ending_address_long,
			ending_address_lat,
			created_by: user_id,
			created_on: Date.now(),
			updated_on: Date.now(),
		})
		await route.save();
		res.status(201).json(route);
	}
	catch (e) {
		console.log(e);
		res.status(400).json(e)
	}
}


module.exports.edit = async (req, res, next) => {
	try {
		let { id, name, starting_address, starting_address_long, starting_address_lat, ending_address, ending_address_long, ending_address_lat, leads } = req.body;

		if(leads[0] && leads[0].id) {
			leads = leads.map(data => data.id);
		}

		let route = await Routes.findByIdAndUpdate(id, { $set: {
			name: name,
			starting_address,
			ending_address,
			starting_address_long, 
			starting_address_lat,
			ending_address_long,
			ending_address_lat,
			leads,
			updated_on: Date.now(),
		} }, { new: true })
		res.status(201).json(route)
	}
	catch (e) {
		res.status(400).json(e)
	}
}


module.exports.delete = async (req, res, next) => {
	let id = req.query.id;
	let deletedRoute = await Routes.deleteOne({ _id: id });
	if (deletedRoute.deletedCount > 0) {
		res.status(201).json({
			message: "route deleted successfully"
		})
	}
	else {
		res.status(404).json({
			message: "no route found"
		})
	}
}



