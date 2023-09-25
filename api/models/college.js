const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String, 
  },
});

const College = mongoose.model('College', collegeSchema);
module.exports = College;
