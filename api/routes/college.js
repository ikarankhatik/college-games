const express = require('express');
const router = express.Router();
const multer = require("multer");
const collegeController = require('../controller/college');


const upload = multer({ dest: './uploads/' }); 

//user routes
router.post('/create',upload.single('image'), collegeController.create);
router.delete('/delete/:id',collegeController.delete);
router.put('/update/:id',collegeController.updateCollege);
router.get('/get-all-college', collegeController.getAllCollege);


module.exports = router;