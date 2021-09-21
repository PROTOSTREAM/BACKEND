const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const VerifyIdeaSchema = mongoose.Schema({
  verify: { default: NULL, type: String },
  comment: { default: NULL, type: String },
  photo: Buffer,
  Gender: String,
  Aadhar: Number,
  PAN: Number,
  Category: String,
  Q1: String,
  Q2: String,
  Q3: String,
  Q4: String,
  Q5: String,
  Q6: String,
  Q7: String,
  Q8: String,
  Q9: String,
  uploadSign: Buffer,
});

module.exports = mongoose.model("Step3", VerifyIdeaSchema);

