const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const qs = require('qs');
const multer = require('multer');
const connectDB = require('./config/db');
const formDataRoutes = require('./routes/formDataRoutes');
const companyRoutes = require('./routes/companyRoutes');
const FormData = require('./model/form');
const { sendAcknowledgeEmail } = require('./service/emailService');
require('./cronJobs/deleteExpiredCompanies');

require('dotenv').config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// MongoDB URI
const uri = process.env.MONGO_URI;

function decryptEmail(encryptedEmail,seed) {
  const key = crypto.createHash('sha256').update(seed).digest();
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedEmail, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
app.use('/favicon.ico', express.static(faviconPath));

const buildPath = path.join(__dirname, '../build');
app.use(express.static(buildPath));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.post("/api/submitFormData", upload.single('attachment'), async (req, res) => {
  const {
    name,
    email,
    contact,
    batch,
    location,
    skillset,
    company,
    experience,
    ctc,
    message,
  } = req.body;

  try {
    const token = (await FormData.find()).length + 1;
    const tokenNo = String(token).padStart(3, '0');
    await FormData.insertMany({
      tokenNo,
      name,
      email,
      contact,
      batch,
      location,
      skillset,
      company,
      experience,
      ctc,
      message,
      attachment: req.file ? req.file.path : null
    });
    await sendAcknowledgeEmail(
      tokenNo, name, email, contact, batch, location,
      skillset, company, experience, ctc, message,
      req.file ? req.file.filename : null,
      req.file ? req.file.path : null
    );
    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (err) {
    console.error('Error saving form data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Captcha verification route
app.post("/api/verifycaptcha", async (req, res) => {
  const { value } = req.body;

  try {
    const google_res = await axios.post("https://www.google.com/recaptcha/api/siteverify",
      qs.stringify({
        secret: process.env.SECRET_KEY,
        response: value,
      }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

    const { data } = google_res;

    if (data.success === true) {
      res.status(201).json({ message: 'Captcha Success' });
    } else {
      res.status(201).json({ message: 'Captcha Failed' });
    }

  } catch (err) {
    console.error('Error verifying captcha:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Use routes
app.use('/api/companies', companyRoutes);
app.use('/api/users', formDataRoutes);


app.get('/api/user-by-email', async (req, res) => {
  const { email} = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email query param is required' });
  }

  let decryptedEmail;

  if (process.env.SEED) {
    try {
      const decodedEmail = decodeURIComponent(email); // Decode %2F etc.
      decryptedEmail = decryptEmail(decodedEmail, process.env.SEED);  // AES decryption
    } catch (err) {
      console.error('❌ Decryption failed:', err.message);
      return res.status(400).json({ error: 'Invalid encrypted email or seed' });
    }
  } else {
    decryptedEmail = email;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('vaave');

    const user = await db.collection('members').findOne({
      'basic.email_id': decryptedEmail,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('❌ DB Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    await client.close();
  }
});


app.listen(5000, () => {
  console.log("🚀 Listening on port 5000");
});
