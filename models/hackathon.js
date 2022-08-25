const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    AddDescription: {
      type: String,
    },
    Email: {
      type: String,
    },
    Branch: {
      type: String,
    },
    MemberBranch: {
      type: String,
    },
    MemberBranch1: {
      type: String,
    },
    MemberBranch2: {
      type: String,
    },
    MemberEmail: {
      type: String,
    },
    MemberEmail1: {
      type: String,
    },
    MemberEmail2: {
      type: String,
    },
    MemberName: {
      type: String,
    },
    MemberName1: {
      type: String,
    },
    MemberName2: {
      type: String,
    },
    MemberRollNo: {
      type: String,
    },

    MemberRollNo1: {
      type: String,
    },

    MemberRollNo2: {
      type: String,
    },
    RollNo: {
      type: String,
    },
    TeamLeader: {
      type: String,
    },
    TeamName: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = new mongoose.model("Hackathon", hackathonSchema);
