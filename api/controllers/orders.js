const Order = require('../models/order');


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
			quickDate,
			orderBy = null,
		} = req.query

		let cond = {
			//created_by: req.query.user_id
		};

		if (req.query.favorite === "true") {
			cond.favorite = true
		}
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
			const { _fromDate, _toDate } = generateDateRange(quickDate, fromDate, toDate)
			cond[field] = {
				$gte: _fromDate,
				$lte: _toDate
			}
		}

		console.log({ cond })
		const count = await Order.count(cond)
		const orders = await Order.find(cond)
			.limit(parseInt(limit))
			.skip(parseInt(offset))
			.sort({ created_on: -1, _id: -1 })
		//.populate("status_id");
		console.log(orders.map((o) => { return { city: "yanny" }; }))
		res.status(200).json({
			//data: orders.map((o)=>{return {id:o.id, buyer1:o.buyer1, system1:o.system1, price: o.price}; }),
			data: orders,
			count
		})
	}
	catch (error) {
		console.log(error.message);
		res.status(400).send({ message: error.message });
	}
}

module.exports.details = async (req, res, next) => {
	try {
		let order = await Order.findOne({ _id: req.query.id });
		
		res.status(200).json({
			data: order, message: "record recovery correctly!"
		});
	}

	catch (e) {
		res.status(400).json(e)
	}
}

module.exports.add = async (req, res) => {

	try {
		const orderData = req.body;
		orderData._id = undefined

		orderData.createdOn = Date.now(),
			orderData.updatedOn = Date.now(),
			orderData.createdBy = req.body.user_id || "xxxx"

		/*if (orderData.system1){
			orderData.system1._id = undefined
		}
		if (orderData.system2){
			orderData.system2._id = undefined
		}

		if (orderData.buyer1){
			orderData.buyer1._id = undefined
		}

		if (orderData.buyer2){
			orderData.buyer2._id = undefined
		}
		console.log(orderData);
		orderData.installation._id = undefined
		orderData.price._id = undefined
		orderData.price.terms._id = undefined
		*/
		const newOrder = new Order(orderData);
		await newOrder.save();
		res.status(201).send({ data: newOrder, message: "record added correctly!" });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ message: error.message });
	}
};

module.exports.edit = async (req, res, next) => {
	try {
		

		const orderData = req.body;

		console.log( orderData )
		const id = orderData._id;
		//orderData._id = undefined

		//orderData.createdOn = Date.now(),
		orderData.updatedOn = Date.now(),
			orderData.createdBy = req.body.user_id || "xxxx"


		let order = await Order.findByIdAndUpdate(id, {
			$set: orderData
		}, { new: true })


		res.status(201).json({ data: order, message: "Order added correctly!" })
	}
	catch (e) {
		console.log(e);
		res.status(400).json(e)
	}

}

module.exports.delete = async (req, res, next) => {
	let id = req.query.id;
	let deletedOrder = await Order.deleteOne({ _id: id });

	if (deletedOrder.deletedCount > 0) {
		res.status(200).json({
			data: deletedOrder,
			message: "Order deleted successfully"
		})
	} else {
		res.status(404).json({
			message: "no Order found",
			data: {}
		})
	}

}