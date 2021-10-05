const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ideaSchema = mongoose.Schema({
  phonestatus: { type: String, required: false, default: "Not-verify" },
  TrlTest: { type: Number, default: 0 },
  Student: { type: ObjectId, ref: ["User"] },
  Status: { type: Number, default: NULL },
  department: { default: NULL, type: String },
  Step1: { type: Number, default: 0 },
  Step2: { type: ObjectId, default: NULL, ref: ["Step2"] },
  Step3: { type: ObjectId, default: NULL, ref: ["Step3"] },
  Startup_Readiness: { type: ObjectId, ref: ["Mentors"] },
});

module.exports = mongoose.model("Idea", ideaSchema);
