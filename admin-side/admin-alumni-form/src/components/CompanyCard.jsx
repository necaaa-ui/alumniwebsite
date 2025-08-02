import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import './CompanyCard.css';

export default function CompanyCard({ company, onDelete, onEdit, showActions = true }) {
  return (
    <div className="company-card">
      <div className="image-container">
        <img
          src={`http://localhost:5000/uploads/${company.poster}`}
          className="company-image"
          alt={`${company.name} poster`}
        />
        <div className="image-overlay" />
      </div>

      <div className="card-content">
        <div className="content-space">
          <h2 className="company-title">
            {company.name}
          </h2>
          
          <div className="details-space">
            <div className="role-container">
              <span className="role-text">
                {company.role}
              </span>
            </div>
            
            <div className="skills-container">
              {company.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="skill-tag"
                >
                  {skill}
                </span>
              )) || (
                <span className="no-skills">
                  No skills listed
                </span>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="actions-container">
            <button
              onClick={() => onEdit(company)}
              className="edit-button"
              aria-label={`Edit ${company.name}`}
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete(company._id)}
              className="delete-button"
              aria-label={`Delete ${company.name}`}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}