/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Calendar, BookOpen, GraduationCap, CreditCard, 
  Send, MessageSquare, ShieldAlert, CheckCircle, HelpCircle, UserCheck 
} from 'lucide-react';
import { 
  Student, StudentAttendance, Homework, StudentTermMark, StudentFee, 
  ComplaintSuggestion 
} from '../types';

interface ParentPanelProps {
  student: Student;
  attendance: StudentAttendance;
  homeworks: Homework[];
  marks: StudentTermMark[];
  fees: StudentFee;
  onAddSuggestion: (suggestion: Omit<ComplaintSuggestion, 'id' | 'date'>) => void;
  onPayFee: (feeId: string, method: string) => void;
}

export default function ParentPanel({
  student,
  attendance,
  homeworks,
  marks,
  fees,
  onAddSuggestion,
  onPayFee
}: ParentPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'academics' | 'financials' | 'admin_desk'>('overview');
  
  // Suggestion Form State
  const [suggestionContent, setSuggestionContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [suggestionSuccess, setSuggestionSuccess] = useState(false);

  // Stats calculation
  const totalDays = attendance?.records?.length || 0;
  const presentDays = attendance?.records?.filter(r => r.status === 'Present').length || 0;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  // Selected Term
  const [selectedTerm, setSelectedTerm] = useState<'First Term' | 'Second Term' | 'Final Exam'>('First Term');
  const termMark = marks.find(m => m.term === selectedTerm);

  // Unpaid balance
  const unpaidFeeAmount = fees.feeItems.filter(f => !f.isPaid).reduce((sum, f) => sum + f.amount, 0);

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionContent) return;
    onAddSuggestion({
      senderName: isAnonymous ? 'Anonymous Parent' : `${student.parentName} (Parent of ${student.name})`,
      role: isAnonymous ? 'Anonymous' : 'Parent',
      type: 'Suggestion',
      content: suggestionContent
    });
    setSuggestionContent('');
    setSuggestionSuccess(true);
    setTimeout(() => setSuggestionSuccess(false), 3000);
  };

  return (
    <div id="parent-panel-root" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Guardian Profile Card */}
      <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs self-start">
        <div className="pb-6 border-b border-gray-100 text-center sm:text-left">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 flex items-center justify-center mx-auto sm:mx-0">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-gray-900 tracking-tight">{student.parentName}</h2>
          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold mt-1 inline-block border border-amber-100 uppercase">
            Registered Guardian
          </span>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Contact: <span className="font-semibold text-gray-800">{student.parentContact}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium">
            Email: <span className="font-semibold text-gray-800">{student.parentEmail}</span>
          </p>
        </div>

        {/* Selected Child Info */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-100 mt-4 text-xs space-y-2">
          <p className="font-bold text-gray-500 font-mono text-[9px] uppercase">Tracked Ward Information</p>
          <div className="flex items-center gap-2.5">
            <img src={student.photo} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
            <div>
              <p className="font-bold text-gray-900">{student.name}</p>
              <p className="text-[10px] text-gray-400 font-semibold">{student.className} - Section A</p>
            </div>
          </div>
        </div>

        <nav id="parent-nav" className="space-y-1.5 mt-6">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" /> Child Ward Overview
          </button>

          <button
            onClick={() => setActiveSubTab('academics')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeSubTab === 'academics'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Academic Results
          </button>

          <button
            onClick={() => setActiveSubTab('financials')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeSubTab === 'financials'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Fee Portal ({unpaidFeeAmount > 0 ? `Rs. ${unpaidFeeAmount}` : 'Cleared'})
          </button>

          <button
            onClick={() => setActiveSubTab('admin_desk')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeSubTab === 'admin_desk'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Administrator Feedback
          </button>
        </nav>
      </div>

      {/* Main Panel Content Area */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeSubTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* AI Center Promotion Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 rounded-3xl border border-indigo-850 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-bold uppercase text-[9px] rounded font-mono">
                  ✨ NEW FEATURE UPGRADE
                </span>
                <h4 className="font-extrabold text-sm tracking-tight text-white">Shree Aadarsha AI Suite & Parent Liaison Hub</h4>
                <p className="text-gray-300 leading-relaxed">
                  Discuss current events with Search Grounded AI, start real-time vocal sessions with Gemini Live, analyze curriculum videos, or direct-message teachers with automated writing assistance!
                </p>
              </div>
              <p className="text-[10px] text-amber-300 font-mono italic shrink-0">
                Click floating button below to open ↗
              </p>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-emerald-800 uppercase tracking-wider font-mono">Ward Attendance Status</p>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-[10px]">Excellent</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-emerald-950">{attendanceRate}%</span>
                  <span className="text-gray-500">Present days: {presentDays} / {totalDays}</span>
                </div>
                <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${attendanceRate}%` }}></div>
                </div>
                <p className="text-[10px] text-emerald-700">Satisfies the minimum required 75% school board mandate.</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-amber-800 uppercase tracking-wider font-mono">Assigned Homework Progress</p>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold text-[10px]">Tracked</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-amber-950">
                    {homeworks.filter(h => h.submissions.some(s => s.studentId === student.id)).length} / {homeworks.length}
                  </span>
                  <span className="text-gray-500">Completed Assignments</span>
                </div>
                <div className="w-full bg-amber-200/50 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${(homeworks.filter(h => h.submissions.some(s => s.studentId === student.id)).length / homeworks.length) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-amber-700">Kindly remind {student.name} to complete any overdue assignments daily.</p>
              </div>
            </div>

            {/* Attendance detailed log */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" /> Ward Registration Attendance History
              </h3>
              <div className="flex flex-wrap gap-2 mt-4">
                {attendance.records.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex flex-col items-center border ${
                      rec.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                        : 'bg-rose-50 text-rose-800 border-rose-100'
                    }`}
                  >
                    <span>{rec.date.split('-')[2]}</span>
                    <span className="text-[9px] uppercase font-sans mt-0.5 text-gray-400">{rec.status === 'Present' ? 'Pres' : 'Abs'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Class teacher message block */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100">
                Class Teacher Contact Registry
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mt-3">
                Your ward <strong>{student.name}</strong> is under the principal class guidance of class teacher <strong>Mr. Rameshwar Prasad Adhikari</strong>. For counseling or home visit requests, please reach out directly at <strong>+977-9852023145</strong> or during designated parent-teacher meetings.
              </p>
            </div>

          </motion.div>
        )}

        {/* TAB 2: ACADEMICS REPORT CARD */}
        {activeSubTab === 'academics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-600" /> Terminal Progress Report Card
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Compare and view your child's terminal GPA marksheet.</p>
              </div>
              <div>
                <select
                  id="parent-term-select"
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 text-xs rounded-lg py-1.5 px-3 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="First Term">First Term Examination</option>
                  <option value="Second Term">Second Term Examination</option>
                  <option value="Final Exam">Final Board Examination</option>
                </select>
              </div>
            </div>

            {termMark ? (
              <div className="space-y-6">
                
                {/* GPA Display block */}
                <div className="bg-amber-600 text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h4 className="text-lg font-bold">{selectedTerm} Progress Report Card</h4>
                    <p className="text-xs text-amber-50 mt-1">Student: {student.name} • Class: {student.className}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="text-center font-mono">
                      <p className="text-[9px] uppercase tracking-wider text-white/80">Child GPA</p>
                      <p className="text-2xl font-black">{termMark.totalGPA.toFixed(2)}</p>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div>
                      <p className="text-xs font-bold">Status: Promoted</p>
                      <p className="text-[10px] text-white/70">Terminal Rank: Top-Tier</p>
                    </div>
                  </div>
                </div>

                {/* Score list */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left text-xs divide-y divide-gray-100">
                    <thead className="bg-gray-50 text-gray-500 font-mono">
                      <tr>
                        <th className="p-3">Subject Name</th>
                        <th className="p-3 text-center">Theory (75)</th>
                        <th className="p-3 text-center">Practical (25)</th>
                        <th className="p-3 text-center">Total (100)</th>
                        <th className="p-3 text-center">Grade Point</th>
                        <th className="p-3 text-center">Letter Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {termMark.marks.map((sm, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3 font-bold text-gray-900">{sm.subject}</td>
                          <td className="p-3 text-center font-mono text-gray-500">{sm.theory}</td>
                          <td className="p-3 text-center font-mono text-gray-500">{sm.practical}</td>
                          <td className="p-3 text-center font-mono text-gray-900 font-bold">{sm.total}</td>
                          <td className="p-3 text-center font-mono text-amber-600 font-bold">{sm.gpa.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                              {sm.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <p className="font-bold text-gray-800 uppercase tracking-wide font-mono">Class Teacher Evaluation Remarks:</p>
                  <p className="text-gray-600 italic mt-1">"{termMark.remarks}"</p>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Marks for {selectedTerm} are not loaded or published for this ward yet.
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: FEE PORTAL */}
        {activeSubTab === 'financials' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" /> Ward Tuition Ledger & Pay dues
            </h3>
            
            <p className="text-xs text-gray-500 mt-2">
              Tuition payments are collected monthly. Parents are requested to clear terminal exam fee blocks and monthly dues before quarterly card releases.
            </p>

            <div className="overflow-x-auto border border-gray-100 rounded-xl mt-4">
              <table className="w-full text-left text-xs divide-y divide-gray-100">
                <thead className="bg-gray-50 text-gray-500 font-mono">
                  <tr>
                    <th className="p-3">Billing Cycle</th>
                    <th className="p-3">Fee Specification</th>
                    <th className="p-3 text-right">Fee (NPR)</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Clear Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {fees.feeItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 text-gray-900 font-bold">{item.month}</td>
                      <td className="p-3 text-gray-600">{item.type}</td>
                      <td className="p-3 text-right font-mono text-gray-900 font-bold">Rs. {item.amount}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isPaid ? 'Cleared' : 'Due'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono">
                        {item.isPaid ? (
                          <button
                            onClick={() => {
                              alert(`Receipt Detail:\nGateway: ${item.paymentMethod}\nReceipt No: ${item.receiptNo}\nAmount: Rs. ${item.amount}\nClearance Date: ${item.paymentDate}`);
                            }}
                            className="px-2 py-0.5 text-[10px] font-semibold text-amber-600 border border-amber-200 rounded hover:bg-amber-50 cursor-pointer"
                          >
                            Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onPayFee(item.id, 'eSewa');
                              alert(`Simulating fast payment clearance with default eSewa merchant configuration for Rs. ${item.amount}.\nLedger cleared successfully!`);
                            }}
                            className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded cursor-pointer"
                          >
                            Pay Instant
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 4: ADMINISTRATOR DESK FEEDBACK */}
        {activeSubTab === 'admin_desk' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" /> Submit Suggestions or Grievances
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your notes go directly to the Principal and School Management Committee dashboard logs.
              </p>
            </div>

            {suggestionSuccess && (
              <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-green-600" /> Suggestion submitted successfully! Thank you for helping us grow.
              </div>
            )}

            <form onSubmit={handleSuggestionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Your Detailed Feedback / Suggestion</label>
                <textarea 
                  rows={4}
                  placeholder="State your ideas regarding classes, infrastructure, computer labs, sports equipment, clean drinking water, canteens, or specific teacher performance..."
                  value={suggestionContent}
                  onChange={(e) => setSuggestionContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is-anonymous-parent"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-amber-600"
                />
                <label htmlFor="is-anonymous-parent" className="font-semibold text-gray-600 select-none">
                  Submit anonymously (Hide my parental profile identity)
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Submit to School Management
              </button>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}
