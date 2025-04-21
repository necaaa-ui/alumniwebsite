const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getCompanyById } = require('../controller/companyController');
const upload = multer({ dest: 'uploads/' });

const {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} = require('../controller/companyController');

router.get('/', getCompanies);
router.post('/', upload.single('poster'), addCompany);
router.put('/:id', upload.single('poster'), updateCompany);
router.delete('/:id', deleteCompany);
router.get('/:id', getCompanyById);

module.exports = router;
