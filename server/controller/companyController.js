const CompanyData = require('../model/companyModel');

exports.getCompanies = async (req, res) => {
  const { skill } = req.query;
  const companies = await CompanyData.find();
  if (skill) {
    companies.sort((a, b) =>
      b.skillsRequired.includes(skill) - a.skillsRequired.includes(skill)
    );
  }
  res.json(companies);
};

exports.addCompany = async (req, res) => {
  const { name, role, description, skillsRequired, url, deadline } = req.body;
  const poster = req.file?.filename;
  const newCompany = new CompanyData({
    name,
    role,
    description,
    poster,
    skillsRequired,
    url,
    deadline: deadline ? new Date(deadline) : null, // convert to Date object
  });
  await newCompany.save();
  res.json(newCompany);
};

exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (req.file) updateData.poster = req.file.filename;
  if (updateData.deadline) updateData.deadline = new Date(updateData.deadline); // ensure it's a Date object
  const company = await CompanyData.findByIdAndUpdate(id, updateData, { new: true });
  res.json(company);
};

exports.deleteCompany = async (req, res) => {
  await CompanyData.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await CompanyData.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
