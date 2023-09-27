const Competition = require('../models/Competition'); 
const Student = require('../models/student'); 
const College = require('../models/college'); 

// Create a new Competition
exports.create = async (req, res) => {
    console.log(req.file.path);
  try {
    const { name, description, college } = req.body;
    const image = req.file.path;
    const competition = new Competition({
      name,
      description,
      college,
      image,      
      students: [], // Initialize an empty array for students
    });

    // Find the college name using the college ID from the student data
    const collegeData = await College.findById(college);
    
    
    if (!collegeData) {
      return res.status(500).json({error:'College Not Found'}) // Handle the case where the college is not found
    }

    // Include the college name with the student object
    const collegeName = collegeData.name;

    await competition.save();
    return res.status(201).json({competition, collegeName, message:'student added to compititon', success:true});
  } catch (error) {
    res.status(500).json({ error: 'Could not create Competition' });
  }
};

// Delete a Competition by ID
exports.delete = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    await Competition.findByIdAndRemove(id);
    return res.status(201).json({success:true, message: 'Competition deleted successfully'});
  } catch (error) {
    res.status(500).json({ error: 'Could not delete Competition' });
  }
};

// Update a Competition by ID
exports.update = async (req, res) => {
  
  const { id } = req.params;
  try {
    const updatedCompetition = await Competition.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCompetition); 
  } catch (error) {
    res.status(500).json({ error: 'Could not update Competition' });
  }
};

// Get all students with college details
exports.getAllCompetition = async (req, res) => {
  try {
    const competition = await Competition.find().populate('college');
    
    return res.json({competition, success: true, message:'Competition detail send successfully'});
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch students' });
  }
};

// Add a student to a Competition by Competition ID
exports.addStudentToCompetition = async (req, res) => {
  // Assuming you pass the Competition ID in the request params
  try {
    // Find the Competition by ID
    const competition = await Competition.findById(req.params.id);
    console.log(competition);
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    // Find the Student by ID
    const student = await Student.findById(req.body.data);
    //console.log(student);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

     // Check if the student is already in the Competition's students array
     if (competition.students.includes(student._id)) {
      return res.status(400).json({ error: 'Student is already in the competition' });
    }

    // Add the student's name to the Competition's students array
    competition.students.push(student._id); // Assuming student has a 'name' property

    // Save the Competition with the updated students array
    await competition.save();

    return res.status(201).json({ student, message: 'Student added to competition', success: true });
  } catch (error) {
    res.status(500).json({ error: 'Could not add student to Competition' });
  }
};