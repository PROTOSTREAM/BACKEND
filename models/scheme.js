const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const schemeSchema = new mongoose.Schema(
  {
    compTitle: {
      type: String,
      required: true,
    },
    organizer: {
      required: true,
      type: String,
    },
    deadline: {
      required: true,
      type: String,
    },
    starting: {
      required: true,
      type: String,
    },
    ending: {
      required: true,
      type: String,
    },
    registrationLink: {
      required: true,
      type: String,
    },
    fileLink: {
      required: true,
      type: Object,
    },
    imageLink: {
      required: true,
      type: Object,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

module.exports = new mongoose.model("Scheme", schemeSchema);
