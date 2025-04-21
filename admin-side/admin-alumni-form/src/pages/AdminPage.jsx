import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/formDataApi';
import UserGrid from '../components/UserGrid';
import AssignModal from '../components/AssignModal';
import { Users, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {users.length} Users
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No users found in the system.</p>
            </div>
          ) : (
            <div className="p-6">
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