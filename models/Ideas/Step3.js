const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const VerifyIdeaSchema = mongoose.Schema({
  verify: { default: "0", type: String },
  comment: { default: undefined, type: String },
  photo: { default: undefined, type: Buffer },
  Gender: { default: undefined, type: String },
  Aadhar: { default: undefined, type: String },
  PAN: { default: undefined, type: String },
  Category: { default: undefined, type: String },
  Status:{default:undefined,type:String},
  Knowing:{default:undefined,type:String},
  Qualification:{default:undefined,type:String},
  Q1: { default: undefined, type: String },
  Q2: { default: undefined, type: String },
  Q3: { default: undefined, type: String },
  Q4: { default: undefined, type: String },
  Q5: { default: undefined, type: String },
  Q6: { default: undefined, type: String },
  Q7: { default: undefined, type: String },
  uploadSign: Buffer,
  underIdea: { type: ObjectId, ref: "Idea" },
});

module.exports = mongoose.model("Step3", VerifyIdeaSchema);

