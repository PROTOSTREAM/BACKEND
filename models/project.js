const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema({
  ProjectTitle: {
    type: String,
    required: true,
  },
  ProjectArea: {
    type: String,
    required: true,
  },
  SubmissionDate: {
    type: String,
    required: true,
  },
  Technology: {
    type: String,
    required: true,
  },
  TeamMembers: {
    type: String,
    required: true,
  },
  RollNumber: {
    type: Number,
    required: true,
  },
  Section: {
    type: String,
    required: true,
  },
  GuideName: {
    type: String,
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = new mongoose.model("Projects", projectSchema);
