const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const mentorSchema = mongoose.Schema({
  department: { type: String },
  email: String,
  name: String,
  MobNo: Number,
  ListOfIdeas: { type: ObjectId, ref: ["Ideas"] },
  password: String,
});

module.exports = mongoose.model("Mentors", mentorSchema);
