import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../lib/animations';
import { BadgeCheck, Building2, Briefcase } from 'lucide-react';
import './UserGrid.css';

export default function UserGrid({ users = [], onAssign }) {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'not applicable':
        return 'status-not-applicable';
      default:
        return 'status-default';
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="user-grid"
    >
      {users.map((user) => (
        <motion.div
          key={user._id}
          variants={fadeInUp}
          className="user-card"
        >
          <div className="user-card-content">
            {/* User Info */}
            <div className="user-info">
              <div className="user-header">
                <h2 className="user-name">
                  {user.name}
                </h2>
                <span className="user-status">
                  Active
                </span>
              </div>
              <div className="user-email-container">
                <Building2 className="user-email-icon" />
                <p className="user-email">{user.email}</p>
              </div>
              <div className="user-skills-container">
                <div className="user-skills-header">
                  <Briefcase className="user-skills-icon" />
                  <h4 className="user-skills-title">Skills</h4>
                </div>
                <p className="user-skills-text">{user.skillset}</p>
              </div>
            </div>

            {/* Application Status */}
            <div className="application-status">
              <div className="application-status-header">
                <BadgeCheck className="application-status-icon" />
                <h3 className="application-status-title">Application Status</h3>
              </div>
              {user.applicationStatus && user.applicationStatus.length > 0 ? (
                user.applicationStatus.map((appStatus, index) => (
                  <div 
                    key={index} 
                    className="application-item"
                  >
                    <div className="application-item-content">
                      <div className="application-item-info">
                        <p className="application-company-name">
                          {appStatus.assignedCompanyId?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className={`application-status-badge ${getStatusClass(appStatus.status)}`}>
                        {appStatus.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-applications">
                  <p className="no-applications-text">No applications yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="user-card-actions">
            <button
              onClick={() => onAssign(user._id)}
              className="assign-button"
            >
              Assign Company
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}