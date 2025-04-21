const { application } = require('express');
const FormData = require('../model/form');

exports.getAllUsers = async (req, res) => {
  const data = await FormData.find().populate('applicationStatus.assignedCompanyId', 'name'); 
  res.json(data);
};

const mongoose = require('mongoose');

exports.assignCompany = async (req, res) => {
  const { userId, companyId } = req.body;

  try {
    const user = await FormData.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Correctly create ObjectId from companyId string
    const companyObjectId = new mongoose.Types.ObjectId(companyId);  
    const alreadyAssigned = user.assignedCompanyId.some(
      (id) => id.toString() === companyId
    );

    // Only assign the company if not already assigned
    if (!alreadyAssigned) {
      user.assignedCompanyId.push(companyObjectId);
      console.log(companyObjectId);

      // Push the application status with the correct ObjectId
      user.applicationStatus.push({
        assignedCompanyId: companyObjectId, // Proper ObjectId here
        status: 'pending',
      });

      await user.save();
    }

    console.log("Assigning:", { companyId, userId });
    console.log("Application Status:", user.applicationStatus);

    res.json({ message: 'Company assigned successfully' });

  } catch (error) {
    console.error("Error assigning company:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.updateApplicationStatus = async (req, res) => {
  const { userId, companyId, status } = req.body;
  console.log(req.body)
  const user = await FormData.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const appStatus = user.applicationStatus.find((a) =>
    a.assignedCompanyId._id.toString() === companyId
  );

  if (appStatus) {
    appStatus.status = status;
  }

  await user.save();
  res.json({ message: 'Application status updated' });
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await FormData.findOne({ email: req.params.email }).populate('assignedCompanyId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};