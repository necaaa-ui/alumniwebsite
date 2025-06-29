import React, { useEffect, useState } from 'react';
import { getCompanies } from '../api/companyApi';
import { assignCompany } from '../api/formDataApi';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Download, Plus } from 'lucide-react';
import './AssignModel.css'; // Import the CSS file

export default function AssignModal({ userId, userSkill, onClose, refresh, resumePath }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // Add dark mode state if needed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const res = await getCompanies();
        setCompanies(res.data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const toggleCompanySelection = (companyId) => {
    setSelectedCompanyIds((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleBulkAssign = async () => {
    try {
      for (const id of selectedCompanyIds) {
        await assignCompany(userId, id);
      }
      refresh();
      onClose();
    } catch (error) {
      console.error("Error assigning companies:", error);
    }
  };

const getFileName = (path) => path?.split(/[/\\]/).pop();

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${isDarkMode ? 'dark' : ''}`}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">Assign Companies</h2>
            <button 
              onClick={onClose}
              className="close-button"
              aria-label="Close"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Resume Section */}
          {resumePath ? (
            <div className={`resume-section ${isDarkMode ? 'dark' : ''}`}>
              <h3 className={`resume-title ${isDarkMode ? 'dark' : ''}`}>
                User Resume
              </h3>
              
              <div className={`resume-container ${isDarkMode ? 'dark' : ''}`}>
                {resumePath.endsWith('.pdf') ? (
                  <iframe
                    src={`https://alumni-job-form.onrender.com/uploads/${resumePath}`}
                    title="Resume"
                    className="resume-iframe"
                  />
                ) : (
                  <img
                    src={`https://alumni-job-form.onrender.com/uploads/${resumePath}`}
                    alt="User Resume"
                    className="resume-image"
                  />
                )}
              </div>
              
              <a
                href={`https://alumni-job-form.onrender.com/uploads/${resumePath}`}
                download={getFileName(resumePath)}
                className="download-button"
              >
                <Download size={16} />
                Download Resume
              </a>
            </div>
          ) : (
            <div className={`no-resume ${isDarkMode ? 'dark' : ''}`}>
              <p className={`no-resume-text ${isDarkMode ? 'dark' : ''}`}>No resume uploaded.</p>
            </div>
          )}

          {/* Companies Section */}
          <div className="companies-section">
            <div className="companies-header">
              <h3 className={`companies-title ${isDarkMode ? 'dark' : ''}`}>Available Companies</h3>
              <div className={`user-skill-badge ${isDarkMode ? 'dark' : ''}`}>
                User Skill: <span className={`skill-tag ${isDarkMode ? 'dark' : ''}`}>{userSkill}</span>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : companies.length === 0 ? (
              <div className={`no-companies ${isDarkMode ? 'dark' : ''}`}>
                <p className={`no-companies-text ${isDarkMode ? 'dark' : ''}`}>No companies available for assignment.</p>
                <button
                  onClick={() => navigate('/companies')}
                  className="add-companies-button"
                >
                  <Plus size={16} />
                  Add Companies
                </button>
              </div>
            ) : (
              <div className="companies-grid">
                {companies.map((c) => {
                  const isSelected = selectedCompanyIds.includes(c._id);
                  const matchingSkills = c.skillsRequired?.some(skill => userSkill.includes(skill)) || false;
                  
                  return (
                    <div
                      key={c._id}
                      className={`company-card ${isSelected ? 'selected' : ''} ${isDarkMode ? 'dark' : ''}`}
                    >
                      {matchingSkills && (
                        <div className={`skill-match-badge ${isDarkMode ? 'dark' : ''}`}>
                          Skill Match
                        </div>
                      )}
                      
                      <div className="company-card-content">
                        <label className="company-label">
                          <div className="checkbox-container">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCompanySelection(c._id)}
                              className="checkbox-input"
                              aria-labelledby={`company-name-${c._id}`}
                            />
                            <div className={`checkbox-visual ${isSelected ? 'checked' : ''} ${isDarkMode ? 'dark' : ''}`}>
                              {isSelected && <CheckCircle size={16} />}
                            </div>
                          </div>
                          
                          <div className="company-details">
                            <h3 id={`company-name-${c._id}`} className={`company-name ${isDarkMode ? 'dark' : ''}`}>
                              {c.name}
                            </h3>
                            <div className="company-info">
                              <p className="company-info-row">
                                <span className={`company-info-label ${isDarkMode ? 'dark' : ''}`}>Role:</span>
                                <span className={`company-info-value ${isDarkMode ? 'dark' : ''}`}>{c.role}</span>
                              </p>
                              <p className="company-info-row">
                                <span className={`company-info-label ${isDarkMode ? 'dark' : ''}`}>Required Skills:</span>
                                <span className={`company-info-value ${isDarkMode ? 'dark' : ''}`}>
                                  {c.skillsRequired?.join(', ') || 'N/A'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`action-buttons ${isDarkMode ? 'dark' : ''}`}>
            <button
              onClick={onClose}
              className={`cancel-button ${isDarkMode ? 'dark' : ''}`}
            >
              Cancel
            </button>
            
            <div className="action-right">
              <span className={`selected-count ${isDarkMode ? 'dark' : ''}`}>
                {selectedCompanyIds.length} selected
              </span>
              <button
                onClick={handleBulkAssign}
                disabled={selectedCompanyIds.length === 0}
                className={`assign-button ${
                  selectedCompanyIds.length > 0 ? 'enabled' : 'disabled'
                } ${isDarkMode ? 'dark' : ''}`}
              >
                Assign Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}