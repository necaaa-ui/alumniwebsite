const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  role: String,
  description: String,
  poster: String,
  skillsRequired: [String],
  url: String,
});

module.exports = mongoose.model('CompanyData', companySchema);
