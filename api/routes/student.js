const express = require("express");
const router = express.Router();
const studentController = require("../controller/student");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/student");
const College = require("../models/college");
const mongoose = require("mongoose");

const { validateStudentData } = require('../middleware/validateSchema');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     console.log("A");
//     cb(null, true);
//   } else {
//     // Reject unsupported files with an error message
//     cb(new Error("Unsupported file type"), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter,
// });
const upload = multer({ dest: './uploads/' }); 

router.post("/create", upload.single("photo"), validateStudentData, studentController.createStudent);   
router.delete("/delete/:id", studentController.deleteStudent);
router.get("/get-all-student", studentController.getAllStudents);
router.put("/update/:id", studentController.updateStudent);

module.exports = router;
