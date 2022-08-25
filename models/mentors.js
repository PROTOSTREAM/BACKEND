const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const mentorSchema = mongoose.Schema({
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
    profiledata: {},
    role: {
      type: Number,
      required: true,
    },
    department: { 
      type: String, 
      required: true, 
    },
     number: {
      type: Number,
      required: true,
    },
    Ideas: [
      {
        type: ObjectId,
        ref: "Step2",
      },
    ], 
});

module.exports = mongoose.model("Mentor", mentorSchema);
