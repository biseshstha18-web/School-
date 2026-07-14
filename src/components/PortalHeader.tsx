/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { School, UserCheck, Shield, Award, Users, RefreshCw } from 'lucide-react';
import { SchoolInfo } from '../types';

interface PortalHeaderProps {
  schoolInfo: SchoolInfo;
  currentRole: 'Landing' | 'Student' | 'Teacher' | 'Parent' | 'Principal' | 'Admin';
  onRoleChange: (role: 'Landing' | 'Student' | 'Teacher' | 'Parent' | 'Principal' | 'Admin') => void;
  selectedStudentId: string;
  onStudentChange: (id: string) => void;
  studentsList: { id: string; name: string; className: string }[];
  selectedTeacherId: string;
  onTeacherChange: (id: string) => void;
  teachersList: { id: string; name: string; designation: string }[];
}

export default function PortalHeader({
  schoolInfo,
  currentRole,
  onRoleChange,
  selectedStudentId,
  onStudentChange,
  studentsList,
  selectedTeacherId,
  onTeacherChange,
  teachersList
}: PortalHeaderProps) {
  return (
    <header id="portal-header" className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* School Name & Motto Brand Block */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center shrink-0">
              <School className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 tracking-wider uppercase font-mono">
                {schoolInfo.nepaliName}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {schoolInfo.name}
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                {schoolInfo.motto} | <span className="text-gray-400">{schoolInfo.address}</span>
              </p>
            </div>
          </div>

          {/* Quick Role Sandbox Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 self-start md:self-auto">
            <span className="text-xs font-bold text-gray-500 px-2 font-mono flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-gray-400" /> SANDBOX:
            </span>
            
            <button
              id="role-btn-landing"
              onClick={() => onRoleChange('Landing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'Landing'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Public Home
            </button>

            <button
              id="role-btn-student"
              onClick={() => onRoleChange('Student')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'Student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Student
            </button>

            <button
              id="role-btn-parent"
              onClick={() => onRoleChange('Parent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'Parent'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Parent
            </button>

            <button
              id="role-btn-teacher"
              onClick={() => onRoleChange('Teacher')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'Teacher'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Teacher
            </button>

            <button
              id="role-btn-principal"
              onClick={() => onRoleChange('Principal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'Principal'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Principal
            </button>

            <button
              id="role-btn-admin"
              onClick={() => onRoleChange('Admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'Admin'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Quick context info for student selection (to test the portal under different student accounts) */}
        {(currentRole === 'Student' || currentRole === 'Parent') && (
          <div className="bg-blue-50/50 border-t border-blue-100 py-2 px-4 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center justify-between text-xs text-blue-800">
            <div className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Viewing portal as: <strong>{studentsList.find(s => s.id === selectedStudentId)?.name}</strong> ({studentsList.find(s => s.id === selectedStudentId)?.className})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">Switch Student Context:</span>
              <select
                id="student-context-select"
                value={selectedStudentId}
                onChange={(e) => onStudentChange(e.target.value)}
                className="bg-white border border-blue-200 text-blue-900 rounded-lg py-1 px-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {studentsList.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} ({std.className})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentRole === 'Teacher' && (
          <div className="bg-emerald-50/50 border-t border-emerald-100 py-2 px-4 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Viewing portal as Instructor: <strong>{teachersList.find(t => t.id === selectedTeacherId)?.name}</strong> ({teachersList.find(t => t.id === selectedTeacherId)?.designation})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600">Switch Teacher Context:</span>
              <select
                id="teacher-context-select"
                value={selectedTeacherId}
                onChange={(e) => onTeacherChange(e.target.value)}
                className="bg-white border border-emerald-200 text-emerald-900 rounded-lg py-1 px-2 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {teachersList.map((tea) => (
                  <option key={tea.id} value={tea.id}>
                    {tea.name} ({tea.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
