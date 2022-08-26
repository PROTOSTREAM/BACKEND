const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const startupSchema = new mongoose.Schema(
  {
    StartupName: {
      type: String,
      required: true,
    },
    StartupDomain: {
      type: String,
      required: true,
    },
    StartupStage: {
      type: String,
      required: true,
    },
    StartupType: {
      type: String,
      required: true,
    },
    FounderName: {
      type: String,
      required: true,
    },
    FounderEmail: {
      type: String,
      required: true,
    },
    AadharNumber: {
      type: Number,
      required: true,
    },
    StartupBreif: {
      type: String,
      required: true,
    },
    // CofounderName: {
    //   type: String,
    //   required: true,
    // },
    // CofounderEmail: {
    //   type: String,
    //   required: true,
    // },
    // CofounderNumber: {
    //   type: Number,
    //   required: true,
    // },
    Link: {
      type: String,
    },
    ProjectSummary: {
      type: String,
      //minlength: 500,
    },
    PresentationFile: {
      type: Object,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    teamMembers: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Startup", startupSchema);
