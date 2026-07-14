/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Calendar, BookOpen, GraduationCap, CreditCard, 
  Clock, FileText, CheckCircle, AlertTriangle, Send, Download, 
  HelpCircle, Sparkles, AlertCircle, FileUp
} from 'lucide-react';
import { 
  Student, DayRoutine, Homework, StudentTermMark, StudentFee, 
  LibraryBook, LeaveApplication, StudentAttendance, AttendanceRecord, FeeItem
} from '../types';

interface StudentPanelProps {
  student: Student;
  attendance: StudentAttendance;
  routine: DayRoutine[];
  homeworks: Homework[];
  marks: StudentTermMark[];
  fees: StudentFee;
  libraryBooks: LibraryBook[];
  leaves: LeaveApplication[];
  onAddLeave: (leave: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => void;
  onPayFee: (feeId: string, method: string) => void;
  onSubmitHomework: (homeworkId: string, fileName: string) => void;
}

export default function StudentPanel({
  student,
  attendance,
  routine,
  homeworks,
  marks,
  fees,
  libraryBooks,
  leaves,
  onAddLeave,
  onPayFee,
  onSubmitHomework
}: StudentPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routine' | 'homework' | 'marks' | 'fees' | 'library' | 'leave'>('dashboard');

  // Leave Form State
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Homework Upload state
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [hwFileName, setHwFileName] = useState('');

  // Payment State
  const [payingFeeItem, setPayingFeeItem] = useState<FeeItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Khalti' | 'ConnectIPS'>('eSewa');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Attendance Calculations
  const totalDays = attendance?.records?.length || 0;
  const presentDays = attendance?.records?.filter(r => r.status === 'Present').length || 0;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  // Selected Term for Marksheet
  const [selectedTerm, setSelectedTerm] = useState<'First Term' | 'Second Term' | 'Final Exam'>('First Term');
  const termMark = marks.find(m => m.term === selectedTerm);

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !leaveStart || !leaveEnd) return;
    onAddLeave({
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      section: student.section,
      reason: leaveReason,
      startDate: leaveStart,
      endDate: leaveEnd
    });
    setLeaveReason('');
    setLeaveStart('');
    setLeaveEnd('');
    setLeaveSuccess(true);
    setTimeout(() => setLeaveSuccess(false), 4000);
  };

  const handleUploadHomeworkSubmit = (hwId: string) => {
    if (!hwFileName) return;
    onSubmitHomework(hwId, hwFileName);
    setHwFileName('');
    setSubmittingHwId(null);
  };

  const triggerPayFee = (item: FeeItem) => {
    setPayingFeeItem(item);
    setPaymentSuccess(false);
  };

  const handleExecutePayment = () => {
    if (!payingFeeItem) return;
    onPayFee(payingFeeItem.id, paymentMethod);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPayingFeeItem(null);
      setPaymentSuccess(false);
    }, 2000);
  };

  // Filter homework for current student
  const classHomeworks = homeworks.filter(
    hw => hw.className === student.className && hw.section === student.section
  );

  return (
    <div id="student-panel-root" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs self-start">
        <div className="text-center pb-6 border-b border-gray-100">
          <div className="relative inline-block">
            <img 
              src={student.photo} 
              alt={student.name} 
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-50 ring-2 ring-blue-600/10" 
            />
            <span className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Active Student"></span>
          </div>
          <h2 className="mt-3 text-lg font-bold text-gray-900 tracking-tight">{student.name}</h2>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mt-1 inline-block border border-blue-100">
            Roll No: {student.rollNumber} • {student.className} - {student.section}
          </span>
        </div>

        <nav id="student-nav" className="space-y-1.5 mt-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" /> Student Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('routine')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'routine'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" /> Class Timetable
          </button>

          <button
            onClick={() => setActiveTab('homework')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer relative ${
              activeTab === 'homework'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Assignments & Homework
            {classHomeworks.length > 0 && (
              <span className="absolute right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {classHomeworks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('marks')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'marks'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Academic Results (GPA)
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'fees'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Fees & Invoices
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'library'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Library Card
          </button>

          <button
            onClick={() => setActiveTab('leave')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'leave'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4" /> Leave Applications
          </button>
        </nav>

        {/* Dynamic mini metadata display */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-[11px] text-gray-500 space-y-1.5 font-mono">
          <p>Registration No: <span className="font-semibold text-gray-700">{student.id}</span></p>
          <p>Date of Admission: <span className="font-semibold text-gray-700">{student.admissionDate}</span></p>
          <p>Blood Group: <span className="font-semibold text-red-600">{student.bloodGroup}</span></p>
          <p>Guardian: <span className="font-semibold text-gray-700">{student.parentName}</span></p>
        </div>
      </div>

      {/* Main Panel Body */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Upper grid for fast stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Stat 1: Attendance Rate */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider font-mono">My Attendance</p>
                    <h3 className="text-3xl font-black text-blue-900 mt-2">{attendanceRate}%</h3>
                  </div>
                  <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </span>
                </div>
                <div className="w-full bg-blue-200/50 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${attendanceRate}%` }}></div>
                </div>
                <p className="text-[11px] text-blue-700 mt-2 font-medium">
                  Present: {presentDays} days | Total Logged: {totalDays} days
                </p>
              </div>

              {/* Stat 2: Outstanding Fee */}
              {(() => {
                const pendingFeesAmount = fees.feeItems.filter(f => !f.isPaid).reduce((sum, f) => sum + f.amount, 0);
                return (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">Dues Outstanding</p>
                        <h3 className="text-3xl font-black text-amber-900 mt-2">Rs. {pendingFeesAmount}</h3>
                      </div>
                      <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                        <CreditCard className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 text-[11px] text-amber-700 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{pendingFeesAmount > 0 ? "Clear dues to access exams/results" : "All school fees are cleared!"}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Stat 3: Active Library Books / Fines */}
              {(() => {
                const totalFines = libraryBooks.filter(b => b.borrowerId === student.id).reduce((sum, b) => sum + b.fine, 0);
                const activeBooks = libraryBooks.filter(b => b.borrowerId === student.id).length;
                return (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">Library Loans</p>
                        <h3 className="text-3xl font-black text-emerald-900 mt-2">{activeBooks} Books</h3>
                      </div>
                      <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                        <BookOpen className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-4 font-medium">
                      Overdue fines: <span className="font-bold text-red-600">Rs. {totalFines}</span>
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Profile Detail Block */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Student Profile Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs">
                <div className="space-y-3">
                  <p className="flex justify-between"><span className="text-gray-500">Full Name:</span> <span className="font-bold text-gray-800">{student.name}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Date of Birth:</span> <span className="font-semibold text-gray-800">{student.dob}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Gender:</span> <span className="font-semibold text-gray-800">{student.gender}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Blood Group:</span> <span className="font-bold text-red-600">{student.bloodGroup}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Residential Address:</span> <span className="font-semibold text-gray-800 text-right">{student.address}</span></p>
                </div>
                <div className="space-y-3 md:border-l md:pl-6 border-gray-100">
                  <p className="flex justify-between"><span className="text-gray-500">Parent / Guardian:</span> <span className="font-bold text-gray-800">{student.parentName}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Guardian Contact:</span> <span className="font-semibold text-gray-800">{student.parentContact}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Guardian Email:</span> <span className="font-semibold text-gray-800">{student.parentEmail}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">Class Section:</span> <span className="font-semibold text-gray-800">{student.className} - Room {student.section}</span></p>
                  <p className="flex justify-between"><span className="text-gray-500">School Code:</span> <span className="font-mono text-gray-800">AADBID-021</span></p>
                </div>
              </div>
            </div>

            {/* Quick view of Today's Homework */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Active Assignments
                </h3>
                <button onClick={() => setActiveTab('homework')} className="text-xs font-bold text-blue-600 hover:underline">
                  View All Homework ({classHomeworks.length})
                </button>
              </div>
              {classHomeworks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">
                  No active assignments currently. Enjoy!
                </div>
              ) : (
                <div className="space-y-3">
                  {classHomeworks.slice(0, 2).map((hw) => {
                    const submission = hw.submissions.find(s => s.studentId === student.id);
                    return (
                      <div key={hw.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-gray-800">{hw.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{hw.subject} • Due: {hw.dueDate}</p>
                        </div>
                        <div>
                          {submission ? (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              submission.status === 'Evaluated' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {submission.status}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              Not Submitted
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* TAB 2: CLASS ROUTINE */}
        {activeTab === 'routine' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Weekly Class Schedule ({student.className})
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Classes run Sunday to Thursday from 10:00 AM to 4:00 PM, and Friday half-day (until 1:00 PM / extra activities).
            </p>

            <div className="space-y-6 mt-6">
              {routine.map((dayR) => (
                <div key={dayR.day} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 border-b border-gray-100 flex justify-between">
                    <span>{dayR.day}</span>
                    <span className="text-gray-400">Regular Classes</span>
                  </div>
                  <div className="divide-y divide-gray-100 text-xs">
                    {dayR.periods.map((period, pIdx) => (
                      <div key={pIdx} className="p-3 sm:flex justify-between items-center hover:bg-slate-50/50 transition-all gap-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-gray-400 shrink-0 w-32">{period.time}</span>
                          <span className={`font-bold ${
                            period.subject === 'Tiffin Break' ? 'text-amber-600' : 'text-gray-900'
                          }`}>{period.subject}</span>
                        </div>
                        <div className="text-gray-500 text-[11px] mt-1 sm:mt-0">
                          {period.teacher}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: HOMEWORK & ASSIGNMENTS */}
        {activeTab === 'homework' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Assignments for {student.className}
              </h3>
              
              <div className="space-y-6 mt-6">
                {classHomeworks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    No homework published for your class recently. Keep studying!
                  </div>
                ) : (
                  classHomeworks.map((hw) => {
                    const submission = hw.submissions.find(s => s.studentId === student.id);
                    return (
                      <div key={hw.id} className="p-5 bg-white rounded-xl border border-gray-200 space-y-4 hover:shadow-xs transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold uppercase">
                              {hw.subject}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 mt-1">{hw.title}</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">Assigned: {hw.assignedDate} • Due: {hw.dueDate}</p>
                          </div>
                          <div>
                            {submission ? (
                              <div className="text-right">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                                  submission.status === 'Evaluated' 
                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                                }`}>
                                  {submission.status === 'Evaluated' ? '✓ Evaluated' : '⌛ Pending Review'}
                                </span>
                              </div>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                                ⚠ Not Submitted
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                          {hw.description}
                        </p>

                        {/* Optional Attachment */}
                        {hw.attachmentName && (
                          <div className="flex items-center gap-2 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs max-w-sm">
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="font-semibold text-indigo-900 truncate flex-1">{hw.attachmentName}</span>
                            <a 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); alert(`Downloading dummy attachment: ${hw.attachmentName}`); }}
                              className="text-xs text-indigo-700 hover:underline flex items-center font-bold"
                            >
                              <Download className="w-3 h-3 mr-1" /> Get PDF
                            </a>
                          </div>
                        )}

                        {/* Teacher Feedback Block if Evaluated */}
                        {submission && submission.feedback && (
                          <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl text-xs text-emerald-800">
                            <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                              <CheckCircle className="w-4 h-4 text-emerald-600" /> Teacher Evaluation & Feedback:
                            </p>
                            <p className="mt-1 italic">"{submission.feedback}"</p>
                          </div>
                        )}

                        {/* Upload Interface Section */}
                        {!submission && (
                          <div className="pt-2">
                            {submittingHwId === hw.id ? (
                              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                                <label className="block text-xs font-bold text-blue-900">
                                  Upload Your Answer Document (.pdf, .png, .jpg)
                                </label>
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="e.g. My_Math_Homework.pdf"
                                    value={hwFileName}
                                    onChange={(e) => setHwFileName(e.target.value)}
                                    className="flex-1 bg-white border border-blue-200 text-xs rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <button
                                    onClick={() => handleUploadHomeworkSubmit(hw.id)}
                                    disabled={!hwFileName}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    <Send className="w-3.5 h-3.5" /> Submit
                                  </button>
                                  <button
                                    onClick={() => { setSubmittingHwId(null); setHwFileName(''); }}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs hover:bg-gray-300 transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <p className="text-[10px] text-blue-700 font-mono">
                                  *Simulates instant file uploading to the teacher.
                                </p>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSubmittingHwId(hw.id)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                              >
                                <FileUp className="w-4 h-4" /> Upload My Assignment
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: ACADEMIC RESULTS */}
        {activeTab === 'marks' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-red-600" /> Terminal Grade Sheet
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Officially published reports from teacher records.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Term:</span>
                <select
                  id="results-term-select"
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 text-xs rounded-lg py-1.5 px-3 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="First Term">First Term Examination</option>
                  <option value="Second Term">Second Term Examination</option>
                  <option value="Final Exam">Final Board Examination</option>
                </select>
              </div>
            </div>

            {termMark ? (
              <div className="space-y-6">
                
                {/* GPA Display Block */}
                <div className="bg-gradient-to-r from-red-600 to-indigo-600 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                      Academic Assessment
                    </span>
                    <h4 className="text-2xl font-black mt-1">{selectedTerm} Report Card</h4>
                    <p className="text-xs text-white/80 mt-1">Shree Aadarsha Secondary School Board Council</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-xl border border-white/10 self-start md:self-auto">
                    <div className="text-center font-mono">
                      <p className="text-[9px] uppercase tracking-wider text-white/70">Terminal GPA</p>
                      <p className="text-3xl font-black">{termMark.totalGPA.toFixed(2)}</p>
                    </div>
                    <div className="h-10 w-px bg-white/20"></div>
                    <div>
                      <p className="text-xs font-bold">Status: Passed</p>
                      <p className="text-[10px] text-white/70">Rank: Outstanding</p>
                    </div>
                  </div>
                </div>

                {/* Subject wise detailed table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left text-xs divide-y divide-gray-100">
                    <thead className="bg-gray-50 text-gray-500 font-mono">
                      <tr>
                        <th className="p-3">Subject Name</th>
                        <th className="p-3 text-center">Theory (75)</th>
                        <th className="p-3 text-center">Practical (25)</th>
                        <th className="p-3 text-center">Total Score (100)</th>
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
                          <td className="p-3 text-center font-mono text-blue-600 font-bold">{sm.gpa.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              sm.grade.startsWith('A') 
                                ? 'bg-green-100 text-green-800' 
                                : sm.grade.startsWith('B') 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {sm.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Principal/Teacher Remarks */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                  <p className="font-bold text-gray-800 uppercase tracking-wide font-mono">Class Teacher Remarks:</p>
                  <p className="text-gray-600 italic">"{termMark.remarks}"</p>
                </div>

                {/* Grading scale reference */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-[10px] text-blue-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><strong>90% - 100%</strong>: A+ (Outstanding • 4.0)</div>
                  <div><strong>80% - 89%</strong>: A (Excellent • 3.6)</div>
                  <div><strong>70% - 79%</strong>: B+ (Very Good • 3.2)</div>
                  <div><strong>60% - 69%</strong>: B (Good • 2.8)</div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Marksheet and Grade Sheet for <strong>{selectedTerm}</strong> are not published or created yet. Please select "First Term" to inspect seed results.
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 5: FEES & PAYMENT */}
        {activeTab === 'fees' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" /> Account Dues & Receipts
              </h3>

              {/* Invoices List */}
              <div className="overflow-x-auto border border-gray-100 rounded-xl mt-6">
                <table className="w-full text-left text-xs divide-y divide-gray-100">
                  <thead className="bg-gray-50 text-gray-500 font-mono">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3">Fee Type</th>
                      <th className="p-3 text-right">Amount (NPR)</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Action</th>
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
                            item.isPaid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}>
                            {item.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {item.isPaid ? (
                            <button
                              onClick={() => {
                                alert(`-------------------------------------------------\nSHREE AADARSHA RASTRIYE BIDHYALAYE\nOfficial Fee Payment Receipt\n-------------------------------------------------\nReceipt No: ${item.receiptNo}\nStudent ID: ${student.id}\nStudent Name: ${student.name}\nMonth: ${item.month}\nFee Paid: ${item.type}\nPaid Amount: Rs. ${item.amount}\nPayment Date: ${item.paymentDate}\nGateway: ${item.paymentMethod}\n-------------------------------------------------\nThank you for prompt fee clearance.`);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" /> Receipt
                            </button>
                          ) : (
                            <button
                              onClick={() => triggerPayFee(item)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated Payment Modal */}
            {payingFeeItem && (
              <div className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-md space-y-4">
                <div className="flex justify-between items-start pb-2 border-b border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Online Fee Clearance Dashboard</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Secure payment processing with Nepalese merchant gateways.</p>
                  </div>
                  <button onClick={() => setPayingFeeItem(null)} className="text-xs font-mono text-gray-400 hover:text-gray-900 cursor-pointer">✕ Close</button>
                </div>

                {paymentSuccess ? (
                  <div className="py-8 text-center text-xs space-y-2">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 animate-bounce" />
                    </div>
                    <p className="font-bold text-gray-900">Payment Completed Successfully!</p>
                    <p className="text-gray-500">Updating invoice ledger database and generating digital receipt...</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between font-mono">
                      <div>
                        <p className="text-gray-500 uppercase text-[9px]">Billable Item</p>
                        <p className="font-bold text-gray-800">{payingFeeItem.type} ({payingFeeItem.month})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 uppercase text-[9px]">Amount Due</p>
                        <p className="font-black text-amber-600">Rs. {payingFeeItem.amount}</p>
                      </div>
                    </div>

                    <p className="font-bold text-gray-800">Select Nepal Payment Merchant Gateway:</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setPaymentMethod('eSewa')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === 'eSewa' 
                            ? 'bg-green-50 border-green-500 text-green-950 font-bold scale-[1.02]' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-black font-mono text-[9px]">eS</div>
                        <span>eSewa Pay</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('Khalti')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === 'Khalti' 
                            ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold scale-[1.02]' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-black font-mono text-[9px]">Kh</div>
                        <span>Khalti Pay</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('ConnectIPS')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === 'ConnectIPS' 
                            ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold scale-[1.02]' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black font-mono text-[9px]">cI</div>
                        <span>ConnectIPS</span>
                      </button>
                    </div>

                    <button
                      onClick={handleExecutePayment}
                      className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" /> Authorized Checkout: Rs. {payingFeeItem.amount}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 6: LIBRARY CARD */}
        {activeTab === 'library' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> My Library Ledger
            </h3>

            <div className="space-y-4">
              <p className="text-xs text-gray-500">
                Lending limits: Maximum 2 books at once. Late returns attract a daily fine of Rs. 5 per day.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {libraryBooks.map((book) => {
                  const isBorrowedByMe = book.borrowerId === student.id;
                  return (
                    <div key={book.id} className={`p-4 rounded-xl border text-xs flex flex-col justify-between gap-3 ${
                      isBorrowedByMe ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-gray-100'
                    }`}>
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-[9px] text-gray-400 uppercase">{book.category}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            book.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isBorrowedByMe ? 'Issued to Me' : book.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mt-1">{book.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Author: {book.author}</p>
                      </div>

                      {isBorrowedByMe && (
                        <div className="border-t border-indigo-100/50 pt-2 font-mono text-[10px] space-y-1 text-indigo-950">
                          <p>Issued On: {book.issueDate}</p>
                          <p>Due Return: {book.returnDate}</p>
                          <p className="text-red-600 font-bold">Accumulated Fine: Rs. {book.fine}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: LEAVE APPLICATIONS */}
        {activeTab === 'leave' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Apply for Sick / Casual Leave
              </h3>

              {leaveSuccess && (
                <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Leave application registered successfully. Waiting for class teacher review.</span>
                </div>
              )}

              <form onSubmit={handleApplyLeaveSubmit} className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Leave Start Date</label>
                    <input 
                      type="date" 
                      value={leaveStart}
                      onChange={(e) => setLeaveStart(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Leave End Date</label>
                    <input 
                      type="date" 
                      value={leaveEnd}
                      onChange={(e) => setLeaveEnd(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Honest Reason / Justification</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe why you need the leave (e.g. medical reason, urgent family affair)..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Register Leave Application
                </button>
              </form>
            </div>

            {/* History logs */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100 flex items-center gap-2">
                Leave Request Logs
              </h3>
              
              <div className="divide-y divide-gray-100 text-xs">
                {leaves.filter(l => l.studentId === student.id).length === 0 ? (
                  <p className="text-center py-6 text-gray-400">No previous leave applications logged.</p>
                ) : (
                  leaves.filter(l => l.studentId === student.id).map((leave) => (
                    <div key={leave.id} className="py-4 flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{leave.startDate} to {leave.endDate}</span>
                          <span className="text-[10px] text-gray-400 font-mono">(Applied: {leave.appliedDate})</span>
                        </div>
                        <p className="text-gray-600 italic">Reason: "{leave.reason}"</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        leave.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : leave.status === 'Rejected' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
