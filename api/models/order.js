const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approvalSchema = new Schema(
  {

    name: { type: String, required: false },
    signature: { type: Buffer, required: false },
    date: { type: Date, required: false }
    
  }, { _id: false }
);

const buyerSchema = new Schema(
  {

    name: { type: String, required: false },
    phone: { type: String, required: false },
    cel: { type: String, required: false },
    signature: { type: Buffer, required: false },
    date: { type: Date, required: false }
  }, { _id: false }
);

const systemSchema = new Schema(
  {
    name: { type: String, required: false },
    brand: { type: String, required: false },
    model: { type: String, required: false },
  }, { _id: false }
);

const installSchema = new Schema(
  {
    day: { type: String, required: false },
    date: { type: Date, required: false },
    waterSouce : { type: String, required: false },
    iceMaker: { type: Boolean, required: false },
    time: { type: Number, required: false },
  }, { _id: false }
);

const termsSchema = new Schema(
  {
    unit: { type: String, required: false },
    amount: { type: Number, required: false },
  }, { _id: false }
);

const priceSchema = new Schema(
  {
    cashPrice: { type: Number, required: false },
    installation: { type: Number, required: false },
    taxes: { type: Number, required: false },
    totalCash: { type: Number, required: false },
    downPayment: { type: Number, required: false },
    totalCashPrice: { type: Number, required: false },
    toFinance: { type: Number, required: false },
    terms: { type: termsSchema, required: false },
    APR: { type: Number, required: false },
    finaceCharge: { type: Number, required: false },
    totalPayments: { type: Number, required: false },
  }, { _id: false }
);

const orderSchema = new Schema(
  {
    buyer1: { type: buyerSchema, required: false },
    buyer2: { type: buyerSchema, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zip: { type: String, required: false },
    system1: { type: systemSchema, required: false },
    system2: { type: systemSchema, required: false },
    promotion: { type: String, required: false },
    installation: { type: installSchema, required: false },
    people: { type: Number, required: false },
    floorType: { type: String, required: false },
    creditCard: { type: Boolean, required: false },
    check: { type: Boolean, required: false },
    price: { type: priceSchema, required: false },
    //approval1 : { type: approvalSchema, required: false },
    //approval2 : { type: approvalSchema, required: false },
    employee : { type: approvalSchema, required: false },
    approvedBy : { type: approvalSchema, required: false },
    //signature1: { type: Buffer, required: false }, // Added signature field
    //signature2: { type: Buffer, required: false }, // Added signature field
    createdBy:{
      type: String,
      ref: "Users",
      required: true
    },
    createdOn: {
      type: Date,
      default: Date.now
    },
    updatedOn: {
      type: Date,
      required: true
    },
  }
);

/*
const buyerSchema = new Schema({
    id: { type: String, required: false },
    name: { type: String, required: false },
    phone: { type: String, required: false },
    cel: { type: String, required: false }
}, { _id: false });

const systemSchema = new Schema({
    id: { type: String, required: false },
    name: { type: String, required: false },
    brand: { type: String, required: false },
    model: { type: String, required: false }
}, { _id: false });

const installSchema = new Schema({
    id: { type: String, required: false },
    day: { type: String, required: false },
    date: { type: Date, required: false },
    iceMaker: { type: Boolean, required: false },
    time: { type: Number, required: false }
}, { _id: false });

const termsSchema = new Schema({
    unit: { type: String, required: false },
    amount: { type: Number, required: false }
}, { _id: false });

const priceSchema = new Schema({
    cashPrice: { type: Number, required: false },
    installation: { type: Number, required: false },
    taxes: { type: Number, required: false },
    totalCash: { type: Number, required: false },
    downPayment: { type: Number, required: false },
    toFinance: { type: Number, required: false },
    terms: { type: termsSchema, required: false },
    APR: { type: Number, required: false },
    finaceCharge: { type: Number, required: false }
}, { _id: false });

const orderSchema = new Schema({
    id: { type: String, required: false },
    buyer1: { type: buyerSchema, required: false },
    buyer2: { type: buyerSchema, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zip: { type: String, required: false },
    system1: { type: systemSchema, required: false },
    system2: { type: systemSchema, required: false },
    installation: { type: installSchema, required: false },
    people: { type: Number, required: false },
    creditCard: { type: Boolean, required: false },
    check: { type: Boolean, required: false },
    price: { type: priceSchema, required: false }
}, { timestamps: true });
*/
module.exports = mongoose.model("Order", orderSchema);
