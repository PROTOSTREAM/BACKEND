const mongoose = require("mongoose");
const { validateRequestWithBody } = require("twilio");
const { ObjectId } = mongoose.Schema;

const externalUserSchema = new mongoose.Schema(
  {
    TRL_Test: { type: String, default: undefined },
    phonestatus: {
      type: String,
      required: false,
      default: "Not-verify",
    },
    sid: {
      type: String,
      required: false,
      default: null,
    },
    // verification:{
    //   type: Boolean,
    //   default: false,
    //   required: false,
    // },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    // ableToResetPassword: {
    //   type: Boolean,
    //   default: false,
    //   required: true
    // },
    otpstatus: {
      type: String,
      default: "notsent",
      required: false,
    },
    externalUser:{
        type: Boolean,
        default: true
    },
  

    profiledata: {},
    role: {
      type: Number,
      required: true,
    },
  
    schemes: [
      {
        type: ObjectId,
        ref: "Scheme",
      },
    ],
    startup: {
        type: ObjectId,
        ref: "Idea",
    },
    internship: [
      {
        type: ObjectId,
        ref: "Internship",
      },
    ],
    number: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = new mongoose.model("ExternalUser", externalUserSchema);
