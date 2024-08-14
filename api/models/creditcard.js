const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({


  date: { type: Date, required: false },
  amount: { type: Number, required: false },
  country: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },

  license: { type: String, required: false },

  products: { type: String, required: false },

  phone: { type: String, required: false },
  address: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zip: { type: String, required: false },

  nameCard: { type: String, required: false },
  numberCard: { type: String, required: false },
  cvcCard: { type: String, required: false },
  typeCard: { type: String, required: false },
  expCard: { type: Date, required: false },
  signature: { type: Buffer, required: false },

  lead: { type: String, required: false },
  
  createdBy: {
    type: String,
    ref: "Users",
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("creditcard", creditCardSchema);
