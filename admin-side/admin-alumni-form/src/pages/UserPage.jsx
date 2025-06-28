import React, { useEffect, useState } from 'react';
import { getUserByEmail, updateStatus } from '../api/formDataApi';
import { getCompanyById } from '../api/companyApi';
import CompanyCard from '../components/CompanyCard';
import { Building2, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {token} = useParams();
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

  const handleStatusChange = async (companyId, newStatus) => {
    await updateStatus(user._id, companyId, newStatus);

    setCompanyData((prev) =>
      prev.map((entry) =>
        entry.assignedCompanyId === companyId ||
        entry.assignedCompanyId?._id === companyId
          ? { ...entry, status: newStatus }
          : entry
      )
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state - User not found
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <p className="font-medium">No User Found</p>
            <p className="text-sm mt-1">The user with this email does not exist in our system.</p>
          </div>
        </div>
      </div>
    );
  }

  // User found but no companies assigned
  if (user && companyData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md">
            <p className="font-medium">No Companies Assigned</p>
            <p className="text-sm mt-1">This user currently has no companies assigned.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Building2 className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Assigned Companies</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companyData.map((entry, idx) => (
            <div 
              key={entry.company._id || idx} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <CompanyCard company={entry.company} showActions={false} />
                
                <div className="mt-6 space-y-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusChange(entry.company._id, 'completed')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        entry.status === 'completed' 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Completed
                    </button>

                    <button
                      onClick={() => handleStatusChange(entry.company._id, 'not applicable')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        entry.status === 'not applicable' 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Not applicable
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : entry.status === 'not applicable'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
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