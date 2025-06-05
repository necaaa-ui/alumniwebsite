import React, { useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import './App.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Make sure you're using react-router


function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    batch: '',
    location: '',
    skillset: '',
    company: '',
    experience: '',
    ctc: '',
    message: '',
    attachment: null,
  });

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

useEffect(() => {
  const query = new URLSearchParams(window.location.search);
  const email = query.get('email');

  if (email) {  // make sure both exist
    axios.get(`http://localhost:5000/api/user-by-email`, {
      params: { email }
    })
      .then((res) => {
        const user = res.data;

        setFormData((prev) => ({
          ...prev,
          name: user?.basic?.name || '',
          email: user?.basic?.email_id || '',
          contact: user?.contact_details?.mobile?.replace(/\D/g, '') || '',
          batch: user?.basic?.label || '',
          location: user?.current_location?.location || '',
        }));
      })
      .catch((err) => {
        console.error('Failed to fetch user data:', err);
      });
  }
}, []);


  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleCaptchaChange = async (value) => {
    const res = await axios.post("http://localhost:5000/api/verifycaptcha", { value });
    if (res.data.message === "Captcha Success") {
      setCaptchaVerified(true);
    } else if (res.data.message === "Captcha Failed") {
      setCaptchaVerified(false);
    }
  };

  const validateForm = () => {  
    const newErrors = {};

    if (!formData.name || formData.name.length < 3 || formData.name.length > 100 || !/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Please enter a valid name (Only letters and spaces allowed).";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.contact || !/^\d{10,15}$/.test(formData.contact)) {
      newErrors.contact = "Please enter a valid phone number (10-15 digits).";
    }

    if (!formData.batch) {
      newErrors.batch = "Please select or enter your batch.";
    }

    if (!formData.location || formData.location.length < 3 || formData.location.length > 100 || !/^[A-Za-z\s,]+$/.test(formData.location)) {
      newErrors.location = "Please enter a valid location (city or country).";
    }

    if (!formData.skillset || formData.skillset.length < 3 || formData.skillset.length > 500) {
      newErrors.skillset = "Please provide at least one skill.";
    }

    if (!formData.company || formData.company.length < 2 || formData.company.length > 100) {
      newErrors.company = "Please enter your current company name.";
    }

    if (!formData.experience || isNaN(formData.experience) || formData.experience < 0 || formData.experience > 50) {
      newErrors.experience = "Please enter a valid number of years (0-50).";
    }

    if (!formData.ctc || isNaN(formData.ctc) || formData.ctc < 0) {
      newErrors.ctc = "Please enter a valid salary amount.";
    }

    if (!formData.message || formData.message.length < 10 || formData.message.length > 500) {
      newErrors.message = "Please write a short message explaining why you are interested.";
    }

    if (!formData.attachment) {
      newErrors.attachment = "Please upload your resume.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      alert('Please complete the CAPTCHA before submitting.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/submitFormData', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Form submitted successfully');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Alumni Job Request Form</h2>
      <form onSubmit={handleSubmit} className="form">
        <p>Please fill the experience form:</p>

        <div className="form-group">
          <label>
            Name <span className="star">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>
            Personal Email ID <span className="star">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="user@example.com"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>
            Contact No. <span className="star">*</span>
          </label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            placeholder="10-15 digits"
          />
          {errors.contact && <p className="error">{errors.contact}</p>}
        </div>

        <div className="form-group">
          <label>Batch</label>
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="Enter your batch"
          />
          {errors.batch && <p className="error">{errors.batch}</p>}
        </div>

        <div className="form-group">
          <label>Preferred Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City or Country"
          />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>

        <div className="form-group">
          <label>Skillset</label>
          <input
            type="text"
            name="skillset"
            value={formData.skillset}
            onChange={handleChange}
            placeholder="Enter your skills"
          />
          {errors.skillset && <p className="error">{errors.skillset}</p>}
        </div>

        <div className="form-group">
          <label>Current Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter your company"
          />
          {errors.company && <p className="error">{errors.company}</p>}
        </div>

        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Years of experience"
          />
          {errors.experience && <p className="error">{errors.experience}</p>}
        </div>

        <div className="form-group">
          <label>Current CTC</label>
          <input
            type="number"
            name="ctc"
            value={formData.ctc}
            onChange={handleChange}
            placeholder="Current CTC"
          />
          {errors.ctc && <p className="error">{errors.ctc}</p>}
        </div>

        <div className="form-group">
          <label>Message <span className="star">*</span></label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Add a message"
          />
          {errors.message && <p className="error">{errors.message}</p>}
        </div>

        <div className="form-group">
          <label>Attachment</label>
          <input
            type="file"
            name="attachment"
            accept=".doc,.docx,.pdf,.png,.jpeg,.jpg,.zip"
            onChange={handleFileChange}
            required
          />
          {errors.attachment && <p className="error">{errors.attachment}</p>}
        </div>

        <div className="form-group">
          <ReCAPTCHA
            sitekey="6LfTa4MqAAAAAPijiIFkm7y4WOaxvYWvRR0JKTGY"
            onChange={handleCaptchaChange}
          />
        </div>

        <button type="submit" disabled={!captchaVerified || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default App;
