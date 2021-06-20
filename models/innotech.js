const mongoose = require("mongoose");

const innotechSchema = new mongoose.Schema(
  {
    currentYear: {
      type: Number,
      required: true,
    },
    hackName: {
      required: true,
      type: String,
    },
    teamName: {
      required: true,
      type: String,
    },
    leaderName: {
      required: true,
      type: String,
    },
    leaderBranch: {
      required: true,
      type: String,
    },
    projectSummary: {
      required: true,
      type: String,
    },
    leadereMailId: {
      required: true,
      type: String,
    },
    leaderMobile: {
      required: true,
      type: Number,
    },
  },

  { timestamps: true }
);

module.exports = new mongoose.model("Innotech", innotechSchema);
