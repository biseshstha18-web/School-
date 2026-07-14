/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, CheckSquare, PlusCircle, BookOpen, GraduationCap, 
  Calendar, Award, Save, RefreshCw, Send, AlertCircle, Trash2, Edit 
} from 'lucide-react';
import { 
  Teacher, Student, Homework, StudentTermMark, StudentAttendance, 
  SubjectMark, Notice, NoticeCategory
} from '../types';
import { CLASS_OPTIONS } from './AdminPanel';

interface TeacherPanelProps {
  teacher: Teacher;
  students: Student[];
  homeworks: Homework[];
  marks: StudentTermMark[];
  attendanceData: StudentAttendance[];
  onAddHomework: (homework: Omit<Homework, 'id' | 'submissions'>) => void;
  onUpdateMarks: (studentId: string, term: string, subjectMark: SubjectMark) => void;
  onSaveAttendance: (date: string, records: { studentId: string; status: 'Present' | 'Absent' }[]) => void;
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
}

export default function TeacherPanel({
  teacher,
  students,
  homeworks,
  marks,
  attendanceData,
  onAddHomework,
  onUpdateMarks,
  onSaveAttendance,
  onAddNotice
}: TeacherPanelProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'homework' | 'marks' | 'routine' | 'notices'>('attendance');

  // Attendance Sub-State
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [attendanceDate, setAttendanceDate] = useState<string>('2083-04-14');
  const classStudents = students.filter(s => s.className === selectedClass);
  
  // Track temporary checklist of student present state
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Homework Form State
  const [hwClass, setHwClass] = useState('Class 10');
  const [hwSubject, setHwSubject] = useState(teacher.subject);
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('2083-04-18');
  const [hwAttachment, setHwAttachment] = useState('');
  const [hwSuccess, setHwSuccess] = useState(false);

  // Marks Entry Form State
  const [markStudentId, setMarkStudentId] = useState('');
  const [markTerm, setMarkTerm] = useState<'First Term' | 'Second Term' | 'Final Exam'>('First Term');
  const [markSubject, setMarkSubject] = useState(teacher.subject);
  const [theoryScore, setTheoryScore] = useState<number>(0);
  const [practicalScore, setPracticalScore] = useState<number>(0);
  const [markSuccess, setMarkSuccess] = useState(false);

  // Teacher notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCat, setNoticeCat] = useState<NoticeCategory>('General');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Initialize draft when selecting class or date
  const handleLoadAttendanceSheet = () => {
    const draft: Record<string, 'Present' | 'Absent'> = {};
    classStudents.forEach(std => {
      // Find existing record for this student on this date
      const record = attendanceData
        .find(a => a.studentId === std.id)
        ?.records.find(r => r.date === attendanceDate);
      
      draft[std.id] = record ? record.status : 'Present'; // default to present
    });
    setAttendanceDraft(draft);
    setAttendanceSaved(false);
  };

  React.useEffect(() => {
    handleLoadAttendanceSheet();
  }, [selectedClass, attendanceDate, students]);

  const toggleAttendance = (studentId: string) => {
    setAttendanceDraft(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleSaveAttendanceDraftSubmit = () => {
    const records = Object.entries(attendanceDraft).map(([studentId, status]) => ({
      studentId,
      status: status as 'Present' | 'Absent'
    }));
    onSaveAttendance(attendanceDate, records);
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Grading Logic Helper
  const calculateLetterGradeAndGPA = (total: number) => {
    if (total >= 90) return { grade: 'A+', gpa: 4.0 };
    if (total >= 80) return { grade: 'A', gpa: 3.6 };
    if (total >= 70) return { grade: 'B+', gpa: 3.2 };
    if (total >= 60) return { grade: 'B', gpa: 2.8 };
    if (total >= 50) return { grade: 'C+', gpa: 2.4 };
    if (total >= 40) return { grade: 'C', gpa: 2.0 };
    return { grade: 'D', gpa: 1.6 };
  };

  const handlePublishHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle || !hwDesc) return;
    onAddHomework({
      className: hwClass,
      section: "A",
      subject: hwSubject,
      title: hwTitle,
      description: hwDesc,
      assignedDate: '2083-04-14',
      dueDate: hwDueDate,
      attachmentName: hwAttachment || undefined
    });
    setHwTitle('');
    setHwDesc('');
    setHwAttachment('');
    setHwSuccess(true);
    setTimeout(() => setHwSuccess(false), 3000);
  };

  const handleSaveStudentMarksSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markStudentId) return;
    
    const theory = Math.min(Math.max(theoryScore, 0), 75);
    const practical = Math.min(Math.max(practicalScore, 0), 25);
    const total = theory + practical;
    const { grade, gpa } = calculateLetterGradeAndGPA(total);

    onUpdateMarks(markStudentId, markTerm, {
      subject: markSubject,
      theory,
      practical,
      total,
      grade,
      gpa
    });

    setMarkSuccess(true);
    setTimeout(() => setMarkSuccess(false), 3000);
  };

  const handlePublishNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    onAddNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCat,
      date: '2083-04-14',
      publishedBy: `Teacher: ${teacher.name}`
    });
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeSuccess(true);
    setTimeout(() => setNoticeSuccess(false), 3000);
  };

  return (
    <div id="teacher-panel-root" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Profile Card */}
      <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs self-start">
        <div className="text-center pb-6 border-b border-gray-100">
          <img 
            src={teacher.photo} 
            alt={teacher.name} 
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-50 ring-2 ring-emerald-600/10" 
          />
          <h2 className="mt-3 text-lg font-bold text-gray-900 tracking-tight">{teacher.name}</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">{teacher.designation}</p>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold mt-2 inline-block border border-emerald-100">
            Expertise: {teacher.subject}
          </span>
        </div>

        <nav id="teacher-nav" className="space-y-1.5 mt-6">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Mark Class Attendance
          </button>
          
          <button
            onClick={() => setActiveTab('homework')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'homework'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Issue Homework
          </button>

          <button
            onClick={() => setActiveTab('marks')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'marks'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Enter Exam Marks
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Send className="w-4 h-4" /> Publish Class Notice
          </button>
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-100 text-[11px] text-gray-500 space-y-1.5 font-mono">
          <p>Teacher ID: <span className="font-semibold text-gray-700">{teacher.id}</span></p>
          <p>Qualification: <span className="font-semibold text-gray-700">{teacher.qualification}</span></p>
          <p>Contact: <span className="font-semibold text-gray-700">{teacher.contact}</span></p>
          <p>Experience: <span className="font-semibold text-emerald-700">{teacher.experience}</span></p>
        </div>
      </div>

      {/* Main Panel Content area */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* TAB 1: ATTENDANCE MANAGEMENT */}
        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-600" /> Daily Student Attendance Ledger
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Maintain daily logs. Changes immediately reflect in parent and student dashboards.</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Class</label>
                  <select
                    id="teacher-class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 font-bold focus:outline-none"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Log Date</label>
                  <input
                    id="attendance-date-input"
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 font-mono text-gray-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {attendanceSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <PlusCircle className="w-4 h-4 text-emerald-600" /> Attendance saved successfully! Profiles updated.
              </div>
            )}

            {/* Students Attendance List Table */}
            <div className="overflow-hidden border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs divide-y divide-gray-100">
                <thead className="bg-gray-50 text-gray-500 font-mono">
                  <tr>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Student Full Name</th>
                    <th className="p-3">Parent Info</th>
                    <th className="p-3 text-center">Log Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400">
                        No students registered in this class. Add them in Admin panel.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-gray-500">{std.rollNumber}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={std.photo} className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                            <div>
                              <p className="font-bold text-gray-900">{std.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">ID: {std.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          <p>{std.parentName}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{std.parentContact}</p>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-[11px]">
                            <button
                              onClick={() => {
                                setAttendanceDraft(prev => ({ ...prev, [std.id]: 'Present' }));
                              }}
                              className={`px-3 py-1 font-bold transition-all cursor-pointer ${
                                attendanceDraft[std.id] === 'Present'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => {
                                setAttendanceDraft(prev => ({ ...prev, [std.id]: 'Absent' }));
                              }}
                              className={`px-3 py-1 font-bold transition-all cursor-pointer ${
                                attendanceDraft[std.id] === 'Absent'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-white text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-xs text-gray-500 italic">
                *Defaults to "Present". Toggle "Absent" for any student not in morning registration roll.
              </p>
              <button
                onClick={handleSaveAttendanceDraftSubmit}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" /> Save Attendance Ledger
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CREATE HOMEWORK */}
        {activeTab === 'homework' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" /> Construct & Assign Homework
              </h3>

              {hwSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 mb-4 font-semibold">
                  <CheckSquare className="w-4 h-4 text-emerald-600" /> Homework assigned and published. Students notified!
                </div>
              )}

              <form onSubmit={handlePublishHomeworkSubmit} className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Target Class</label>
                    <select
                      id="hw-target-class"
                      value={hwClass}
                      onChange={(e) => setHwClass(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                    >
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      value={hwSubject}
                      onChange={(e) => setHwSubject(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Submission Due Date</label>
                    <input 
                      type="date" 
                      value={hwDueDate}
                      onChange={(e) => setHwDueDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assignment Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Archimedes Principle - Numerical Problems"
                    value={hwTitle}
                    onChange={(e) => setHwTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Detailed Instructions / Questions</label>
                  <textarea 
                    rows={4}
                    placeholder="List questions, reference books, specific chapters, and formatting requirements..."
                    value={hwDesc}
                    onChange={(e) => setHwDesc(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Upload Supplementary Sheet (Name only - Simulation)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Trigonometry_Ref_Sheet.pdf"
                    value={hwAttachment}
                    onChange={(e) => setHwAttachment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" /> Publish Classroom Assignment
                </button>
              </form>
            </div>

            {/* List of active homework issued by teachers */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100">
                My Recently Issued Assignments
              </h3>
              <div className="space-y-4 mt-4">
                {homeworks.filter(h => h.subject === teacher.subject).map((hw) => (
                  <div key={hw.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-bold rounded-md uppercase">{hw.className}</span>
                        <h4 className="font-bold text-gray-900 mt-1">{hw.title}</h4>
                      </div>
                      <span className="font-mono text-[10px] text-gray-400">Due: {hw.dueDate}</span>
                    </div>
                    <p className="text-gray-500 line-clamp-2">{hw.description}</p>
                    <div className="text-[10px] text-emerald-700 font-semibold pt-1 border-t border-gray-100/50">
                      Submissions received: {hw.submissions.length} student uploads
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: ENTER EXAM MARKS */}
        {activeTab === 'marks' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" /> Enter/Edit Terminal Exam Marks
              </h3>

              {markSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 mb-4 font-semibold">
                  <Award className="w-4 h-4 text-emerald-600" /> Student Grade Ledger updated. Recomputed overall GPA instantly!
                </div>
              )}

              <form onSubmit={handleSaveStudentMarksSubmit} className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Select Student</label>
                    <select
                      id="marks-target-student"
                      value={markStudentId}
                      onChange={(e) => setMarkStudentId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                      required
                    >
                      <option value="">-- Choose Student --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.className})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Target Examination Term</label>
                    <select
                      id="marks-target-term"
                      value={markTerm}
                      onChange={(e) => setMarkTerm(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                    >
                      <option value="First Term">First Term Examination</option>
                      <option value="Second Term">Second Term Examination</option>
                      <option value="Final Exam">Final Board Examination</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Evaluator Subject</label>
                    <input
                      type="text"
                      value={markSubject}
                      onChange={(e) => setMarkSubject(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800 bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Assessment Code</label>
                    <input
                      type="text"
                      value="REG-SHREE-AAR"
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-500"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Theory Marks (Max 75)</label>
                    <input 
                      type="number" 
                      max={75}
                      min={0}
                      value={theoryScore}
                      onChange={(e) => setTheoryScore(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800 text-sm font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Practical / Internal Assessment (Max 25)</label>
                    <input 
                      type="number" 
                      max={25}
                      min={0}
                      value={practicalScore}
                      onChange={(e) => setPracticalScore(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800 text-sm font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-900 border border-blue-100 rounded-xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Real-time Combined Evaluation:</span>
                  </div>
                  <div className="font-mono font-bold">
                    Total: <span className="text-blue-700 text-sm">{theoryScore + practicalScore} / 100</span> | Estimated Letter Grade:{' '}
                    <span className="text-red-600 text-sm">
                      {calculateLetterGradeAndGPA(theoryScore + practicalScore).grade}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" /> Save & Compute Student Grade Sheet
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 4: PUBLISH CLASS NOTICE */}
        {activeTab === 'notices' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" /> Publish Urgent Announcements
              </h3>

              {noticeSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 mb-4 font-semibold">
                  <CheckSquare className="w-4 h-4 text-emerald-600" /> Notice broadcasted on the landing page bulletin board!
                </div>
              )}

              <form onSubmit={handlePublishNoticeSubmit} className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Announcement Category</label>
                    <select
                      id="teacher-notice-cat"
                      value={noticeCat}
                      onChange={(e) => setNoticeCat(e.target.value as NoticeCategory)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                    >
                      <option value="General">General Announcement</option>
                      <option value="Holiday">Holiday circular</option>
                      <option value="Examination">Examination Schedule</option>
                      <option value="Urgent">Urgent / Special Circular</option>
                      <option value="Event">SMC & Cultural Events</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Broadcaster Authority</label>
                    <input 
                      type="text" 
                      value={`Secondary Department Teacher`}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-500"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bulletin Headline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Science Lab Dress Code Notice"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Notice Body Content</label>
                  <textarea 
                    rows={4}
                    placeholder="Write detailed announcements for students and parents..."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" /> Broadcast Bulletin Now
                </button>
              </form>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
