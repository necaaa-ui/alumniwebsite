import React, { useEffect, useState } from 'react';
import { getUserByEmail, updateStatus } from '../api/formDataApi';
import { getCompanyById } from '../api/companyApi';
import CompanyCard from '../components/CompanyCard';
import { Building2, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './UserPage.css';

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {token} = useParams();
  const detailedStatusOptions = [
  "Received intimation from company side",
  "Successfully cleared the rounds",
  "Failed to qualify for further rounds",
  "Received offer letter",
];
  const email = token;
  console.log(email)

  useEffect(() => {
    if (email) {
      setLoading(true);
      getUserByEmail(email)
        .then(async (res) => {
          const userData = res.data;
          setUser(userData);

          if (Array.isArray(userData.applicationStatus)) {
            const companyStatusList = await Promise.all(
              userData.applicationStatus.map(async (statusEntry) => {
                let company = statusEntry.assignedCompanyId;

                if (typeof company === 'string') {
                  const res = await getCompanyById(company);
                  company = res.data;
                }

                return {
                  ...statusEntry,
                  company,
                };
              })
            );

            setCompanyData(companyStatusList);
          } else {
            console.warn('applicationStatus is not an array:', userData.applicationStatus);
            setCompanyData([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setError('User not found');
          setUser(null);
          setLoading(false);
        });
    }
  }, [email]);

  const handleStatusChange = async (companyId, newStatus,detailedStatus) => {
    await updateStatus(user._id, companyId, newStatus,detailedStatus);

    setCompanyData((prev) =>
      prev.map((entry) =>
        entry.assignedCompanyId === companyId ||
        entry.assignedCompanyId?._id === companyId
          ? { ...entry, status: newStatus,detailedStatus:detailedStatus }
          : entry
      )
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state - User not found
  if (error || !user) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-message">
            <p className="error-title">No User Found</p>
            <p className="error-description">The user with this email does not exist in our system.</p>
          </div>
        </div>
      </div>
    );
  }

  // User found but no companies assigned
  if (user && companyData.length === 0) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="warning-message">
            <p className="error-title">No Companies Assigned</p>
            <p className="error-description">This user currently has no companies assigned.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-page-content">
        <div className="page-header">
          <Building2 className="header-icon" />
          <h1 className="page-title">Assigned Companies</h1>
        </div>

        <div className="companies-grid">
          {companyData.map((entry, idx) => (
            <div key={entry.company._id || idx} className="company-card">
              <div className="company-card-content">
                <CompanyCard company={entry.company} showActions={false} />

                <div className="status-controls">
                  <div className="status-buttons">
                    <button
                      onClick={() =>
                        handleStatusChange(entry.company._id, "completed")
                      }
                      className={`status-button ${
                        entry.status === "completed"
                          ? "status-button-completed"
                          : "status-button-inactive"
                      }`}
                    >
                      Completed
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(entry.company._id, "not applicable")
                      }
                      className={`status-button ${
                        entry.status === "not applicable"
                          ? "status-button-not-applicable"
                          : "status-button-inactive"
                      }`}
                    >
                      Not applicable
                    </button>
                  </div>

                  <div className="status-display">
                    <span className="status-label">Status</span>
                    <span
                      className={`status-badge ${
                        entry.status === "completed"
                          ? "status-badge-completed"
                          : entry.status === "not applicable"
                          ? "status-badge-not-applicable"
                          : "status-badge-default"
                      }`}
                    >
                      {entry.status.charAt(0).toUpperCase() +
                        entry.status.slice(1)}
                    </span>
                  </div>

                  <div className="detailed-status-controls">
                    <label className="status-label">Detailed Status</label>
                    <select
                      value={entry.detailedStatus || "Not updated"}
                      onChange={(e) =>
                        handleStatusChange(
                          entry.company._id,
                          entry.status,
                          e.target.value
                        )
                      }
                      className="detailed-status-dropdown"
                    >
                      <option value="Not updated">-- Select Status --</option>
                      {detailedStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}