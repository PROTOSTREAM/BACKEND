const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const internshipSchema = new mongoose.Schema(
  {
    InternshipTitle: {
      type: String,
      required: true,
    },
    AvailablePositions: {
      type: String,
      required: true,
    },
    Rewards: {
      type: String,
      required: true,
    },
    positionBreif: {
      type: String,
    },
    Link: {
      type: String,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    startup:{
      type: ObjectId,
      ref: "Startup"
    }
  },
  
  { timestamps: true }
);

module.exports = new mongoose.model("Internship", internshipSchema);
