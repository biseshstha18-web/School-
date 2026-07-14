/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SchoolInfo,
  Notice,
  Student,
  Teacher,
  ClassRoutine,
  Homework,
  StudentTermMark,
  StudentFee,
  LibraryBook,
  LeaveApplication,
  ComplaintSuggestion,
  StudentAttendance
} from './types';

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  name: "Shree Aadarsha Rastriye Madhyamik Bidhyalaye",
  nepaliName: "श्री आदर्श राष्ट्रिय माध्यमिक विद्यालय",
  logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80",
  motto: "Education is the light of life • तमसो मा ज्योतिर्गमय",
  address: "Biratnagar-11, Morang, Koshi Province, Nepal",
  phone: "+977-21-524312, +977-9852023145",
  email: "info@shreeaadarsha.edu.np",
  website: "www.shreeaadarsha.edu.np",
  regNumber: "ED-MOR-2034-09",
  schoolCode: "AADBID-021",
  panNumber: "301452684",
  principalName: "Mr. Rameshwar Prasad Adhikari",
  principalPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
  principalMessage: "Dear Students, Parents, and Well-wishers,\n\nWelcome to Shree Aadarsha Rastriye Madhyamik Bidhyalaye. For over four decades, our school has been a cornerstone of quality public education in Morang district. We strive to provide a nurturing environment where academic excellence is paired with moral integrity. Our goal is to empower children from all sections of society with 21st-century skills while remaining rooted in Nepali culture and civic values. This digital portal represents our commitment to transparency, technology-driven management, and seamless collaboration between parents, teachers, and school administration. Together, let us cultivate a community of lifelong learners."
};

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: "notice-1",
    title: "First Term Examination Results Distribution",
    content: "This is to notify all parents and students that the results of the First Term Examination 2083 will be distributed on Friday, Ashadh 31st during parent-teacher meetings. All parents are requested to visit the respective classrooms of their children between 10:00 AM and 2:00 PM. Outstanding school dues up to the month of Ashadh must be cleared before receiving the report card.",
    category: "Examination",
    date: "2083-04-10",
    publishedBy: "Administration"
  },
  {
    id: "notice-2",
    title: "Monsoon Vacation Notice",
    content: "As per the decision of the Biratnagar Metropolitan City Office, Education Division, the school will remain closed for Monsoon Vacation from Shrawan 5 to Shrawan 12, 2083 due to extreme heat and rain warnings. Regular classes will resume on Monday, Shrawan 13, 2083. Students are advised to complete their holiday assignments uploaded in the homework panel.",
    category: "Holiday",
    date: "2083-04-12",
    publishedBy: "Principal"
  },
  {
    id: "notice-3",
    title: "Inauguration of New Computer Laboratory",
    content: "We are pleased to announce the inauguration of our newly upgraded Computer Science Lab, equipped with 30 high-speed computers, high-speed fiber internet, and interactive learning displays. The lab was established with joint funding from Koshi Province Education Development Directorate and the School Management Committee. Practical sessions for Classes 6-10 will start under the new schedule.",
    category: "General",
    date: "2083-04-05",
    publishedBy: "SMC President"
  },
  {
    id: "notice-4",
    title: "Inter-House Sports Week 2083 Registration",
    content: "Registration is now open for the Inter-House Sports Competition scheduled for the first week of Bhadra. Major events include Football, Volleyball, Kabbadi, Table Tennis, and Athletics. Interested students can sign up with their respective House Captains (Red, Blue, Green, Yellow) or the Sports Teacher, Mr. Devraj Pokharel, by Shrawan 20th.",
    category: "Sports",
    date: "2083-04-11",
    publishedBy: "Sports Department"
  },
  {
    id: "notice-5",
    title: "President's Running Shield Selection Trials",
    content: "Urgent selection trials for athletic events (100m, 200m sprint, high jump, shot put) to represent our school in the upcoming Biratnagar Metropolitan Running Shield tournament will take place tomorrow at 7:00 AM on the school playground. Dress code: Sports tracksuits and proper athletic shoes.",
    category: "Urgent",
    date: "2083-04-13",
    publishedBy: "Coach Devraj"
  }
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: "std-1001",
    rollNumber: "1",
    name: "Aayush Bhandari",
    className: "Class 10",
    section: "A",
    dob: "2068-05-15",
    gender: "Male",
    bloodGroup: "B+",
    address: "Biratnagar-4, Morang, Nepal",
    parentName: "Krishna Prasad Bhandari",
    parentContact: "+977-9842045612",
    parentEmail: "krishna.bhandari@gmail.com",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    admissionDate: "2078-01-10"
  },
  {
    id: "std-1002",
    rollNumber: "2",
    name: "Sujata Shrestha",
    className: "Class 10",
    section: "A",
    dob: "2068-09-22",
    gender: "Female",
    bloodGroup: "O+",
    address: "Biratnagar-11, Morang, Nepal",
    parentName: "Pradeep Kumar Shrestha",
    parentContact: "+977-9852031122",
    parentEmail: "pradeep.shrestha@outlook.com",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    admissionDate: "2078-01-12"
  },
  {
    id: "std-1003",
    rollNumber: "3",
    name: "Bibek Chaudhary",
    className: "Class 10",
    section: "A",
    dob: "2068-03-05",
    gender: "Male",
    bloodGroup: "A-",
    address: "Biratnagar-15, Morang, Nepal",
    parentName: "Ram Lal Chaudhary",
    parentContact: "+977-9812345678",
    parentEmail: "ramlal.chaudhary@yahoo.com",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    admissionDate: "2079-01-15"
  },
  {
    id: "std-1004",
    rollNumber: "1",
    name: "Manisha Karki",
    className: "Class 9",
    section: "A",
    dob: "2069-04-18",
    gender: "Female",
    bloodGroup: "AB+",
    address: "Biratnagar-3, Morang, Nepal",
    parentName: "Subash Karki",
    parentContact: "+977-9842065544",
    parentEmail: "subash.karki@gmail.com",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    admissionDate: "2079-01-10"
  },
  {
    id: "std-1005",
    rollNumber: "2",
    name: "Niranjan Yadav",
    className: "Class 9",
    section: "A",
    dob: "2069-11-30",
    gender: "Male",
    bloodGroup: "O-",
    address: "Biratnagar-12, Morang, Nepal",
    parentName: "Devendra Yadav",
    parentContact: "+977-9803154879",
    parentEmail: "devendra.yadav@gmail.com",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    admissionDate: "2080-01-20"
  }
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: "t-201",
    name: "Rameshwar Prasad Adhikari",
    designation: "Principal & Senior Math Teacher",
    qualification: "M.Sc. in Mathematics, M.Ed. in Administration",
    subject: "Compulsory Mathematics",
    contact: "+977-9852023145",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    experience: "18 Years in Education Management",
    citizenshipNo: "12345-Morang",
    panNo: "302145698"
  },
  {
    id: "t-202",
    name: "Sita Thapa",
    designation: "Secondary Science Teacher",
    qualification: "M.Sc. in Physics, B.Ed.",
    subject: "Science & Technology",
    contact: "+977-9842156984",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    experience: "8 Years in Teaching",
    citizenshipNo: "87654-Sunsari",
    panNo: "125487963"
  },
  {
    id: "t-203",
    name: "Hari Prasad Poudel",
    designation: "Secondary Nepali Teacher",
    qualification: "M.A. in Nepali Literature",
    subject: "Nepali",
    contact: "+977-9811564879",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    experience: "12 Years in Teaching",
    citizenshipNo: "45218-Dhankuta",
    panNo: "542156894"
  },
  {
    id: "t-204",
    name: "Gita Bhandari",
    designation: "English Language Specialist",
    qualification: "M.A. in English Language Teaching (ELT)",
    subject: "English",
    contact: "+977-9852115544",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    experience: "6 Years in Teaching",
    citizenshipNo: "20145-Jhapa",
    panNo: "451258796"
  },
  {
    id: "t-205",
    name: "Devraj Pokharel",
    designation: "Sports Coordinator & Social Studies",
    qualification: "B.A. in Sociology, Diploma in Physical Education",
    subject: "Social Studies",
    contact: "+977-9804152368",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    experience: "10 Years in Sports Training & Teaching",
    citizenshipNo: "65897-Morang",
    panNo: "789456123"
  }
];

export const DEFAULT_ROUTINES: ClassRoutine[] = [
  {
    className: "Class 10",
    section: "A",
    schedule: [
      {
        day: "Sunday",
        periods: [
          { time: "10:00 AM - 10:45 AM", subject: "Compulsory Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "10:45 AM - 11:30 AM", subject: "English", teacher: "Mrs. Gita Bhandari" },
          { time: "11:30 AM - 12:15 PM", subject: "Science & Technology", teacher: "Ms. Sita Thapa" },
          { time: "12:15 PM - 1:00 PM", subject: "Social Studies", teacher: "Mr. Devraj Pokharel" },
          { time: "1:00 PM - 1:30 PM", subject: "Tiffin Break", teacher: "Intermission" },
          { time: "1:30 PM - 2:15 PM", subject: "Nepali", teacher: "Mr. Hari Prasad Poudel" },
          { time: "2:15 PM - 3:00 PM", subject: "Optional Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "3:00 PM - 4:00 PM", subject: "Computer Science", teacher: "Lab Assistant" }
        ]
      },
      {
        day: "Monday",
        periods: [
          { time: "10:00 AM - 10:45 AM", subject: "Nepali", teacher: "Mr. Hari Prasad Poudel" },
          { time: "10:45 AM - 11:30 AM", subject: "Compulsory Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "11:30 AM - 12:15 PM", subject: "Science & Technology", teacher: "Ms. Sita Thapa" },
          { time: "12:15 PM - 1:00 PM", subject: "English", teacher: "Mrs. Gita Bhandari" },
          { time: "1:00 PM - 1:30 PM", subject: "Tiffin Break", teacher: "Intermission" },
          { time: "1:30 PM - 2:15 PM", subject: "Optional Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "2:15 PM - 3:00 PM", subject: "Social Studies", teacher: "Mr. Devraj Pokharel" },
          { time: "3:00 PM - 4:00 PM", subject: "Library Session", teacher: "Librarian" }
        ]
      },
      {
        day: "Tuesday",
        periods: [
          { time: "10:00 AM - 10:45 AM", subject: "English", teacher: "Mrs. Gita Bhandari" },
          { time: "10:45 AM - 11:30 AM", subject: "Science & Technology", teacher: "Ms. Sita Thapa" },
          { time: "11:30 AM - 12:15 PM", subject: "Compulsory Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "12:15 PM - 1:00 PM", subject: "Nepali", teacher: "Mr. Hari Prasad Poudel" },
          { time: "1:00 PM - 1:30 PM", subject: "Tiffin Break", teacher: "Intermission" },
          { time: "1:30 PM - 2:15 PM", subject: "Social Studies", teacher: "Mr. Devraj Pokharel" },
          { time: "2:15 PM - 3:00 PM", subject: "Computer Science (Practical)", teacher: "Lab Assistant" },
          { time: "3:00 PM - 4:00 PM", subject: "Health & Physical Ed.", teacher: "Mr. Devraj Pokharel" }
        ]
      },
      {
        day: "Wednesday",
        periods: [
          { time: "10:00 AM - 10:45 AM", subject: "Compulsory Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "10:45 AM - 11:30 AM", subject: "English", teacher: "Mrs. Gita Bhandari" },
          { time: "11:30 AM - 12:15 PM", subject: "Science & Technology", teacher: "Ms. Sita Thapa" },
          { time: "12:15 PM - 1:00 PM", subject: "Social Studies", teacher: "Mr. Devraj Pokharel" },
          { time: "1:00 PM - 1:30 PM", subject: "Tiffin Break", teacher: "Intermission" },
          { time: "1:30 PM - 2:15 PM", subject: "Nepali", teacher: "Mr. Hari Prasad Poudel" },
          { time: "2:15 PM - 3:00 PM", subject: "Optional Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "3:00 PM - 4:00 PM", subject: "Moral Education", teacher: "Mr. Hari Prasad Poudel" }
        ]
      },
      {
        day: "Thursday",
        periods: [
          { time: "10:00 AM - 10:45 AM", subject: "Nepali", teacher: "Mr. Hari Prasad Poudel" },
          { time: "10:45 AM - 11:30 AM", subject: "Compulsory Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "11:30 AM - 12:15 PM", subject: "Science & Technology (Practical)", teacher: "Ms. Sita Thapa" },
          { time: "12:15 PM - 1:00 PM", subject: "English", teacher: "Mrs. Gita Bhandari" },
          { time: "1:00 PM - 1:30 PM", subject: "Tiffin Break", teacher: "Intermission" },
          { time: "1:30 PM - 2:15 PM", subject: "Social Studies", teacher: "Mr. Devraj Pokharel" },
          { time: "2:15 PM - 3:00 PM", subject: "Optional Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "3:00 PM - 4:00 PM", subject: "Club Activities", teacher: "Assigned Captains" }
        ]
      },
      {
        day: "Friday",
        periods: [
          { time: "10:00 AM - 10:45 AM", subject: "English", teacher: "Mrs. Gita Bhandari" },
          { time: "10:45 AM - 11:30 AM", subject: "Compulsory Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "11:30 AM - 12:15 PM", subject: "Science & Technology", teacher: "Ms. Sita Thapa" },
          { time: "12:15 PM - 1:00 PM", subject: "Nepali", teacher: "Mr. Hari Prasad Poudel" },
          { time: "1:00 PM - 1:30 PM", subject: "Tiffin Break", teacher: "Intermission" },
          { time: "1:30 PM - 3:00 PM", subject: "Extra-Curricular / Quiz / Debate", teacher: "All Teachers" }
        ]
      }
    ]
  },
  {
    className: "Class 9",
    section: "A",
    schedule: [
      {
        day: "Sunday",
        periods: [
          { time: "10:00 AM - 10:45 AM", subject: "English", teacher: "Mrs. Gita Bhandari" },
          { time: "10:45 AM - 11:30 AM", subject: "Science & Technology", teacher: "Ms. Sita Thapa" },
          { time: "11:30 AM - 12:15 PM", subject: "Nepali", teacher: "Mr. Hari Prasad Poudel" },
          { time: "12:15 PM - 1:00 PM", subject: "Compulsory Mathematics", teacher: "Mr. Rameshwar Prasad Adhikari" },
          { time: "1:00 PM - 1:30 PM", subject: "Tiffin Break", teacher: "Intermission" },
          { time: "1:30 PM - 2:15 PM", subject: "Social Studies", teacher: "Mr. Devraj Pokharel" },
          { time: "2:15 PM - 3:00 PM", subject: "Computer Science", teacher: "Lab Assistant" },
          { time: "3:00 PM - 4:00 PM", subject: "Library Session", teacher: "Librarian" }
        ]
      }
    ]
  }
];

export const DEFAULT_HOMEWORKS: Homework[] = [
  {
    id: "hw-1",
    className: "Class 10",
    section: "A",
    subject: "Compulsory Mathematics",
    title: "Trigonometry - Heights and Distances",
    description: "Please complete Exercise 12.2, questions 5 to 12 from your text book. Make sure to draw neat labeled geometric diagrams representing each scenario (angle of elevation and depression) before calculating the values.",
    assignedDate: "2083-04-10",
    dueDate: "2083-04-15",
    attachmentName: "Trigonometry_Practice_Sheet.pdf",
    submissions: [
      {
        studentId: "std-1001",
        studentName: "Aayush Bhandari",
        submittedAt: "2083-04-13 04:30 PM",
        fileName: "Aayush_Trig_HW.pdf",
        status: "Evaluated",
        feedback: "Excellent layout. Accurate drawings and accurate trigonometric ratio calculations. Well done!"
      },
      {
        studentId: "std-1002",
        studentName: "Sujata Shrestha",
        submittedAt: "2083-04-14 09:15 AM",
        fileName: "Sujata_Math_12.2.pdf",
        status: "Pending"
      }
    ]
  },
  {
    id: "hw-2",
    className: "Class 10",
    section: "A",
    subject: "Science & Technology",
    title: "Hydrostatics - Archimedes' Principle",
    description: "Write down the state of Archimedes' principle and the law of floatation. Calculate the upward upthrust force when a spherical metal ball of mass 2kg and density 8000 kg/m3 is completely immersed inside clean water. Show your step-by-step physics calculations.",
    assignedDate: "2083-04-12",
    dueDate: "2083-04-18",
    attachmentName: "Archimedes_Problems.pdf",
    submissions: [
      {
        studentId: "std-1001",
        studentName: "Aayush Bhandari",
        submittedAt: "2083-04-14 11:22 AM",
        fileName: "Aayush_Science_Hydrostatics.pdf",
        status: "Pending"
      }
    ]
  },
  {
    id: "hw-3",
    className: "Class 10",
    section: "A",
    subject: "English",
    title: "Essay Writing: Digital Nepal Campaign",
    description: "Write a coherent, well-structured essay of about 250-300 words on the topic: 'The Prospects and Challenges of Digital Nepal Campaign in Government Schools'. Outline how digital school management systems, ICT classes, and online courses can uplift rural classrooms.",
    assignedDate: "2083-04-13",
    dueDate: "2083-04-19",
    submissions: []
  }
];

export const DEFAULT_MARKS: StudentTermMark[] = [
  {
    studentId: "std-1001",
    term: "First Term",
    className: "Class 10",
    section: "A",
    remarks: "Highly disciplined and sharp mind. Excellent mathematical logical ability.",
    isPublished: true,
    totalGPA: 3.82,
    marks: [
      { subject: "Compulsory Mathematics", theory: 72, practical: 0, total: 72, grade: "A+", gpa: 4.0 },
      { subject: "Science & Technology", theory: 65, practical: 24, total: 89, grade: "A+", gpa: 4.0 },
      { subject: "Nepali", theory: 58, practical: 22, total: 80, grade: "A", gpa: 3.6 },
      { subject: "English", theory: 62, practical: 23, total: 85, grade: "A+", gpa: 4.0 },
      { subject: "Social Studies", theory: 55, practical: 21, total: 76, grade: "B+", gpa: 3.2 },
      { subject: "Optional Mathematics", theory: 70, practical: 0, total: 70, grade: "A", gpa: 3.6 },
      { subject: "Computer Science", theory: 48, practical: 45, total: 93, grade: "A+", gpa: 4.0 }
    ]
  },
  {
    studentId: "std-1002",
    term: "First Term",
    className: "Class 10",
    section: "A",
    remarks: "Superb language command. Extremely creative in literary sessions. Needs slight practice in Geometry.",
    isPublished: true,
    totalGPA: 3.76,
    marks: [
      { subject: "Compulsory Mathematics", theory: 60, practical: 0, total: 60, grade: "B+", gpa: 3.2 },
      { subject: "Science & Technology", theory: 68, practical: 24, total: 92, grade: "A+", gpa: 4.0 },
      { subject: "Nepali", theory: 62, practical: 23, total: 85, grade: "A+", gpa: 4.0 },
      { subject: "English", theory: 70, practical: 25, total: 95, grade: "A+", gpa: 4.0 },
      { subject: "Social Studies", theory: 61, practical: 23, total: 84, grade: "A", gpa: 3.6 },
      { subject: "Optional Mathematics", theory: 52, practical: 0, total: 52, grade: "C+", gpa: 2.8 },
      { subject: "Computer Science", theory: 46, practical: 48, total: 94, grade: "A+", gpa: 4.0 }
    ]
  },
  {
    studentId: "std-1003",
    term: "First Term",
    className: "Class 10",
    section: "A",
    remarks: "Sincere student. Good performance but should focus more on writing skills and science practicals.",
    isPublished: true,
    totalGPA: 3.24,
    marks: [
      { subject: "Compulsory Mathematics", theory: 48, practical: 0, total: 48, grade: "C+", gpa: 2.8 },
      { subject: "Science & Technology", theory: 45, practical: 18, total: 63, grade: "B", gpa: 3.0 },
      { subject: "Nepali", theory: 50, practical: 19, total: 69, grade: "B+", gpa: 3.2 },
      { subject: "English", theory: 54, practical: 20, total: 74, grade: "B+", gpa: 3.2 },
      { subject: "Social Studies", theory: 48, practical: 18, total: 66, grade: "B", gpa: 3.0 },
      { subject: "Optional Mathematics", theory: 45, practical: 0, total: 45, grade: "C+", gpa: 2.8 },
      { subject: "Computer Science", theory: 40, practical: 42, total: 82, grade: "A", gpa: 3.6 }
    ]
  }
];

export const DEFAULT_FEES: StudentFee[] = [
  {
    studentId: "std-1001",
    feeItems: [
      { id: "fee-1-1", month: "Baishakh", type: "Monthly Tuition Fee", amount: 1500, isPaid: true, paymentDate: "2083-01-15", paymentMethod: "eSewa", receiptNo: "RE-2083-10024" },
      { id: "fee-1-2", month: "Baishakh", type: "Registration & Identity Card Fee", amount: 800, isPaid: true, paymentDate: "2083-01-15", paymentMethod: "eSewa", receiptNo: "RE-2083-10025" },
      { id: "fee-1-3", month: "Jestha", type: "Monthly Tuition Fee", amount: 1500, isPaid: true, paymentDate: "2083-02-18", paymentMethod: "Khalti", receiptNo: "RE-2083-11245" },
      { id: "fee-1-4", month: "Asar", type: "Monthly Tuition Fee", amount: 1500, isPaid: true, paymentDate: "2083-03-20", paymentMethod: "ConnectIPS", receiptNo: "RE-2083-12489" },
      { id: "fee-1-5", month: "Asar", type: "First Term Examination Fee", amount: 600, isPaid: true, paymentDate: "2083-03-20", paymentMethod: "ConnectIPS", receiptNo: "RE-2083-12490" },
      { id: "fee-1-6", month: "Shrawan", type: "Monthly Tuition Fee", amount: 1500, isPaid: false },
      { id: "fee-1-7", month: "Bhadra", type: "Monthly Tuition Fee", amount: 1500, isPaid: false }
    ]
  },
  {
    studentId: "std-1002",
    feeItems: [
      { id: "fee-2-1", month: "Baishakh", type: "Monthly Tuition Fee", amount: 1500, isPaid: true, paymentDate: "2083-01-12", paymentMethod: "eSewa", receiptNo: "RE-2083-10011" },
      { id: "fee-2-2", month: "Baishakh", type: "Registration & Identity Card Fee", amount: 800, isPaid: true, paymentDate: "2083-01-12", paymentMethod: "eSewa", receiptNo: "RE-2083-10012" },
      { id: "fee-2-3", month: "Jestha", type: "Monthly Tuition Fee", amount: 1500, isPaid: true, paymentDate: "2083-02-14", paymentMethod: "eSewa", receiptNo: "RE-2083-11048" },
      { id: "fee-2-4", month: "Asar", type: "Monthly Tuition Fee", amount: 1500, isPaid: false },
      { id: "fee-2-5", month: "Asar", type: "First Term Examination Fee", amount: 600, isPaid: false },
      { id: "fee-2-6", month: "Shrawan", type: "Monthly Tuition Fee", amount: 1500, isPaid: false }
    ]
  },
  {
    studentId: "std-1003",
    feeItems: [
      { id: "fee-3-1", month: "Baishakh", type: "Monthly Tuition Fee", amount: 1500, isPaid: true, paymentDate: "2083-01-20", paymentMethod: "ConnectIPS", receiptNo: "RE-2083-10089" },
      { id: "fee-3-2", month: "Baishakh", type: "Registration & Identity Card Fee", amount: 800, isPaid: true, paymentDate: "2083-01-20", paymentMethod: "ConnectIPS", receiptNo: "RE-2083-10090" },
      { id: "fee-3-3", month: "Jestha", type: "Monthly Tuition Fee", amount: 1500, isPaid: false },
      { id: "fee-3-4", month: "Asar", type: "Monthly Tuition Fee", amount: 1500, isPaid: false },
      { id: "fee-3-5", month: "Shrawan", type: "Monthly Tuition Fee", amount: 1500, isPaid: false }
    ]
  }
];

export const DEFAULT_LIBRARY_BOOKS: LibraryBook[] = [
  { id: "lib-101", title: "Compulsory Mathematics Class 10", author: "Government Curriculum Development Center", category: "Mathematics", status: "Available", fine: 0 },
  { id: "lib-102", title: "A Brief History of Time", author: "Stephen Hawking", category: "Scientific Literature", status: "Issued", issueDate: "2083-03-25", returnDate: "2083-04-10", fine: 40, borrowerId: "std-1001" },
  { id: "lib-103", title: "Muna Madan", author: "Laxmi Prasad Devkota", category: "Nepali Literature", status: "Issued", issueDate: "2083-04-02", returnDate: "2083-04-17", fine: 0, borrowerId: "std-1002" },
  { id: "lib-104", title: "Concepts of Modern Physics", author: "Arthur Beiser", category: "Physics", status: "Available", fine: 0 },
  { id: "lib-105", title: "Shirish Ko Phool", author: "Parijat", category: "Nepali Fiction", status: "Available", fine: 0 },
  { id: "lib-106", title: "Modern Software Engineering", author: "David Farley", category: "Computer Science", status: "Available", fine: 0 }
];

export const DEFAULT_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: "leave-501",
    studentId: "std-1001",
    studentName: "Aayush Bhandari",
    className: "Class 10",
    section: "A",
    reason: "Suffering from high fever and cold. Doctor advised complete bed rest for 3 days.",
    startDate: "2083-04-14",
    endDate: "2083-04-16",
    status: "Approved",
    appliedDate: "2083-04-13"
  },
  {
    id: "leave-502",
    studentId: "std-1002",
    studentName: "Sujata Shrestha",
    className: "Class 10",
    section: "A",
    reason: "Going out of valley to attend my maternal uncle's wedding ceremony with my family.",
    startDate: "2083-04-19",
    endDate: "2083-04-22",
    status: "Pending",
    appliedDate: "2083-04-14"
  }
];

export const DEFAULT_COMPLAINTS: ComplaintSuggestion[] = [
  {
    id: "comp-1",
    senderName: "Krishna Prasad Bhandari",
    role: "Parent",
    type: "Suggestion",
    content: "The water purification filters in the ground floor canteen block need scheduled servicing. Kindly inspect it to ensure safe drinking water for junior class kids.",
    date: "2083-04-08"
  },
  {
    id: "comp-2",
    senderName: "Anonymous",
    role: "Anonymous",
    type: "Complaint",
    content: "Some high school students from class 10 are creating high commotion near the library entrance corridor during third period break. Requesting teacher rounds.",
    date: "2083-04-12"
  },
  {
    id: "comp-3",
    senderName: "Sita Thapa",
    role: "Teacher",
    type: "Suggestion",
    content: "We should allocate a budget of Rs. 15,000 for purchasing fresh lab reagents (Copper sulfate, zinc granules, hydrochloric acid) for the class 10 practical board preparation.",
    date: "2083-04-13"
  }
];

export const DEFAULT_ATTENDANCE: StudentAttendance[] = [
  {
    studentId: "std-1001",
    records: [
      { date: "2083-04-01", status: "Present" },
      { date: "2083-04-02", status: "Present" },
      { date: "2083-04-03", status: "Present" },
      { date: "2083-04-04", status: "Present" },
      { date: "2083-04-05", status: "Present" },
      { date: "2083-04-07", status: "Present" },
      { date: "2083-04-08", status: "Present" },
      { date: "2083-04-09", status: "Present" },
      { date: "2083-04-10", status: "Present" },
      { date: "2083-04-11", status: "Present" },
      { date: "2083-04-12", status: "Present" },
      { date: "2083-04-13", status: "Present" }
    ]
  },
  {
    studentId: "std-1002",
    records: [
      { date: "2083-04-01", status: "Present" },
      { date: "2083-04-02", status: "Present" },
      { date: "2083-04-03", status: "Present" },
      { date: "2083-04-04", status: "Absent" },
      { date: "2083-04-05", status: "Present" },
      { date: "2083-04-07", status: "Present" },
      { date: "2083-04-08", status: "Present" },
      { date: "2083-04-09", status: "Present" },
      { date: "2083-04-10", status: "Present" },
      { date: "2083-04-11", status: "Present" },
      { date: "2083-04-12", status: "Present" },
      { date: "2083-04-13", status: "Present" }
    ]
  },
  {
    studentId: "std-1003",
    records: [
      { date: "2083-04-01", status: "Present" },
      { date: "2083-04-02", status: "Present" },
      { date: "2083-04-03", status: "Absent" },
      { date: "2083-04-04", status: "Absent" },
      { date: "2083-04-05", status: "Present" },
      { date: "2083-04-07", status: "Present" },
      { date: "2083-04-08", status: "Present" },
      { date: "2083-04-09", status: "Present" },
      { date: "2083-04-10", status: "Present" },
      { date: "2083-04-11", status: "Absent" },
      { date: "2083-04-12", status: "Present" },
      { date: "2083-04-13", status: "Present" }
    ]
  }
];
