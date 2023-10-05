const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }
  ],
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
});

const Competition = mongoose.model("Competition", competitionSchema);
module.exports = Competition;
