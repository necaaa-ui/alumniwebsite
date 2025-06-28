const cron = require('node-cron');
const mongoose = require('mongoose');
const Company = require('../model/companyModel'); // Adjust path as needed

const deleteExpiredCompanies = async () => {
  try {
    const now = new Date();
    const result = await Company.deleteMany({ deadline: { $lt: now } });
    console.log(`Deleted ${result.deletedCount} expired companies`);
  } catch (err) {
    console.error('Error deleting expired companies:', err);
  }
};

cron.schedule('0 0 * * *', async () => {
  deleteExpiredCompanies();
});
