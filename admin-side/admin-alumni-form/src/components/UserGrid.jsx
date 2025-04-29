import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../lib/animations';
import { BadgeCheck, Building2, Briefcase } from 'lucide-react';

export default function UserGrid({ users = [], onAssign }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {users.map((user) => (
        <motion.div
          key={user._id}
          variants={fadeInUp}
          className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100"
        >
          <div className="p-6">
            {/* User Info */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {user.name}
                </h2>
                <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center text-slate-600 mb-3">
                <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                <p className="text-sm">{user.email}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 group-hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center mb-2">
                  <Briefcase className="w-4 h-4 text-slate-500 mr-2" />
                  <h4 className="text-sm font-medium text-slate-700">Skills</h4>
                </div>
                <p className="text-sm text-slate-600">{user.skillset}</p>
              </div>
            </div>

            {/* Application Status */}
            <div className="space-y-3">
              <div className="flex items-center">
                <BadgeCheck className="w-4 h-4 text-slate-500 mr-2" />
                <h3 className="font-medium text-slate-800">Application Status</h3>
              </div>
              {user.applicationStatus && user.applicationStatus.length > 0 ? (
                user.applicationStatus.map((appStatus, index) => (
                  <div 
                    key={index} 
                    className="bg-slate-50 rounded-lg p-4 border border-slate-100 group-hover:border-blue-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700 mb-1">
                          {appStatus.assignedCompanyId?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className={`
                        text-xs px-3 py-1 rounded-full font-medium flex items-center
                        ${appStatus.status.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                          appStatus.status.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600' :
                          appStatus.status.toLowerCase() === 'not applicable' ? 'bg-rose-50 text-rose-600' :
                          'bg-slate-100 text-slate-600'}
                      `}>
                        {appStatus.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 rounded-lg p-4 text-center group-hover:bg-blue-50/50 transition-colors">
                  <p className="text-sm text-slate-500">No applications yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => onAssign(user._id)}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium
                hover:bg-blue-600 active:bg-blue-700 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500/20
                group-hover:shadow-md"
            >
              Assign Company
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}