/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolInfo {
  name: string;
  nepaliName: string;
  logo: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  regNumber: string;
  schoolCode: string;
  panNumber: string;
  principalName: string;
  principalPhoto: string;
  principalMessage: string;
}

export type NoticeCategory = 'General' | 'Holiday' | 'Examination' | 'Urgent' | 'Sports' | 'Event' | 'Scholarship';

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  date: string;
  publishedBy: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  className: string; // e.g. "Class 10"
  section: string; // e.g. "A"
  dob: string;
  gender: string;
  bloodGroup: string;
  address: string;
  parentName: string;
  parentContact: string;
  parentEmail: string;
  photo: string;
  admissionDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  subject: string;
  contact: string;
  photo: string;
  experience?: string;
  citizenshipNo?: string;
  panNo?: string;
}

export interface Period {
  time: string;
  subject: string;
  teacher: string;
}

export interface DayRoutine {
  day: string; // e.g., "Monday"
  periods: Period[];
}

export interface ClassRoutine {
  className: string;
  section: string;
  schedule: DayRoutine[];
}

export interface Submission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileName: string;
  status: 'Pending' | 'Evaluated';
  feedback?: string;
}

export interface Homework {
  id: string;
  className: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  attachmentName?: string;
  submissions: Submission[];
}

export interface SubjectMark {
  subject: string;
  theory: number; // Max 75
  practical: number; // Max 25
  total: number;
  grade: string;
  gpa: number;
}

export interface StudentTermMark {
  studentId: string;
  term: 'First Term' | 'Second Term' | 'Final Exam';
  className: string;
  section: string;
  marks: SubjectMark[];
  totalGPA: number;
  remarks: string;
  isPublished: boolean;
}

export interface FeeItem {
  id: string;
  month: string;
  type: string; // e.g. "Tuition Fee", "Exam Fee", "Library Fee"
  amount: number;
  isPaid: boolean;
  paymentDate?: string;
  paymentMethod?: string;
  receiptNo?: string;
}

export interface StudentFee {
  studentId: string;
  feeItems: FeeItem[];
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'Available' | 'Issued';
  issueDate?: string;
  returnDate?: string;
  fine: number;
  borrowerId?: string;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface ComplaintSuggestion {
  id: string;
  senderName: string;
  role: 'Student' | 'Teacher' | 'Parent' | 'Anonymous';
  type: 'Complaint' | 'Suggestion';
  content: string;
  date: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent';
}

export interface StudentAttendance {
  studentId: string;
  records: AttendanceRecord[];
}
