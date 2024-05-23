const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../../config");

module.exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email }).select('email _id isBlocked role password isVerified');
	if (!user)
		return res.status(404).json({ message: "no user found" })
	bcrypt.compare(password, user.password, async (err, authenticUser) => {
		if (err)
			return res.status(500).json({ message: "internal server error" })
		else {
			if (authenticUser) {
				if(user.isBlocked){
					return res.status(401).json({ messgae: "You are blocked! Please contact admin" })
				}
				if(!user.isVerified){
					return res.status(401).json({ messgae: "Your account is still not verified! Please wait until admin approves your account" })
				}
				const payload = { id: user._id, email: user.email, role: user.role };

				const token = await jwt.sign(payload, config.secretOrKey, { expiresIn: '60d' });
				res.status(201).json({
					token: token,
					user: user
				})
			}
			else
				return res.status(401).json({ messgae: "invalid password" })
		}
	})
}




module.exports.changePassword = async (req, res, next) => {
	try {
		const { email, oldPassword, newPassword } = req.body;
		let user = await User.findOne({ email: email });
		if (!user)
			return res.status(404).json({ message: "No user found" })

		const authenticUSer = await bcrypt.compare(oldPassword, user.password)
		if (!authenticUSer)
			return res.status(400).json({ message: "Invalid old password" })

		if (newPassword.length < 8)
			return res.status(400).json({ message: "Password must be at least 8 characters long" })

		let hash = await bcrypt.hash(newPassword, 10)
		let newUser = await User.findByIdAndUpdate(user._id, { $set: { password: hash } })
		if (!newUser)
			return res.status(400).json({ message: "Couldnt update password" })

		return res.status(201).json({ message: "Password updated sucessfully" })

	}
	catch (e) {
		return res.status(400).jsom(e)
	}
}


