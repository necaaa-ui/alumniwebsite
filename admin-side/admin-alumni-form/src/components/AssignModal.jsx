import React, { useEffect, useState } from 'react';
import { getCompanies } from '../api/companyApi';
import { assignCompany } from '../api/formDataApi';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Download, Plus } from 'lucide-react';

export default function AssignModal({ userId, userSkill, onClose, refresh, resumePath }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const getFileName = (path) => path?.split('\\').pop();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-in-out"
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Assign Companies</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
              aria-label="Close"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Resume Section */}
          {resumePath ? (
            <div className="mb-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                User Resume
              </h3>
              
              <div className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden">
                {resumePath.endsWith('.pdf') ? (
                  <iframe
                    src={`http://localhost:5000/uploads/${resumePath.split('uploads\\')[1]}`}
                    title="Resume"
                    className="w-full h-72 border-0"
                  />
                ) : (
                  <img
                    src={`http://localhost:5000/uploads/${resumePath.split('uploads\\')[1]}`}
                    alt="User Resume"
                    className="w-full max-h-72 object-contain mx-auto"
                  />
                )}
              </div>
              
              <a
                href={`http://localhost:5000/uploads/${resumePath.split('uploads\\')[1]}`}
                download={getFileName(resumePath)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Download size={16} />
                Download Resume
              </a>
            </div>
          ) : (
            <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center border border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400">No resume uploaded.</p>
            </div>
          )}

          {/* Companies Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Available Companies</h3>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                User Skill: <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">{userSkill}</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No companies available for assignment.</p>
                <button
                  onClick={() => navigate('/companies')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
                >
                  <Plus size={16} />
                  Add Companies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {companies.map((c) => {
                  const isSelected = selectedCompanyIds.includes(c._id);
                  const matchingSkills = c.skillsRequired?.some(skill => userSkill.includes(skill)) || false;
                  
                  return (
                    <div
                      key={c._id}
                      className={`relative border rounded-lg overflow-hidden transition-all duration-200 ${
                        isSelected 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md transform scale-[1.01]' 
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
                      }`}
                    >
                      {matchingSkills && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            Skill Match
                          </span>
                        </div>
                      )}
                      
                      <div className="p-5">
                        <label className="flex items-start gap-4 cursor-pointer">
                          <div className="relative flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCompanySelection(c._id)}
                              className="sr-only"
                              aria-labelledby={`company-name-${c._id}`}
                            />
                            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                              isSelected 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {isSelected && <CheckCircle size={16} />}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 id={`company-name-${c._id}`} className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {c.name}
                            </h3>
                            <div className="space-y-1.5 mt-2">
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Role:</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{c.role}</span>
                              </p>
                              <p className="text-sm flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Required Skills:</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
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
          <div className="flex justify-between items-center mt-8 border-t dark:border-gray-700 pt-6">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCompanyIds.length} selected
              </span>
              <button
                onClick={handleBulkAssign}
                disabled={selectedCompanyIds.length === 0}
                className={`px-5 py-2.5 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedCompanyIds.length
                    ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
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