const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    tokenNo:{
        type:String,
        required:true,
        unique:true
    },
    contact: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    skillset: {
        type: String,
        default: '',
    },
    company: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        default: '',
    },
    ctc: {
        type: String,
        default: '',
    },
    message: {
        type: String,
        required: true,
    },
    attachment: {
        type: String,
        default: '',
    },
    assignedCompanyId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyData',
        default: null,
      }],
      applicationStatus: [
        {
          assignedCompanyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyData',
            required: true, // add this to prevent null
          },
          status: {
            type: String,
            enum: ['pending', 'completed', 'not applicable'],
            default: 'pending',
          },
        },
      ]
      
}

);

const FormData = mongoose.model('FormData', formDataSchema);
module.exports = FormData;
