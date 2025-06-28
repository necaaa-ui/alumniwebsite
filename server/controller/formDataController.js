const { application } = require('express');
const FormData = require('../model/form');
const crypto = require('crypto');
exports.getAllUsers = async (req, res) => {
  const data = await FormData.find().populate('applicationStatus.assignedCompanyId', 'name'); 
  console.log(data)
  res.json(data);
};

const mongoose = require('mongoose');

exports.assignCompany = async (req, res) => {
  const { userId, companyId } = req.body;

  try {
    const user = await FormData.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const companyObjectId = new mongoose.Types.ObjectId(companyId);  
    const alreadyAssigned = user.assignedCompanyId.some(
      (id) => id.toString() === companyId
    );

    if (!alreadyAssigned) {
      user.assignedCompanyId.push(companyObjectId);
      console.log(companyObjectId);

      user.applicationStatus.push({
        assignedCompanyId: companyObjectId, 
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
  function decryptEmail(encryptedEmail,seed) {
    const key = crypto.createHash('sha256').update(seed).digest();
    const iv = Buffer.alloc(16, 0);
  
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedEmail, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
  }
  try {

      const decodedEmail = decodeURIComponent(req.params.email); 
      let  decryptedEmail = decryptEmail(decodedEmail, process.env.SEED);  
    const user = await FormData.findOne({ email: decryptedEmail  }).populate('assignedCompanyId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};