const College = require('../models/college');

// Create a new college
module.exports.create = async (req, res) => {
   
  try {
    const college = new College(req.body.data);
    const savedCollege = await college.save();
    if(savedCollege){
        return res.json({
        success: true,
          message: "Created College successfully",
          savedCollege
        })
    }else{
        return res.json({ success: false, message: "Not Created" });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the college asa kyu' });
  }
};

// Delete a college by ID
module.exports.delete = async (req, res) => {
  
  try {
    const collegeId = req.params.id;
    const deletedCollege = await College.findByIdAndRemove(collegeId);
    if (!deletedCollege) {
      return res.status(404).json({ error: 'College not found' });
    } else {
      return res.json({ message: 'College deleted successfully', success:true });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the college' });
  }
};

// Update a college by ID
module.exports.updateCollege = async (req, res) => {
  
  try {
    const collegeId = req.params.id;
    const college = await College.findByIdAndUpdate(collegeId, req.body, { new: true });
    console.log(college);
    if (!college) {
      res.status(404).json({ error: 'College not found' });
    } else {
      res.json({
        college,
        message: 'Student updated successfully',
        success:true
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the college' });
  }
};

// Get all colleges
module.exports.getAllCollege = async (req, res) => {
  try {
    const colleges = await College.find();
    return res.json({
      success: true,
        message: "College Loaded",
        colleges
      })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching colleges' });
  }
};
