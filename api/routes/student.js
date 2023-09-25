const express = require("express");
const router = express.Router();
const studentController = require("../controller/student");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/student");
const College = require("../models/college");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "./uploads/students");

    // Log the values of __dirname and destinationPath for debugging
    // console.log('__dirname:', __dirname);
    //console.log('destinationPath:', destinationPath);
    //console.log(req.body, file);

    // Check if the directory exists, and create it if it doesn't
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject unsupported files with an error message
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/create", (req, res) => {
  upload.single("photo")(req, res, async (err) => {
    
    if (err) { 
      console.log(err);     
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size too large", success: false });
        }
        return res
          .status(400)
          .json({ error: "Multer error: " + err.message, success: false });
      } else if (err.message === "Unsupported file type") {
        
        return res
          .status(400)
          .json({ error: "Unsupported file type", success: false });
      } else {
        console.log("third");
        return res.status(500).json({ error: err.message, success: false });
      }
    }
    // Log the uploaded file path
    console.log(req.body);
    //console.log("Uploaded file path:", req.file.path);
    try {
      const student = new Student({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        photo: req.file.path,
        college: req.body.college,
      });

      // Save the student
      await student.save();

      // Find the college name using the college ID from the student data
      const college = await College.findById(req.body.college);

      if (!college) {
        // Handle the case where the college is not found
        return res
          .status(500)
          .json({ error: "College Not Found", success: false });
      }

      // Include the college name with the student object
      const collegeName = college.name;

      res.status(201).json({
        student,
        collegeName,
        message: "Student created successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message, success: false });
    }
  });
});

router.delete("/delete/:id", studentController.deleteStudent);
router.get("/get-all-student", studentController.getAllStudents);
router.put("/update/:id", studentController.updateStudent);

module.exports = router;
