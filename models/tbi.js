const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tbiSchema = mongoose.Schema({
  name: { type: String, default: "TBI" },
  email: String,
  listOfIdeas: { type: ObjectId, ref: ["Ideas"] },
  password: String,
});

module.exports = mongoose.model("Tbi", tbiSchema);
