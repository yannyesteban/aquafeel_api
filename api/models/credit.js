const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approvalSchema = new Schema(
  {
    name: { type: String, required: false },
    signature: { type: Buffer, required: false },
    date: { type: Date, required: false },
  },
  { _id: false }
);

const mortgageSchema = new Schema(
  {
    status: { type: String, required: false },
    mortgageCompany: { type: String, required: false },
    monthlyPayment: { type: Number, required: false },
    howlong: { type: Number, required: false },
   },
  { _id: false }
);

const referenceSchema = new Schema(
  {
    name: { type: String, required: false },
    relationship: { type: String, required: false },
    phone: { type: String, required: false },
  },
  { _id: false }
);

const bankSchema = new Schema(
  {
    name: { type: String, required: false },
    accountNumber: { type: String, required: false },
    routingNumber: { type: String, required: false },
    checking: { type: Boolean, required: false },
    savings: { type: Boolean, required: false },
  },
  { _id: false }
);

const incomeSchema = new Schema(
  {
    employer: { type: String, required: false },
    years: { type: Number, required: false },
    salary: { type: String, required: false },
    position: { type: String, required: false },
    phone: { type: String, required: false },

    preEmployer: { type: String, required: false },
    otherIncome: { type: String, required: false },
  },
  { _id: false }
);

const applicantSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: false },
    relationship: { type: String, required: false },
    ss: { type: String, required: false },
    id: { type: String, required: false },
    idExp: { type: Date, required: false },
    phone: { type: String, required: false },
    cel: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zip: { type: String, required: false },
    income: { type: incomeSchema, required: false },
    signature: { type: Buffer, required: false },
    date: { type: Date, required: false },
  },
  { _id: false }
);

const systemSchema = new Schema(
  {
    name: { type: String, required: false },
    brand: { type: String, required: false },
    model: { type: String, required: false },
  },
  { _id: false }
);

const creditSchema = new Schema({
  applicant: { type: applicantSchema, required: false },
  applicant2: { type: applicantSchema, required: false },
  mortgage: { type: mortgageSchema, required: false },
  reference: { type: referenceSchema, required: false },
  reference2: { type: referenceSchema, required: false },
  bank: { type: bankSchema, required: false },
  employee: { type: approvalSchema, required: false },
  employee2: { type: approvalSchema, required: false },
  date: { type: Date, required: false },
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

module.exports = mongoose.model("Credit", creditSchema);
