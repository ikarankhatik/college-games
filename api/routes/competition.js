const express = require('express');
const router = express.Router();
const multer = require("multer");

const competitionController = require('../controller/competition');

const upload = multer({ dest: './uploads/' }); 
//user routes
router.post('/create', upload.single('image'), competitionController.create);
router.delete('/delete/:id',competitionController.delete);
router.put('/update/:id',competitionController.update);
router.get('/get-all-competition', competitionController.getAllCompetition);
router.post('/add-student-to-compition/:id', competitionController.addStudentToCompetition)



module.exports = router;