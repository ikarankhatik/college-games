const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
//const IMAGE_PATH = path.join('../uploads/students');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  photo: {
    type: String
  }, 
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
});

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, IMAGE_PATH));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now());
//   }
// });


// // static
// studentSchema.statics.uploadedStudentImage = multer({storage:  storage}).single('photo');
// studentSchema.statics.imagePath = IMAGE_PATH;


const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
