const cron = require('node-cron');
const mongoose = require('mongoose');
const Company = require('../model/companyModel'); // Adjust path as needed

// Function to delete expired companies
const deleteExpiredCompanies = async () => {
  try {
    const now = new Date();
    const result = await Company.deleteMany({ deadline: { $lt: now } });
    console.log(`Deleted ${result.deletedCount} expired companies`);
  } catch (err) {
    console.error('Error deleting expired companies:', err);
  }
};

// Schedule: Every day at 8:41 PM (20:41)
cron.schedule('0 0 * * *', async () => {
  deleteExpiredCompanies();
});
