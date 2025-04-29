const express = require('express');
const cors = require('cors');
const path = require('path');
const axios=require('axios');
const qs = require('qs');
const multer = require('multer');
const connectDB = require('./config/db');
const formDataRoutes = require('./routes/formDataRoutes');
const companyRoutes = require('./routes/companyRoutes');
const FormData = require('./model/form');
const {sendAcknowledgeEmail}=require('./service/emailService');
require('./cronJobs/deleteExpiredCompanies');

require('dotenv').config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());


// Serve the favicon
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
      const token=(await FormData.find()).length+1;
      const tokenNo=String(token).padStart(3,'0');
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
      //console.log(req.file);
      await sendAcknowledgeEmail(tokenNo,name,email,contact,batch,location,skillset,company,experience,ctc,message,req.file?req.file.filename:null,req.file ? req.file.path : null );
      res.status(201).json({ message: 'Form data saved successfully' });
    } catch (err) {
      console.error('Error saving form data:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/verifycaptcha",async(req,res)=>{
      const {value}=req.body;
      //console.log(value);
      //console.log(process.env.MONGO_URI);
      try{
            const google_res=await axios.post("https://www.google.com/recaptcha/api/siteverify",
              qs.stringify({
                secret: process.env.SECRET_KEY,
                response: value,
              }),{
              headers:{
                "Content-Type":"application/x-www-form-urlencoded"
              }
            })
            const {data}=await google_res;
            //console.log(data);
            if(data.success===true){
              res.status(201).json({ message: 'Captcha Success' });
            }
            else{
              res.status(201).json({ message: 'Captcha Failed' });
            }
    
      }
      catch (err) {
        console.error('Error saving form data:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
  })
  


app.use('/uploads', express.static('uploads'));
app.use('/api/companies', companyRoutes);
app.use('/api/users', formDataRoutes);
 
app.listen(5000, () => {
    console.log("Listening on port 5000");
});
