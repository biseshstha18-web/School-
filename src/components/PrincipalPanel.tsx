/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, MessageSquare, Edit3, Users, BookOpen, 
  CheckCircle, ShieldAlert, Star, FileText, AlertCircle, Save
} from 'lucide-react';
import { SchoolInfo, Student, Teacher, ComplaintSuggestion, LeaveApplication } from '../types';

interface PrincipalPanelProps {
  schoolInfo: SchoolInfo;
  students: Student[];
  teachers: Teacher[];
  complaints: ComplaintSuggestion[];
  leaves: LeaveApplication[];
  onUpdatePrincipalMessage: (message: string, principalName: string) => void;
  onApproveLeave: (leaveId: string, status: 'Approved' | 'Rejected') => void;
}

export default function PrincipalPanel({
  schoolInfo,
  students,
  teachers,
  complaints,
  leaves,
  onUpdatePrincipalMessage,
  onApproveLeave
}: PrincipalPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'message' | 'feedback' | 'leaves_review'>('dashboard');

  // Form states
  const [editedMessage, setEditedMessage] = useState(schoolInfo.principalMessage);
  const [editedName, setEditedName] = useState(schoolInfo.principalName);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrincipalMessage(editedMessage, editedName);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div id="principal-panel-root" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs self-start">
        <div className="text-center pb-6 border-b border-gray-100">
          <img 
            src={schoolInfo.principalPhoto} 
            alt={schoolInfo.principalName} 
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-indigo-50 ring-2 ring-indigo-600/10" 
          />
          <h2 className="mt-3 text-lg font-bold text-gray-900 tracking-tight">{schoolInfo.principalName}</h2>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mt-1 inline-block border border-indigo-100 uppercase">
            Head of Institution
          </span>
        </div>

        <nav id="principal-nav" className="space-y-1.5 mt-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" /> Principal Dashboard
          </button>

          <button
            onClick={() => setActiveTab('message')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'message'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Edit3 className="w-4 h-4" /> Edit Welcome Statement
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer relative ${
              activeTab === 'feedback'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Community Logs ({complaints.length})
          </button>

          <button
            onClick={() => setActiveTab('leaves_review')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer relative ${
              activeTab === 'leaves_review'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Review Student Leaves
            {pendingLeavesCount > 0 && (
              <span className="absolute right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {pendingLeavesCount}
              </span>
            )}
          </button>
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-100 text-[11px] text-gray-500 space-y-1.5 font-mono">
          <p>School Code: <span className="font-semibold text-gray-700">{schoolInfo.schoolCode}</span></p>
          <p>PAN Code: <span className="font-semibold text-gray-700">{schoolInfo.panNumber}</span></p>
          <p>Affiliation: <span className="font-semibold text-indigo-700">Koshi Gov, Nepal</span></p>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* TAB 1: PRINCIPAL METRICS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* KPI grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Total Students</p>
                <p className="text-3xl font-black text-indigo-900 mt-2">{students.length}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">Class 1 to Class 10</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Faculty count</p>
                <p className="text-3xl font-black text-indigo-900 mt-2">{teachers.length}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-1">Secondary and Primary</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Pending Leaves</p>
                <p className="text-3xl font-black text-indigo-900 mt-2">{pendingLeavesCount}</p>
                <p className="text-[10px] text-amber-600 font-bold mt-1">Awaiting Decision</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Feedback Logs</p>
                <p className="text-3xl font-black text-indigo-900 mt-2">{complaints.length}</p>
                <p className="text-[10px] text-blue-600 font-semibold mt-1">Parents / Teachers</p>
              </div>
            </div>

            {/* School Introduction & Quick message display */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100 flex justify-between items-center">
                <span>Active Welcome Message</span>
                <span className="text-xs text-gray-400 font-normal uppercase">Shown on school home page</span>
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed italic whitespace-pre-line mt-4 p-4 bg-slate-50 border border-slate-100/50 rounded-xl">
                "{schoolInfo.principalMessage}"
              </p>
            </div>

            {/* List of Teachers summary */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100">
                Staff & Instructor Directory
              </h3>
              <div className="divide-y divide-gray-100 text-xs mt-3">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="py-3 sm:flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={teacher.photo} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                      <div>
                        <p className="font-bold text-gray-900">{teacher.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{teacher.designation} • {teacher.subject}</p>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-gray-500 font-mono mt-1 sm:mt-0">
                      {teacher.contact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: EDIT MESSAGE */}
        {activeTab === 'message' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" /> Modify Welcoming & Philosophy Message
              </h3>
              <p className="text-xs text-gray-500 mt-1">Updates save to local memory storage and instantly refresh in public splash sections.</p>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-green-600" /> Principal Welcoming details saved and refreshed globally!
              </div>
            )}

            <form onSubmit={handleSaveMessageSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Principal Legal Full Name</label>
                  <input 
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Title Designation</label>
                  <input 
                    type="text"
                    value="Principal & Chairman"
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-gray-500 font-semibold"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Welcoming Message Content</label>
                <textarea 
                  rows={8}
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 leading-relaxed font-sans"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" /> Save Welcoming message
              </button>
            </form>
          </motion.div>
        )}

        {/* TAB 3: COMMUNITY FEEDBACK & SUGGESTIONS */}
        {activeTab === 'feedback' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> Community Grievance & Suggestion Logs
            </h3>
            
            <div className="divide-y divide-gray-100 mt-4">
              {complaints.length === 0 ? (
                <p className="text-center py-12 text-gray-400 text-xs">No feedback or suggestions registered currently.</p>
              ) : (
                complaints.map((comp) => (
                  <div key={comp.id} className="py-4 space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          comp.type === 'Complaint' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {comp.type}
                        </span>
                        <p className="font-bold text-gray-900 mt-1.5">{comp.senderName}</p>
                      </div>
                      <span className="font-mono text-[10px] text-gray-400">{comp.date}</span>
                    </div>
                    <p className="text-gray-600 bg-slate-50 p-3 rounded-lg border border-slate-100/50 leading-relaxed italic">
                      "{comp.content}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: REVIEW STUDENT LEAVES */}
        {activeTab === 'leaves_review' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" /> Academic Leave Request Review Panel
            </h3>

            <div className="divide-y divide-gray-100 mt-4">
              {leaves.length === 0 ? (
                <p className="text-center py-12 text-gray-400 text-xs">No leaves recorded in memory database.</p>
              ) : (
                leaves.map((leave) => (
                  <div key={leave.id} className="py-4 space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {leave.studentName} <span className="font-normal text-gray-500 font-mono text-[10px]">({leave.className} - {leave.section})</span>
                        </h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Applied: {leave.appliedDate} | Target Leave: {leave.startDate} to {leave.endDate}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          leave.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : leave.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                      Reason: "{leave.reason}"
                    </p>

                    {leave.status === 'Pending' && (
                      <div className="flex gap-2 pt-1.5 justify-end">
                        <button
                          onClick={() => onApproveLeave(leave.id, 'Approved')}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          ✓ Approve Leave
                        </button>
                        <button
                          onClick={() => onApproveLeave(leave.id, 'Rejected')}
                          className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          ✕ Reject Leave
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
