import React, { useEffect, useState } from 'react';
import { getCompanies, deleteCompany } from '../api/companyApi';
import CompanyCard from '../components/CompanyCard';
import CompanyForm from '../components/CompanyForm';
import { Building2, Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {companies.length} Companies
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <CompanyForm
              refresh={handleFormClose}
              editingCompany={editingCompany}
            />
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No companies found. Add your first company above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div 
                key={company._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
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