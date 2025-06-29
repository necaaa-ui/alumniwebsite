import React, { useEffect, useState } from 'react';
import { addCompany, updateCompany } from '../api/companyApi';
import { Building2, Briefcase, FileText, Globe, Upload, Wrench } from 'lucide-react';
import './CompanyForm.css';

export default function CompanyForm({ refresh, editingCompany }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    skillsRequired: '',
    url: '',
    poster: null,
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (editingCompany) {
      setFormData({
        name: editingCompany.name || '',
        role: editingCompany.role || '',
        description: editingCompany.description || '',
        skillsRequired: editingCompany.skillsRequired?.join(', ') || '',
        url: editingCompany.url || '',
        deadline: editingCompany?.deadline || '',
        poster: null,
      });
    } else {
      setFormData({
        name: '',
        role: '',
        description: '',
        skillsRequired: '',
        url: '',
        poster: null,
      });
    }
  }, [editingCompany]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, poster: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'poster' && formData[key]) {
        data.append(key, formData[key]);
      } else if (key !== 'poster') {
        data.append(key, formData[key]);
      }
    });

    if (editingCompany) {
      await updateCompany(editingCompany._id, data);
    } else {
      await addCompany(data);
    }

    setFormData({
      name: '',
      role: '',
      description: '',
      skillsRequired: '',
      url: '',
      deadline: '',
      poster: null,
    });
    setPreviewUrl(null);
    refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="company-form">
      <div className="form-header">
        <div className="form-icon">
          <Building2 className="icon" />
        </div>
        <h2 className="form-title">
          {editingCompany ? 'Edit Company' : 'Add New Company'}
        </h2>
      </div>

      <div className="form-grid">
        <div className="form-column">
          <div className="form-group">
            <label className="form-label">
              <Building2 size={16} />
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Briefcase size={16} />
              Job Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Wrench size={16} />
              Required Skills
            </label>
            <input
              type="text"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, TypeScript"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Globe size={16} />
              Company URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label className="form-label">
              <FileText size={16} />
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={16} />
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Upload size={16} />
              Company Poster
            </label>
            <div
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="preview-container">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />
                  <div className="preview-overlay">
                    <span>Click or drag to change</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload className="upload-icon" />
                  <p>Drag and drop or click to upload</p>
                </div>
              )}
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={handleChange}
                className="file-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {editingCompany ? 'Update Company' : 'Add Company'}
        </button>
      </div>
    </form>
  );
}