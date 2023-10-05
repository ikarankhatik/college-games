const Student = require('../models/student');
const College = require('../models/college');
const mongoose = require('mongoose');

// Create a new student
exports.createStudent = async (req, res) => {
      
  try {

    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      age: req.body.age,
      photo: req.file.path,
      college: req.body.college,
      personalData: req.body.personalData,
      date: req.body.date,
      interestedGames: req.body.interestedGames
    });   

    // Save the student
    await student.save();

    // Find the college name using the college ID from the student studentData
    const college = await College.findById(req.body.college);

    if (!college) {
      // Handle the case where the college is not found
      return res.status(500).json({ error: 'College Not Found' }); 
    }

    // Include the college name with the student object
    const collegeName = college.name;

    res.status(201).json({
      student,
      collegeName,
      message: 'Student created successfully',
      success: true,
    });
  } catch (error) {
    //console.log(error);
    // Check if multer encountered an error    
    if (req.fileValidationError) {
      
      return res.status(400).json({ error: req.fileValidationError, success: false });
    }
    res.status(500).json({ error: 'Could not create student', success: false });
  }
};


// Get all students with college details
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('college');
    return res.json({students, success: true, message:'Students detail send successfully'});
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch students' });
  }
};

  // Update a student by ID
exports.updateStudent = async (req, res) => {
  //console.log(req.body);
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({
        student,
        message: 'Student updated successfully',
        success:true
      });
    } catch (error) {
      res.status(500).json({ error: 'Could not update student' });
    }
  };
  
  // Delete a student by ID
  exports.deleteStudent = async (req, res) => {
    
    try {
      const student = await Student.findByIdAndRemove(req.params.id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({ message: 'Student deleted successfully', success:true });
    } catch (error) {
      res.status(500).json({ error: 'Could not delete student' });
    }
  };