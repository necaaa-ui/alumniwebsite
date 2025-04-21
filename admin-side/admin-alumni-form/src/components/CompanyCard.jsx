import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function CompanyCard({ company, onDelete, onEdit, showActions = true }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img
          src={`http://localhost:5000/uploads/${company.poster}`}
          className="h-48 w-full object-cover"
          alt={`${company.name} poster`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-5">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
            {company.name}
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {company.role}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {company.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                >
                  {skill}
                </span>
              )) || (
                <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No skills listed
                </span>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onEdit(company)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              aria-label={`Edit ${company.name}`}
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete(company._id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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