import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../api/formDataApi';
import UserGrid from '../components/UserGrid';
import AssignModal from '../components/AssignModal';
import { Users, Loader2 } from 'lucide-react';
import './AdminPage.css'; // Import the CSS file

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

 const  navigate  = useNavigate();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="content-wrapper">
        <div className="header-section">
          <div className="header-left">
            <Users className="header-icon" />
            <h1 className="header-title">Admin Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="user-count-badge">
              <span className="badge">{users.length} Users</span>
            </div>
            <button
              className="go-to-company-btn"
              onClick={() => navigate('/companies')}
            >
              Go to Company Page
            </button>
          </div>
        </div>

        <div className="main-card">
          {users.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">No users found in the system.</p>
            </div>
          ) : (
            <div className="users-grid-container">
              <UserGrid
                users={users}
                onAssign={(userId) => {
                  const user = users.find((u) => u._id === userId);
                  setSelectedUser(user);
                }}
              />
            </div>
          )}
        </div>

        {selectedUser && (
          <AssignModal
            userId={selectedUser._id}
            userSkill={selectedUser.skillset}
            resumePath={selectedUser.attachment}
            onClose={() => setSelectedUser(null)}
            refresh={fetchUsers}
          />
        )}
      </div>
    </div>
  );
}
