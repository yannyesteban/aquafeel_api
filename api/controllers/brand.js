const Brand = require('../models/brand');



module.exports.list = async (req, res, next) => {
    console.log(".....list....")
    try {
        const brands = await Brand.find();
        res.status(200).json({
            count: brands.length,
            data: brands
        })
    }
    catch (e) {
        res.status(400).json(e)
    }

}
module.exports.add = async (req, res, next) => {
    console.log(".....add....", req.body)
    try {
        let name = req.body.name;
        
        const newBrand = new Brand({
            name: name,
            createdOn: Date.now(),
		    updatedOn: Date.now(),
		    createdBy: req.body.user_id || "xxxx"
        })
        await newBrand.save((err, data) => {
            if (err)
                return res.status(400).json({ err: err })
            else
                return res.status(201).json({ data: data, message: "Brand added correctly!" });
        })
    }
    catch (e) {
        res.status(400).json(e)
    }
}
module.exports.edit = async (req, res, next) => {
    console.log(".....edit....", req.body)
    try {
        let name = req.body.name;
        let _id = req.body._id;

        Brand.findByIdAndUpdate(_id, { $set: { name } }, { new: true }, function (err, data) {
            if (err)
                res.status(400).json(err)
            else
                res.status(201).json({ data: data, message: "Brand updated correctly!" });
        })
    }
    catch (e) {
        res.status(400).json(e)
    }
}

module.exports.delete = async (req, res, next) => {
	let id = req.query.id;
	let deletedBrand = await Brand.deleteOne({ _id: id });

	if (deletedBrand.deletedCount > 0) {
		res.status(200).json({
			data: deletedBrand,
			message: "Brand deleted successfully",
		});
	} else {
		res.status(404).json({
			message: "no Brand found",
			data: {},
		});
	}
};

