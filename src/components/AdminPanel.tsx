/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, Users, UserPlus, Trash2, ShieldCheck, 
  FileText, Award, Download, Save, CreditCard, Sparkles, AlertCircle 
} from 'lucide-react';
import { SchoolInfo, Student, Teacher } from '../types';
import { generateStudentQRCodeURL } from '../utils/qrcode';

export const CLASS_OPTIONS = [
  "Playgroup",
  "Nursery",
  "L.K.G.",
  "U.K.G.",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10"
];

interface AdminPanelProps {
  schoolInfo: SchoolInfo;
  students: Student[];
  teachers: Teacher[];
  onUpdateSchoolSettings: (updatedInfo: SchoolInfo) => void;
  onAddStudent: (student: Omit<Student, 'id' | 'admissionDate'>) => void;
  onDeleteStudent: (id: string) => void;
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onDeleteTeacher: (id: string) => void;
  onUpdateStudent: (student: Student) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  adminUsername?: string;
  adminPassword?: string;
  onUpdateAdminCredentials?: (user: string, pass: string) => void;
  adminNotifications?: Array<{ id: string; message: string; timestamp: string }>;
  onClearNotifications?: () => void;
  onPlayRegistrationSound?: () => void;
  notices?: any[];
  onAddNotice?: (notice: any) => void;
  onDeleteNotice?: (id: string) => void;
}

export default function AdminPanel({
  schoolInfo,
  students,
  teachers,
  onUpdateSchoolSettings,
  onAddStudent,
  onDeleteStudent,
  onAddTeacher,
  onDeleteTeacher,
  onUpdateStudent,
  onUpdateTeacher,
  adminUsername = 'admin',
  adminPassword = 'admin123',
  onUpdateAdminCredentials,
  adminNotifications = [],
  onClearNotifications = () => {},
  onPlayRegistrationSound = () => {},
  notices = [],
  onAddNotice = () => {},
  onDeleteNotice = () => {}
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'students' | 'teachers' | 'certificates' | 'notices' | 'security'>('settings');

  // School settings states
  const [schName, setSchName] = useState(schoolInfo.name);
  const [schNepali, setSchNepali] = useState(schoolInfo.nepaliName);
  const [schMotto, setSchMotto] = useState(schoolInfo.motto);
  const [schAddress, setSchAddress] = useState(schoolInfo.address);
  const [schPhone, setSchPhone] = useState(schoolInfo.phone);
  const [schEmail, setSchEmail] = useState(schoolInfo.email);
  const [schWeb, setSchWeb] = useState(schoolInfo.website);
  const [schReg, setSchReg] = useState(schoolInfo.regNumber);
  const [schCode, setSchCode] = useState(schoolInfo.schoolCode);
  const [schPan, setSchPan] = useState(schoolInfo.panNumber);
  const [schSuccess, setSchSuccess] = useState(false);

  const [schLogo, setSchLogo] = useState(schoolInfo.logo || '');
  const [schPrincipalName, setSchPrincipalName] = useState(schoolInfo.principalName || '');
  const [schPrincipalPhoto, setSchPrincipalPhoto] = useState(schoolInfo.principalPhoto || '');
  const [schPrincipalMessage, setSchPrincipalMessage] = useState(schoolInfo.principalMessage || '');

  // Add Student Form States
  const [stdName, setStdName] = useState('');
  const [stdRoll, setStdRoll] = useState('');
  const [stdClass, setStdClass] = useState('Class 10');
  const [stdSec, setStdSec] = useState('A');
  const [stdDob, setStdDob] = useState('2069-05-15');
  const [stdGender, setStdGender] = useState('Male');
  const [stdBlood, setStdBlood] = useState('O+');
  const [stdAddr, setStdAddr] = useState('');
  const [stdParent, setStdParent] = useState('');
  const [stdContact, setStdContact] = useState('');
  const [stdParentEmail, setStdParentEmail] = useState('');
  const [stdSuccess, setStdSuccess] = useState(false);

  // --- STUDENT EDIT STATES ---
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editStdName, setEditStdName] = useState('');
  const [editStdRoll, setEditStdRoll] = useState('');
  const [editStdClass, setEditStdClass] = useState('Class 10');
  const [editStdSec, setEditStdSec] = useState('A');
  const [editStdDob, setEditStdDob] = useState('');
  const [editStdGender, setEditStdGender] = useState('Male');
  const [editStdBlood, setEditStdBlood] = useState('O+');
  const [editStdAddr, setEditStdAddr] = useState('');
  const [editStdParent, setEditStdParent] = useState('');
  const [editStdContact, setEditStdContact] = useState('');
  const [editStdParentEmail, setEditStdParentEmail] = useState('');
  const [editStdPhoto, setEditStdPhoto] = useState('');

  // Add Teacher Form States
  const [teaName, setTeaName] = useState('');
  const [teaDesignation, setTeaDesignation] = useState('');
  const [teaQual, setTeaQual] = useState('');
  const [teaSubject, setTeaSubject] = useState('');
  const [teaContact, setTeaContact] = useState('');
  const [teaExp, setTeaExp] = useState('');
  const [teaSuccess, setTeaSuccess] = useState(false);

  // --- TEACHER EDIT STATES ---
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editTeaName, setEditTeaName] = useState('');
  const [editTeaDesignation, setEditTeaDesignation] = useState('');
  const [editTeaQual, setEditTeaQual] = useState('');
  const [editTeaSubject, setEditTeaSubject] = useState('');
  const [editTeaContact, setEditTeaContact] = useState('');
  const [editTeaExp, setEditTeaExp] = useState('');
  const [editTeaPhoto, setEditTeaPhoto] = useState('');
  const [editTeaCitizenship, setEditTeaCitizenship] = useState('');
  const [editTeaPan, setEditTeaPan] = useState('');

  // Certificate Generator States
  const [certStudentId, setCertStudentId] = useState('');
  const [certType, setCertType] = useState<'Character' | 'Transfer' | 'Bonafide'>('Character');
  const [certConduct, setCertConduct] = useState('Excellent');
  const [certExtra, setCertExtra] = useState('actively participated in quiz, and sports week competitions.');
  const [showCertOutput, setShowCertOutput] = useState(false);

  // ID Card generation targets
  const [idCardStudentId, setIdCardStudentId] = useState('');

  // Manage Notice State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDate, setNewNoticeDate] = useState('2083-04-14');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'General' | 'Event' | 'Holiday' | 'Exam' | 'Emergency'>('General');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeAuthor, setNewNoticeAuthor] = useState('SMC Chairman / Principal');
  const [noticeSuccessMsg, setNoticeSuccessMsg] = useState(false);

  // Manage Admin Credentials state
  const [tempUsername, setTempUsername] = useState(adminUsername);
  const [tempPassword, setTempPassword] = useState(adminPassword);
  const [credSuccessMsg, setCredSuccessMsg] = useState(false);

  // Reusable file uploader base64 converter
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setPhotoUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditingStudent = (student: Student) => {
    setEditingStudent(student);
    setEditStdName(student.name);
    setEditStdRoll(student.rollNumber);
    setEditStdClass(student.className);
    setEditStdSec(student.section);
    setEditStdDob(student.dob);
    setEditStdGender(student.gender);
    setEditStdBlood(student.bloodGroup);
    setEditStdAddr(student.address);
    setEditStdParent(student.parentName);
    setEditStdContact(student.parentContact);
    setEditStdParentEmail(student.parentEmail);
    setEditStdPhoto(student.photo);
  };

  const handleSaveEditedStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    onUpdateStudent({
      ...editingStudent,
      name: editStdName,
      rollNumber: editStdRoll,
      className: editStdClass,
      section: editStdSec,
      dob: editStdDob,
      gender: editStdGender,
      bloodGroup: editStdBlood,
      address: editStdAddr,
      parentName: editStdParent,
      parentContact: editStdContact,
      parentEmail: editStdParentEmail,
      photo: editStdPhoto
    });
    setEditingStudent(null);
  };

  const startEditingTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditTeaName(teacher.name);
    setEditTeaDesignation(teacher.designation);
    setEditTeaQual(teacher.qualification);
    setEditTeaSubject(teacher.subject);
    setEditTeaContact(teacher.contact);
    setEditTeaExp(teacher.experience || '3 Years');
    setEditTeaPhoto(teacher.photo);
    setEditTeaCitizenship(teacher.citizenshipNo || '');
    setEditTeaPan(teacher.panNo || '');
  };

  const handleSaveEditedTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    onUpdateTeacher({
      ...editingTeacher,
      name: editTeaName,
      designation: editTeaDesignation,
      qualification: editTeaQual,
      subject: editTeaSubject,
      contact: editTeaContact,
      experience: editTeaExp,
      photo: editTeaPhoto,
      citizenshipNo: editTeaCitizenship,
      panNo: editTeaPan
    });
    setEditingTeacher(null);
  };

  const handleUpdateSchoolSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolSettings({
      ...schoolInfo,
      name: schName,
      nepaliName: schNepali,
      motto: schMotto,
      address: schAddress,
      phone: schPhone,
      email: schEmail,
      website: schWeb,
      regNumber: schReg,
      schoolCode: schCode,
      panNumber: schPan,
      logo: schLogo,
      principalName: schPrincipalName,
      principalPhoto: schPrincipalPhoto,
      principalMessage: schPrincipalMessage
    });
    setSchSuccess(true);
    setTimeout(() => setSchSuccess(false), 3000);
  };

  const handleRegisterNewStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName || !stdRoll || !stdParent || !stdContact) return;
    
    // Assign typical user placeholder portraits for student
    const defaultPhoto = stdGender === 'Male'
      ? 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

    onAddStudent({
      name: stdName,
      rollNumber: stdRoll,
      className: stdClass,
      section: stdSec,
      dob: stdDob,
      gender: stdGender,
      bloodGroup: stdBlood,
      address: stdAddr || "Biratnagar, Nepal",
      parentName: stdParent,
      parentContact: stdContact,
      parentEmail: stdParentEmail || "guardian@outlook.com",
      photo: defaultPhoto
    });

    setStdName('');
    setStdRoll('');
    setStdAddr('');
    setStdParent('');
    setStdContact('');
    setStdParentEmail('');
    setStdSuccess(true);
    setTimeout(() => setStdSuccess(false), 3000);
  };

  const handleRegisterNewTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teaName || !teaDesignation || !teaSubject) return;

    // Use default portrait
    const defaultPhoto = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';

    onAddTeacher({
      name: teaName,
      designation: teaDesignation,
      qualification: teaQual || "Bachelor in Education",
      subject: teaSubject,
      contact: teaContact || "+977-9800000000",
      photo: defaultPhoto,
      experience: teaExp || "3 Years"
    });

    setTeaName('');
    setTeaDesignation('');
    setTeaQual('');
    setTeaSubject('');
    setTeaContact('');
    setTeaExp('');
    setTeaSuccess(true);
    setTimeout(() => setTeaSuccess(false), 3000);
  };

  const selectedCertStudent = students.find(s => s.id === certStudentId);

  return (
    <div id="admin-panel-root" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs self-start">
        <div className="pb-6 border-b border-gray-100 text-center lg:text-left">
          <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center mx-auto lg:mx-0">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-gray-900 tracking-tight">Admin Console</h2>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full text-[10px] font-bold mt-1.5 inline-block uppercase">
            Super Administrator
          </span>
        </div>

        <nav id="admin-nav" className="space-y-1.5 mt-6">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" /> School Configurations
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'students'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" /> Manage Students
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" /> Manage Teachers
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Award className="w-4 h-4" /> Certificate Desk
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" /> Announcements & Notices
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Security & Passwords
          </button>
        </nav>

        {/* Dynamic mini logs or triggers */}
        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ schoolInfo, students, teachers }, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "shree_aadarsha_backup.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="w-full mt-8 py-2.5 bg-slate-50 border border-slate-200 text-[11px] font-mono font-bold rounded-xl text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Back Up School Data
        </button>
      </div>

      {/* Main panel content */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Dynamic student registration alerts bar */}
        {adminNotifications.length > 0 && (
          <div id="registration-alerts-panel" className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">🔔</span>
              <div>
                <p className="font-extrabold text-amber-900 text-xs uppercase tracking-wide">
                  Live Registration Alerts ({adminNotifications.length})
                </p>
                <p className="text-amber-800 text-xs font-semibold mt-0.5">
                  {adminNotifications[0].message} <span className="font-mono text-[10px] text-amber-600 font-normal">({adminNotifications[0].timestamp})</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onPlayRegistrationSound()}
                className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors font-bold text-[10px] cursor-pointer shadow-3xs"
              >
                🔊 Play Test Sound
              </button>
              <button
                type="button"
                onClick={() => onClearNotifications()}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-bold text-[10px] cursor-pointer shadow-3xs"
              >
                Clear Alerts
              </button>
            </div>
          </div>
        )}
        
        {/* TAB 1: SCHOOL SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" /> Core School settings & Metadatas
              </h3>
              <p className="text-xs text-gray-500 mt-1">Changes made here instantly propagate and customize branding headers, emails, and certificate fields.</p>
            </div>

            {schSuccess && (
              <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-green-600" /> School information ledger updated on server-side preview successfully!
              </div>
            )}

            <form onSubmit={handleUpdateSchoolSettingsSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Official Name (English)</label>
                  <input 
                    type="text" 
                    value={schName}
                    onChange={(e) => setSchName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Official Name (Nepali translation)</label>
                  <input 
                    type="text" 
                    value={schNepali}
                    onChange={(e) => setSchNepali(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-red-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">School Motto / Slogan</label>
                  <input 
                    type="text" 
                    value={schMotto}
                    onChange={(e) => setSchMotto(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-semibold text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">School Government PAN Code</label>
                  <input 
                    type="text" 
                    value={schPan}
                    onChange={(e) => setSchPan(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Street Address Details</label>
                  <input 
                    type="text" 
                    value={schAddress}
                    onChange={(e) => setSchAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Telephone numbers</label>
                  <input 
                    type="text" 
                    value={schPhone}
                    onChange={(e) => setSchPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Official Email Desk</label>
                  <input 
                    type="email" 
                    value={schEmail}
                    onChange={(e) => setSchEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Website URL</label>
                  <input 
                    type="text" 
                    value={schWeb}
                    onChange={(e) => setSchWeb(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Board Registration No</label>
                  <input 
                    type="text" 
                    value={schReg}
                    onChange={(e) => setSchReg(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Government School Code</label>
                  <input 
                    type="text" 
                    value={schCode}
                    onChange={(e) => setSchCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-mono"
                    placeholder="e.g. Govt-1032"
                    required
                  />
                </div>
              </div>

              {/* Logo & Principal Profile Settings */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span>📸</span> Principal Desk & Branding Assets
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">School Logo Artwork</label>
                      <input 
                        type="text" 
                        value={schLogo}
                        onChange={(e) => setSchLogo(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-2 text-gray-800 font-mono text-[11px]"
                        placeholder="Paste image URL here"
                      />
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100">
                      <div className="flex-1">
                        <p className="font-bold text-[10px] text-gray-500 mb-1">Or upload local image:</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, setSchLogo)}
                          className="w-full text-[9px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                        />
                      </div>
                      {schLogo ? (
                        <img src={schLogo} className="w-12 h-12 rounded-lg object-contain border border-gray-200 shrink-0 bg-slate-50" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400 shrink-0">No Logo</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Principal Photograph</label>
                      <input 
                        type="text" 
                        value={schPrincipalPhoto}
                        onChange={(e) => setSchPrincipalPhoto(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-2 text-gray-800 font-mono text-[11px]"
                        placeholder="Paste principal image URL"
                      />
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100">
                      <div className="flex-1">
                        <p className="font-bold text-[10px] text-gray-500 mb-1">Or upload local photo:</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, setSchPrincipalPhoto)}
                          className="w-full text-[9px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                        />
                      </div>
                      {schPrincipalPhoto ? (
                        <img src={schPrincipalPhoto} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400 shrink-0">No Photo</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Principal Full Name</label>
                    <input 
                      type="text" 
                      value={schPrincipalName}
                      onChange={(e) => setSchPrincipalName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
                      placeholder="e.g. Rameshwar Prasad"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Principal Message / Bio Greetings</label>
                    <textarea 
                      value={schPrincipalMessage}
                      onChange={(e) => setSchPrincipalMessage(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-medium"
                      placeholder="Enter the official principal message displayed on homepage..."
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" /> Save Configuration Settings
              </button>
            </form>
          </motion.div>
        )}

        {/* TAB 2: MANAGE STUDENTS */}
        {activeTab === 'students' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Form or Edit Form */}
            {editingStudent ? (
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-300 shadow-sm">
                <h3 className="text-lg font-black text-amber-950 pb-3 border-b border-amber-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" /> Edit Student Profile: {editingStudent.name} (ID: {editingStudent.id})
                </h3>

                <form onSubmit={handleSaveEditedStudent} className="space-y-4 mt-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-amber-900 mb-1">Student Full Name</label>
                      <input 
                        type="text" 
                        value={editStdName}
                        onChange={(e) => setEditStdName(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold text-gray-900 focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Roll Number</label>
                      <input 
                        type="number" 
                        value={editStdRoll}
                        onChange={(e) => setEditStdRoll(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-mono text-gray-800 font-bold focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Enrolling Class</label>
                      <select
                        id="edit-std-class"
                        value={editStdClass}
                        onChange={(e) => setEditStdClass(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-amber-500"
                      >
                        {CLASS_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Date of Birth (B.S.)</label>
                      <input 
                        type="text" 
                        value={editStdDob}
                        onChange={(e) => setEditStdDob(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-mono text-gray-850 focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Gender</label>
                      <select
                        id="edit-std-gender"
                        value={editStdGender}
                        onChange={(e) => setEditStdGender(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Blood Group</label>
                      <select
                        id="edit-std-blood"
                        value={editStdBlood}
                        onChange={(e) => setEditStdBlood(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="O+">O+</option>
                        <option value="B+">B+</option>
                        <option value="A+">A+</option>
                        <option value="AB+">AB+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Residential Street</label>
                      <input 
                        type="text" 
                        value={editStdAddr}
                        onChange={(e) => setEditStdAddr(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-gray-800 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Parent/Guardian Name</label>
                      <input 
                        type="text" 
                        value={editStdParent}
                        onChange={(e) => setEditStdParent(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-gray-800 font-semibold focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Parent Contact Number</label>
                      <input 
                        type="text" 
                        value={editStdContact}
                        onChange={(e) => setEditStdContact(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-mono text-gray-850 focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Parent Email Desk</label>
                      <input 
                        type="email" 
                        value={editStdParentEmail}
                        onChange={(e) => setEditStdParentEmail(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-gray-850 font-mono focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                    <div>
                      <label className="block font-bold text-amber-950 mb-1">Student Portrait Photograph URL</label>
                      <input 
                        type="text" 
                        value={editStdPhoto}
                        onChange={(e) => setEditStdPhoto(e.target.value)}
                        className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2 font-mono text-[11px] text-gray-800"
                        placeholder="Paste photo image web URL"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-[10px] text-amber-900 mb-1">Or select a local portrait photo:</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, setEditStdPhoto)}
                          className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                        />
                      </div>
                      {editStdPhoto && (
                        <img src={editStdPhoto} className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shadow-xs shrink-0" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" /> Save Student details
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-slate-800" /> Admit & Enroll New Student
                </h3>

                {stdSuccess && (
                  <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> New Student registered and allocated roll number in database ledger!
                  </div>
                )}

                <form onSubmit={handleRegisterNewStudentSubmit} className="space-y-4 mt-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Student Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rohan Dev Poudel"
                        value={stdName}
                        onChange={(e) => setStdName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Roll Number</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 4"
                        value={stdRoll}
                        onChange={(e) => setStdRoll(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Enrolling Class</label>
                      <select
                        id="std-enroll-class"
                        value={stdClass}
                        onChange={(e) => setStdClass(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                      >
                        {CLASS_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Date of Birth (B.S.)</label>
                      <input 
                        type="text" 
                        placeholder="YYYY-MM-DD"
                        value={stdDob}
                        onChange={(e) => setStdDob(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Gender</label>
                      <select
                        id="std-gender-select"
                        value={stdGender}
                        onChange={(e) => setStdGender(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                      <select
                        id="std-blood-select"
                        value={stdBlood}
                        onChange={(e) => setStdBlood(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                      >
                        <option value="O+">O+</option>
                        <option value="B+">B+</option>
                        <option value="A+">A+</option>
                        <option value="AB+">AB+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Residential Street</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Ward-4, Biratnagar"
                        value={stdAddr}
                        onChange={(e) => setStdAddr(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Parent/Guardian Name</label>
                      <input 
                        type="text" 
                        placeholder="Father / Mother Name"
                        value={stdParent}
                        onChange={(e) => setStdParent(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Parent Contact Number</label>
                      <input 
                        type="text" 
                        placeholder="+977-98..."
                        value={stdContact}
                        onChange={(e) => setStdContact(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Parent Email Desk</label>
                      <input 
                        type="email" 
                        placeholder="parent@gmail.com"
                        value={stdParentEmail}
                        onChange={(e) => setStdParentEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" /> Finalize Student Enrollment
                  </button>
                </form>
              </div>
            )}

            {/* List and Actions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100 flex justify-between items-center">
                <span>Active Student Registry</span>
                <span className="text-xs text-gray-400 font-normal">Total: {students.length} Pupils</span>
              </h3>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs divide-y divide-gray-100">
                  <thead className="bg-gray-50 text-gray-500 font-mono">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Class / Roll</th>
                      <th className="p-3">Guardian details</th>
                      <th className="p-3 text-center">ID Card</th>
                      <th className="p-3 text-right">Revoke Enrollment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={student.photo} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                            <div>
                              <p className="font-bold text-gray-900">{student.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">ID: {student.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-gray-800">{student.className}</p>
                          <p className="text-[10px] text-gray-400">Roll No: {student.rollNumber}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-gray-700">{student.parentName}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{student.parentContact}</p>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setIdCardStudentId(student.id);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                            >
                              View Card
                            </button>
                            <button
                              onClick={() => {
                                startEditingStudent(student);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-indigo-700 border border-indigo-150 bg-indigo-50/50 rounded-lg hover:bg-indigo-50 cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Are you absolutely sure you want to revoke the registration and delete student: ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Generated ID Card Preview Panel */}
            {idCardStudentId && (() => {
              const std = students.find(s => s.id === idCardStudentId);
              if (!std) return null;
              return (
                <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">Generated Identity Card & Gate-pass QR Mockup</h4>
                    <button onClick={() => setIdCardStudentId('')} className="text-xs text-white/50 hover:text-white font-mono cursor-pointer">✕ Close</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Majestic physical vertical ID card */}
                    <div className="max-w-xs w-full mx-auto bg-white text-gray-900 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl p-4 flex flex-col justify-between text-center min-h-[380px] text-xs">
                      
                      {/* ID Header */}
                      <div className="border-b-2 border-red-600 pb-2">
                        <p className="text-[8px] font-bold text-red-600 leading-none">{schoolInfo.nepaliName}</p>
                        <h5 className="font-extrabold text-gray-900 uppercase tracking-tight text-[10px] mt-0.5">{schoolInfo.name}</h5>
                        <p className="text-[7px] text-gray-500 font-mono leading-none">{schoolInfo.address}</p>
                      </div>

                      {/* ID photo */}
                      <div className="my-4">
                        <img src={std.photo} className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-slate-100 ring-2 ring-red-600/10" referrerPolicy="no-referrer" />
                      </div>

                      {/* ID details */}
                      <div className="space-y-1.5">
                        <h6 className="font-black text-gray-900 text-sm leading-tight uppercase">{std.name}</h6>
                        <p className="font-bold text-red-600 text-[10px] uppercase">Student</p>
                        
                        <div className="grid grid-cols-2 gap-1 border-t border-b border-gray-100 py-1.5 text-[9px] text-left font-semibold">
                          <div><span className="text-gray-400">CLASS:</span> {std.className}</div>
                          <div><span className="text-gray-400">ROLL NO:</span> {std.rollNumber}</div>
                          <div><span className="text-gray-400">ID CODE:</span> {std.id}</div>
                          <div><span className="text-gray-400">BLOOD:</span> {std.bloodGroup}</div>
                        </div>
                      </div>

                      {/* Signatures and security footer */}
                      <div className="mt-4 flex justify-between items-end border-t border-gray-100/55 pt-3">
                        <div className="text-left text-[7px] text-gray-400 font-mono">
                          <p>Issued: 2083-01-10</p>
                          <p>Valid until: 2084-03-30</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-bold border-t border-gray-400 pt-0.5 text-gray-700 font-serif italic">Rameshwar Prasad</p>
                          <p className="text-[6px] text-gray-400 uppercase font-mono tracking-wider">Principal</p>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Gatepass Card (Back / Digital Pass) */}
                    <div className="max-w-xs w-full mx-auto bg-white text-gray-900 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl p-4 flex flex-col justify-between text-center min-h-[380px] text-xs">
                      {/* Back Header */}
                      <div className="border-b-2 border-indigo-600 pb-2">
                        <p className="text-[8px] font-bold text-indigo-600 leading-none">SHREE SARASWATI SECONDARY SCHOOL</p>
                        <h5 className="font-extrabold text-gray-900 uppercase tracking-tight text-[10px] mt-0.5">SECURE GATEWAY PASS</h5>
                        <p className="text-[7px] text-gray-500 font-mono leading-none">Gate Scan & Library Authorization Ledger</p>
                      </div>

                      {/* QR Display */}
                      <div className="my-3 flex flex-col items-center justify-center space-y-1">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl shadow-xs">
                          <img 
                            src={generateStudentQRCodeURL(std.id, std.name, std.className, std.rollNumber, std.bloodGroup, std.parentContact)} 
                            className="w-32 h-32 object-contain"
                            alt="Student Verification QR Code"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-[8px] font-mono font-bold text-slate-500">SECURE ID HASH: {std.id.toUpperCase()}</p>
                      </div>

                      {/* Dynamic instruction set */}
                      <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-left space-y-1 text-[8px] text-slate-700 font-semibold">
                        <p className="font-extrabold text-indigo-800 uppercase text-[9px] tracking-wider mb-0.5 flex items-center gap-1">
                          <span>🛡️</span> Security Instructions:
                        </p>
                        <p>1. Present this QR code at the smart gate entrance terminal upon arrival and departure.</p>
                        <p>2. Hold 3 inches from the scanner lens; wait for the green signal beep.</p>
                        <p>3. This token authorizes secure textbook issuance at the library repository.</p>
                      </div>

                      <p className="text-[8px] text-indigo-600 font-extrabold tracking-wide uppercase mt-2">
                        System Registered & Encrypted
                      </p>
                    </div>
                  </div>

                  <div className="text-center pt-2 flex items-center justify-center gap-3 flex-wrap">
                    <button 
                      onClick={() => alert("ID card layout initialized. Connect real printing hardware to print badge PVC sheets.")}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Print Identification Card
                    </button>
                    <a
                      href={generateStudentQRCodeURL(std.id, std.name, std.className, std.rollNumber, std.bloodGroup, std.parentContact)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border border-slate-700"
                    >
                      <span>💾</span> Download Digital QR Gatepass
                    </a>
                  </div>
                </div>
              );
            })()}

          </motion.div>
        )}

        {/* TAB 3: MANAGE TEACHERS */}
        {activeTab === 'teachers' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Form or Edit Form */}
            {editingTeacher ? (
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-300 shadow-sm">
                <h3 className="text-lg font-black text-amber-950 pb-3 border-b border-amber-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" /> Edit Faculty Member Details: {editingTeacher.name} (ID: {editingTeacher.id})
                </h3>

                <form onSubmit={handleSaveEditedTeacher} className="space-y-4 mt-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Teacher Full Name</label>
                      <input 
                        type="text" 
                        value={editTeaName}
                        onChange={(e) => setEditTeaName(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold text-gray-900 focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Designation Role</label>
                      <input 
                        type="text" 
                        value={editTeaDesignation}
                        onChange={(e) => setEditTeaDesignation(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-semibold text-gray-800 focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Primary Subject Expertise</label>
                      <input 
                        type="text" 
                        value={editTeaSubject}
                        onChange={(e) => setEditTeaSubject(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold text-gray-800 focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Teacher Qualifications</label>
                      <input 
                        type="text" 
                        value={editTeaQual}
                        onChange={(e) => setEditTeaQual(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-gray-800 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        value={editTeaContact}
                        onChange={(e) => setEditTeaContact(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-mono text-gray-850 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Years of Prior Experience</label>
                      <input 
                        type="text" 
                        value={editTeaExp}
                        onChange={(e) => setEditTeaExp(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-gray-800 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Nepali Citizenship Number</label>
                      <input 
                        type="text" 
                        value={editTeaCitizenship}
                        onChange={(e) => setEditTeaCitizenship(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-mono text-gray-800 focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. 14-01-72-04531"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-amber-900 mb-1">Govt PAN Registration No</label>
                      <input 
                        type="text" 
                        value={editTeaPan}
                        onChange={(e) => setEditTeaPan(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-mono text-gray-850 focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. 600324159"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                    <div>
                      <label className="block font-bold text-amber-950 mb-1">Faculty Member Portrait Photograph URL</label>
                      <input 
                        type="text" 
                        value={editTeaPhoto}
                        onChange={(e) => setEditTeaPhoto(e.target.value)}
                        className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2 font-mono text-[11px] text-gray-800"
                        placeholder="Paste photo image web URL"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-[10px] text-amber-900 mb-1">Or select a local portrait photo:</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, setEditTeaPhoto)}
                          className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                        />
                      </div>
                      {editTeaPhoto && (
                        <img src={editTeaPhoto} className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shadow-xs shrink-0" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" /> Save Instructor details
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTeacher(null)}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-slate-800" /> Recruit & Register New Instructor
                </h3>

                {teaSuccess && (
                  <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> Instructor recruited and subject assigned successfully!
                  </div>
                )}

                <form onSubmit={handleRegisterNewTeacherSubmit} className="space-y-4 mt-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Teacher Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Milan Devkota"
                        value={teaName}
                        onChange={(e) => setTeaName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Designation Role</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Secondary Math Instructor"
                        value={teaDesignation}
                        onChange={(e) => setTeaDesignation(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-semibold text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Primary Subject Expertise</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Science, Health, English"
                        value={teaSubject}
                        onChange={(e) => setTeaSubject(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Teacher Qualifications</label>
                      <input 
                        type="text" 
                        placeholder="e.g. M.Sc. in Physics, B.Ed."
                        value={teaQual}
                        onChange={(e) => setTeaQual(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        placeholder="+977-98..."
                        value={teaContact}
                        onChange={(e) => setTeaContact(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Years of Prior Experience</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5 Years"
                        value={teaExp}
                        onChange={(e) => setTeaExp(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" /> Finalize Faculty Recruitment
                  </button>
                </form>
              </div>
            )}

            {/* List */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100 flex justify-between items-center">
                <span>Active Faculty Directory</span>
                <span className="text-xs text-gray-400 font-normal">Total: {teachers.length} Instructors</span>
              </h3>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs divide-y divide-gray-100">
                  <thead className="bg-gray-50 text-gray-500 font-mono">
                    <tr>
                      <th className="p-3">Faculty Member</th>
                      <th className="p-3">Designation / Subject</th>
                      <th className="p-3">Credentials</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={teacher.photo} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                            <div>
                              <p className="font-bold text-gray-900">{teacher.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">ID: {teacher.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-gray-800">{teacher.designation}</p>
                          <p className="text-[10px] text-slate-600 font-semibold">{teacher.subject}</p>
                        </td>
                        <td className="p-3 text-gray-600">
                          <p>{teacher.qualification}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{teacher.contact}</p>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                startEditingTeacher(teacher);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-indigo-700 border border-indigo-150 bg-indigo-50/50 rounded-lg hover:bg-indigo-50 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete teacher: ${teacher.name}?`)) {
                                  onDeleteTeacher(teacher.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex"
                              title="Delete Teacher"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 4: CERTIFICATES GENERATION */}
        {activeTab === 'certificates' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Input Selection form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" /> Official Academic Certificate Generator
              </h3>

              <div className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Select Candidate Student</label>
                    <select
                      id="cert-target-student"
                      value={certStudentId}
                      onChange={(e) => {
                        setCertStudentId(e.target.value);
                        setShowCertOutput(false);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Choose student --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.className})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Certificate Type</label>
                    <select
                      id="cert-type-select"
                      value={certType}
                      onChange={(e) => {
                        setCertType(e.target.value as any);
                        setShowCertOutput(false);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Character">Character Certificate</option>
                      <option value="Transfer">Transfer Certificate (T.C.)</option>
                      <option value="Bonafide">Bonafide Study Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Conduct Standard</label>
                    <select
                      id="cert-conduct-select"
                      value={certConduct}
                      onChange={(e) => {
                        setCertConduct(e.target.value);
                        setShowCertOutput(false);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good / Obedient</option>
                      <option value="Satisfactory">Satisfactory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Special Extracurricular / Character Traits</label>
                  <input 
                    type="text" 
                    value={certExtra}
                    onChange={(e) => {
                      setCertExtra(e.target.value);
                      setShowCertOutput(false);
                    }}
                    placeholder="e.g. actively participated in debate competitions and showed keen leadership as prefect."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-semibold"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!certStudentId) {
                      alert("Please select a student first!");
                      return;
                    }
                    setShowCertOutput(true);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" /> Compile & Render Certificate Draft
                </button>
              </div>
            </div>

            {/* Actual printable Certificate Render draft */}
            {showCertOutput && selectedCertStudent && (
              <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">Live Official Certificate Draft (Print Friendly)</h4>
                  <button 
                    onClick={() => {
                      alert("Connecting to local print spooler...\nSaving vector certificate document to paper layouts.");
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3 h-3 animate-pulse" /> Print Certificate
                  </button>
                </div>

                {/* Printable Certificate Sheet layout with majestic educational borders */}
                <div className="bg-white text-gray-900 p-8 sm:p-12 border-[16px] border-double border-indigo-900 rounded-xl max-w-3xl mx-auto shadow-2xl relative min-h-[500px] flex flex-col justify-between text-center font-serif">
                  
                  {/* Decorative corner scrolls */}
                  <div className="absolute top-2 left-2 text-indigo-950 text-lg font-bold">✤</div>
                  <div className="absolute top-2 right-2 text-indigo-950 text-lg font-bold">✤</div>
                  <div className="absolute bottom-2 left-2 text-indigo-950 text-lg font-bold">✤</div>
                  <div className="absolute bottom-2 right-2 text-indigo-950 text-lg font-bold">✤</div>

                  {/* Header */}
                  <div className="space-y-1.5 border-b-2 border-indigo-900/40 pb-4">
                    <p className="text-xs font-bold text-red-600 tracking-wider font-sans uppercase">{schoolInfo.nepaliName}</p>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-indigo-950 tracking-tight leading-tight">{schoolInfo.name}</h2>
                    <p className="text-[10px] font-bold text-gray-600 font-sans uppercase tracking-widest">{schoolInfo.address}</p>
                    <p className="text-[9px] text-gray-500 font-mono leading-none">PAN: {schoolInfo.panNumber} | School Code: {schoolInfo.schoolCode} | Reg No: {schoolInfo.regNumber}</p>
                  </div>

                  {/* Certificate Title */}
                  <div className="my-6">
                    <span className="border-2 border-indigo-950/85 px-6 py-2 rounded-md uppercase font-black text-sm tracking-widest bg-indigo-50/50 inline-block font-sans">
                      {certType === 'Character' ? 'Character Certificate' : certType === 'Transfer' ? 'Transfer Certificate' : 'Bonafide Study Certificate'}
                    </span>
                  </div>

                  {/* Certificate Body Paragraph */}
                  {certType === 'Character' && (
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-700 text-justify">
                      This is to certify that Master/Miss <strong className="text-gray-950 text-sm border-b border-dashed border-gray-900 px-1">{selectedCertStudent.name}</strong>, son/daughter of Mr./Mrs. <strong className="text-gray-950 px-1">{selectedCertStudent.parentName}</strong>, is a bonafide student of this school. According to our administrative register, he/she was admitted on <strong className="text-gray-950">{selectedCertStudent.dob}</strong> and passed/attended <strong className="text-gray-950">{selectedCertStudent.className}</strong>.
                      <br /><br />
                      During his/her study period in this school, his/her character and moral conduct have been found <strong className="text-indigo-900 uppercase font-black px-1">{certConduct}</strong>. To the best of our knowledge, he/she {certExtra || "demonstrated sincerity and dedication."}
                      <br /><br />
                      We wish him/her every success and a bright future in his/her higher studies and future career.
                    </p>
                  )}

                  {certType === 'Transfer' && (
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-700 text-justify">
                      This is to certify that Master/Miss <strong className="text-gray-950 text-sm border-b border-dashed border-gray-900 px-1">{selectedCertStudent.name}</strong>, registered with roll number <strong className="text-gray-950">{selectedCertStudent.rollNumber}</strong> of <strong className="text-gray-950">{selectedCertStudent.className}</strong>, has officially applied for a Transfer Certificate.
                      <br /><br />
                      All school dues up to the month of Shrawan 2083 have been fully settled. His/her character was logged as <strong className="text-indigo-900 uppercase font-black px-1">{certConduct}</strong>, and his/her reason for transfer is stated as "Higher Secondary school admission". 
                      <br /><br />
                      We certify that his/her behavior was cooperative and we wish him/her success in higher academic pursuits.
                    </p>
                  )}

                  {certType === 'Bonafide' && (
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-700 text-justify">
                      This is to verify that Master/Miss <strong className="text-gray-950 text-sm border-b border-dashed border-gray-900 px-1">{selectedCertStudent.name}</strong>, resident of <strong className="text-gray-950">{selectedCertStudent.address}</strong>, is an actively enrolled regular student of <strong className="text-gray-950">{selectedCertStudent.className} - A</strong> in Shree Aadarsha Rastriye Madhyamik Bidhyalaye.
                      <br /><br />
                      This certificate is issued at his/her parent request for academic identification or scholarship verification purposes.
                    </p>
                  )}

                  {/* Signatures & Seal stamp block */}
                  <div className="mt-12 flex justify-between items-end border-t border-gray-100 pt-6">
                    <div className="text-left text-[10px] text-gray-400 font-mono">
                      <p>Issue Date: 2083-04-14</p>
                      <p>Place: Biratnagar, Nepal</p>
                    </div>
                    
                    {/* Visual Round School Seal Mockup */}
                    <div className="w-20 h-20 rounded-full border-4 border-dashed border-red-600/30 text-red-600/50 flex flex-col items-center justify-center text-[7px] font-sans font-extrabold uppercase shrink-0 select-none tracking-tighter leading-none mx-2 select-none">
                      <span>SHREE AADARSHA</span>
                      <span className="font-mono my-0.5">★ 2034 ★</span>
                      <span>SCHOOL SEAL</span>
                    </div>

                    <div className="text-center font-sans">
                      <p className="text-xs font-serif font-bold italic text-gray-800 tracking-tight">Rameshwar Prasad</p>
                      <p className="text-[9px] uppercase tracking-wider font-bold border-t border-gray-900 pt-1 text-gray-700">Principal / SMC Chairman</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        )}

        {/* TAB 5: ANNOUNCEMENTS & NOTICES */}
        {activeTab === 'notices' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> Publish School Notice or Urgent Announcement
                </h3>
                <p className="text-xs text-gray-500 mt-1">This will display immediately on the public notice board with real-time updates.</p>
              </div>

              {noticeSuccessMsg && (
                <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 font-semibold animate-fade-in">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Notice published successfully on the public notice board!
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newNoticeTitle || !newNoticeContent) return;
                  onAddNotice({
                    title: newNoticeTitle,
                    date: newNoticeDate,
                    category: newNoticeCategory,
                    content: newNoticeContent,
                    author: newNoticeAuthor
                  });
                  setNewNoticeTitle('');
                  setNewNoticeContent('');
                  setNoticeSuccessMsg(true);
                  setTimeout(() => setNoticeSuccessMsg(false), 3000);
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Notice Title / Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. First Terminal Examination Schedule 2083"
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Publish Date (B.S.)</label>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={newNoticeDate}
                      onChange={(e) => setNewNoticeDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Alert Category</label>
                    <select
                      id="notice-category-select"
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800"
                    >
                      <option value="General">General Announcement</option>
                      <option value="Event">Event / Sports / Extra-Curricular</option>
                      <option value="Holiday">School Holiday Warning</option>
                      <option value="Exam">Exam Schedule / Academic Routine</option>
                      <option value="Emergency">🚨 EMERGENCY ALERTS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Issuing Authority Signature</label>
                    <input
                      type="text"
                      value={newNoticeAuthor}
                      onChange={(e) => setNewNoticeAuthor(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Detailed Notice Content</label>
                  <textarea
                    rows={4}
                    placeholder="Write detailed announcements, instruction lists, or schedules here..."
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800 leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" /> Save and Publish Notice
                </button>
              </form>
            </div>

            {/* List and Actions for Notices */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono pb-3 border-b border-gray-100 flex justify-between items-center">
                <span>Existing Public Announcements Board</span>
                <span className="text-xs text-gray-400 font-normal">Total: {notices.length} active posts</span>
              </h3>

              <div className="space-y-4 mt-4">
                {notices.length === 0 ? (
                  <p className="text-center py-8 text-gray-400 font-medium">No notices currently published on board.</p>
                ) : (
                  notices.map((notice) => (
                    <div key={notice.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-start gap-4 transition-all hover:border-gray-350">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase font-mono ${
                            notice.category === 'Emergency' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            notice.category === 'Holiday' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            notice.category === 'Exam' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                            notice.category === 'Event' ? 'bg-teal-100 text-teal-700 border border-teal-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {notice.category}
                          </span>
                          <span className="font-mono text-[10px] text-gray-400 font-semibold">{notice.date}</span>
                        </div>
                        <h4 className="font-extrabold text-xs text-gray-950 uppercase tracking-wide">{notice.title}</h4>
                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium whitespace-pre-line">{notice.content}</p>
                        <p className="text-[10px] text-gray-400 italic">Authored by: {notice.author}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete and remove notice: "${notice.title}"?`)) {
                            onDeleteNotice(notice.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0 cursor-pointer border border-transparent hover:border-red-100"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: SECURITY & PASSWORDS */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Admin Credentials Configuration
              </h3>
              <p className="text-xs text-gray-500 mt-1">Configure your administrative credentials profile. After changing, future logins will authenticate against these values.</p>
            </div>

            {credSuccessMsg && (
              <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs flex items-center gap-2 font-semibold animate-fade-in">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Administrative security login credentials saved and active!
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!tempUsername || !tempPassword) return;
                if (onUpdateAdminCredentials) {
                  onUpdateAdminCredentials(tempUsername, tempPassword);
                }
                setCredSuccessMsg(true);
                setTimeout(() => setCredSuccessMsg(false), 3000);
              }}
              className="space-y-4 text-xs max-w-md"
            >
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Administrative Login ID Username</label>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter new admin username"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Security PIN Passphrase Password</label>
                  <input
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter new admin password"
                    required
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-[10px] text-amber-950 leading-relaxed">
                <span className="font-bold">⚠️ Security Notice:</span>
                <p className="mt-0.5">Please write down or memorize your custom administrative credentials! The system will expect these exact strings during your next logout/login sequence.</p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4 text-amber-400" /> Save & Activate Admin Account Credentials
              </button>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}
