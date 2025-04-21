const express = require('express');
const router = express.Router();
const { getAllUsers, assignCompany } = require('../controller/formDataController');
const { updateApplicationStatus,getUserByEmail } = require('../controller/formDataController');

router.get('/', getAllUsers);
router.post('/assign', assignCompany);
router.put('/:userId/status', updateApplicationStatus);
router.get('/email/:email', getUserByEmail);
module.exports = router;
