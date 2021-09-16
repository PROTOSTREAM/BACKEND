const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ideaSchema = mongoose.Schema({
  IdeaRefNo: {
    type: Number,
    default: NULL,
  },
  Review: {
    type: String,
    default: NULL,
  },
  Status: {
    type: Number,
    default: NULL,
  },
  StudentRefNo: { type: Number, required: true },
  MentorRefNo: { type: Number, required: true },
  SlotNo: { type: Number },
  IdeaDetailUnderReview: { type: String, default: NULL },
  TrlLevel: { type: Number, default: NULL },
  SchemeReadiness: { type: Number, defualt: NULL },
});

module.exportsi = mongoose.model("Idea", ideaSchema);
