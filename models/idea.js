const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ideaSchema = mongoose.Schema({
  Review: {
    type: String,
    default: NULL,
  },
  Status: {
    type: Number,
    default: NULL,
  },
  StudentRefNo: { type: ObjectId, ref: ["User"] },
  MentorRefNo: { type: ObjectId, ref: ["Mentor"] },
  SlotNo: { type: Number },
  IdeaDetailUnderReview: {},
  TrlLevel: { type: Number, default: NULL },
  SchemeReadiness: { type: Number, defualt: NULL },
});

module.exports = mongoose.model("Idea", ideaSchema);
