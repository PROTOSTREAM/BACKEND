const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ReviewIdeaSchema = mongoose.Schema({
  review: { type: String, default: 0 },
  Name: { type: String, default: undefined },
  MobNo: { type: Number, required: true },
  Email: String,
  Carrer: String,
  Idea: String,
  BriefData: String,
  URL: String,
  Mentor: { type: ObjectId, ref: "Mentor" },
});

module.exports = mongoose.model("Step2", ReviewIdeaSchema);
