const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ndaSchema = new mongoose.Schema({
    VerifyByTBI: {
        type: Boolean,
        default: false,
        required: true,
    },
    StartupName: {
        type: String,
        required: true,
    },
    Nda: {
        type: Object,
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "User",
    },
});

module.exports = new mongoose.model("Nda", ndaSchema);
