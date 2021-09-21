const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const mentorSchema = mongoose.Schema({
  MentorRefId: { type: Number, required: true },
  Department: { type: String, required: true },
  Email: { type: String, required: true },
  NAME: { type: Number, default: NULL },
  Mentorship: { type: ObjectId, ref: ["Idea"] },
  ListOfIdeas: { type: ObjectId, ref: ["Idea"] },
});

module.exports = mongoose.model("Mentors", mentorSchema);
