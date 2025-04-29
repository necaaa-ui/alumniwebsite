import React, { useEffect, useState } from 'react';
import { addCompany, updateCompany } from '../api/companyApi';
import { Building2, Briefcase, FileText, Globe, Upload, Wrench } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
          <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {editingCompany ? 'Edit Company' : 'Add New Company'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Building2 size={16} />
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Briefcase size={16} />
              Job Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Wrench size={16} />
              Required Skills
            </label>
            <input
              type="text"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, TypeScript"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Globe size={16} />
              Company URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText size={16} />
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px]"
              required
            ></textarea>
          </div>

          <div className="space-y-2">
  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
    <FileText size={16} />
    Application Deadline
  </label>
  <input
    type="date"
    name="deadline"
    value={formData.deadline}
    onChange={handleChange}
    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    required
  />
</div>


          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Upload size={16} />
              Company Poster
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">Click or drag to change</span>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop or click to upload
                  </p>
                </div>
              )}
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {editingCompany ? 'Update Company' : 'Add Company'}
        </button>
      </div>
    </form>
  );
}