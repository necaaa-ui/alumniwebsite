import React, { useEffect, useState } from 'react';
import { getCompanies, deleteCompany } from '../api/companyApi';
import CompanyCard from '../components/CompanyCard';
import CompanyForm from '../components/CompanyForm';
import { Building2, Loader2 } from 'lucide-react';
import './CompanyPage.css'; // Import the CSS file

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const res = await getCompanies();
      setCompanies(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteCompany(id);
    fetchCompanies();
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
  };

  const handleFormClose = () => {
    setEditingCompany(null);
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="header-left">
            <Building2 className="header-icon" />
            <h1 className="header-title">Company Dashboard</h1>
          </div>
          <div className="header-right">
            <span className="company-count-badge">
              {companies.length} Companies
            </span>
          </div>
        </div>

        <div className="form-container">
          <div className="form-content">
            <CompanyForm
              refresh={handleFormClose}
              editingCompany={editingCompany}
            />
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No companies found. Add your first company above.</p>
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map((company) => (
              <div
                key={company._id}
                className="company-card-wrapper"
              >
                <div className="company-card-content">
                  <CompanyCard
                    company={company}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}