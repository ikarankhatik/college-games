const express = require('express');
const router = express.Router();

const collegeController = require('../controller/college');

//user routes
router.post('/create', collegeController.create);
router.delete('/delete/:id',collegeController.delete);
router.put('/update/:id',collegeController.updateCollege);
router.get('/get-all-college', collegeController.getAllCollege);


module.exports = router;