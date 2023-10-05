const express = require('express');
const router = express.Router();

//common router
router.use('/principle', require('./principle'));
router.use('/competition', require('./competition'));
router.use('/college', require('./college'));
router.use('/student', require('./student'));

module.exports = router;