import { Doctor, User, Appointment, MedicalDocument, Review } from '../types/index.ts';

// Initial verified and pending doctors
export const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'user-doc-1',
    name: 'Dr. Evelyn Vance, MD',
    email: 'dr.vance@medibook.health',
    avatar: '/src/assets/images/doctor_cardiologist_avatar_1793451712466.jpg',
    specialty: 'Cardiology',
    qualification: 'MD, FACC - Johns Hopkins Medicine',
    experienceYears: 16,
    hospitalAffiliation: 'Metropolitan Heart & Vascular Institute',
    clinicAddress: '450 Lexington Ave, Suite 600, New York, NY',
    consultationFee: 120,
    rating: 4.95,
    reviewCount: 148,
    status: 'approved',
    medicalLicenseNumber: 'NY-MED-849201',
    about: 'Dr. Evelyn Vance is a board-certified cardiologist specializing in preventive cardiology, cardiovascular diagnostics, arrhythmia management, and hypertension control. Over 16 years of clinical practice.',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableSlots: [
      { time: '09:00 AM', period: 'morning', available: true },
      { time: '10:30 AM', period: 'morning', available: false },
      { time: '11:15 AM', period: 'morning', available: true },
      { time: '02:00 PM', period: 'afternoon', available: true },
      { time: '03:30 PM', period: 'afternoon', available: true },
      { time: '05:00 PM', period: 'evening', available: true },
    ],
    consultationModes: ['in_person', 'telehealth'],
    languages: ['English', 'French'],
    nextAvailableDate: 'Tomorrow at 09:00 AM'
  },
  {
    id: 'doc-2',
    userId: 'user-doc-2',
    name: 'Dr. Alexander Mercer, MD',
    email: 'dr.mercer@medibook.health',
    avatar: '/src/assets/images/doctor_neurologist_avatar_1793451712999.jpg',
    specialty: 'Neurology',
    qualification: 'MD, FAAN - Stanford University School of Medicine',
    experienceYears: 14,
    hospitalAffiliation: 'Central Neuroscience Medical Center',
    clinicAddress: '1200 Beacon Boulevard, Suite 410, Boston, MA',
    consultationFee: 135,
    rating: 4.91,
    reviewCount: 112,
    status: 'approved',
    medicalLicenseNumber: 'MA-MED-593021',
    about: 'Dr. Mercer is an esteemed neurologist focused on migraine therapies, cognitive neuroscience, peripheral neuropathies, and spine-nerve assessments.',
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri'],
    availableSlots: [
      { time: '09:30 AM', period: 'morning', available: true },
      { time: '11:00 AM', period: 'morning', available: true },
      { time: '01:30 PM', period: 'afternoon', available: true },
      { time: '03:00 PM', period: 'afternoon', available: false },
      { time: '04:30 PM', period: 'evening', available: true },
    ],
    consultationModes: ['in_person', 'telehealth'],
    languages: ['English', 'German'],
    nextAvailableDate: 'Today at 01:30 PM'
  },
  {
    id: 'doc-3',
    userId: 'user-doc-3',
    name: 'Dr. Samantha Jenkins, MD',
    email: 'dr.jenkins@medibook.health',
    avatar: '/src/assets/images/doctor_pediatrician_avatar_1793451713787.jpg',
    specialty: 'Pediatrics',
    qualification: 'MD, FAAP - Columbia University Vagelos College of Physicians',
    experienceYears: 11,
    hospitalAffiliation: 'Children & Family Health Pavilion',
    clinicAddress: '88 River Street, 2nd Floor, Seattle, WA',
    consultationFee: 90,
    rating: 4.98,
    reviewCount: 204,
    status: 'approved',
    medicalLicenseNumber: 'WA-MED-318492',
    about: 'Dr. Jenkins provides gentle, evidence-based pediatric care from newborn development to adolescent health, immunization plans, and acute pediatric consultations.',
    availableDays: ['Tue', 'Wed', 'Thu', 'Sat'],
    availableSlots: [
      { time: '10:00 AM', period: 'morning', available: true },
      { time: '11:30 AM', period: 'morning', available: true },
      { time: '02:15 PM', period: 'afternoon', available: true },
      { time: '04:00 PM', period: 'evening', available: true },
    ],
    consultationModes: ['in_person', 'telehealth'],
    languages: ['English', 'Spanish'],
    nextAvailableDate: 'Tomorrow at 10:00 AM'
  },
  {
    id: 'doc-4',
    userId: 'user-doc-4',
    name: 'Dr. Aris Patel, MD, FAAD',
    email: 'dr.patel@medibook.health',
    avatar: '/src/assets/images/doctor_dermatologist_avatar_1793451713081.jpg',
    specialty: 'Dermatology',
    qualification: 'MD, FAAD - University of Pennsylvania Health System',
    experienceYears: 12,
    hospitalAffiliation: 'Advanced Dermatology & Laser Clinic',
    clinicAddress: '650 Pine Crest Ave, Suite 300, Chicago, IL',
    consultationFee: 110,
    rating: 4.88,
    reviewCount: 95,
    status: 'approved',
    medicalLicenseNumber: 'IL-MED-920412',
    about: 'Dr. Aris Patel focuses on medical and clinical dermatology including acne solutions, eczema, psoriasis management, skin cancer screenings, and mole evaluations.',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    availableSlots: [
      { time: '08:30 AM', period: 'morning', available: true },
      { time: '10:00 AM', period: 'morning', available: true },
      { time: '01:00 PM', period: 'afternoon', available: true },
      { time: '02:45 PM', period: 'afternoon', available: true },
      { time: '04:15 PM', period: 'evening', available: true },
    ],
    consultationModes: ['in_person', 'telehealth'],
    languages: ['English', 'Hindi', 'Gujarati'],
    nextAvailableDate: 'Today at 02:45 PM'
  },
  {
    id: 'doc-5',
    userId: 'user-doc-5',
    name: 'Dr. Marcus Holloway, MD',
    email: 'dr.holloway@medibook.health',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Orthopedics',
    qualification: 'MD, FAAOS - Mayo Clinic Orthopedic Surgery',
    experienceYears: 18,
    hospitalAffiliation: 'Summit Sports Medicine & Joint Center',
    clinicAddress: '310 Olympic Way, Denver, CO',
    consultationFee: 140,
    rating: 4.92,
    reviewCount: 88,
    status: 'approved',
    medicalLicenseNumber: 'CO-MED-771239',
    about: 'Specialist in sports injury reconstruction, knee and shoulder arthroscopy, joint preservation, and rehabilitation protocols.',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableSlots: [
      { time: '09:00 AM', period: 'morning', available: true },
      { time: '11:00 AM', period: 'morning', available: true },
      { time: '02:00 PM', period: 'afternoon', available: true },
    ],
    consultationModes: ['in_person'],
    languages: ['English'],
    nextAvailableDate: 'In 2 days at 09:00 AM'
  },
  {
    id: 'doc-6',
    userId: 'user-doc-6',
    name: 'Dr. Leila Chen, MD',
    email: 'dr.chen@medibook.health',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=400',
    specialty: 'General Medicine',
    qualification: 'MD - Northwestern University Feinberg School',
    experienceYears: 9,
    hospitalAffiliation: 'Midtown Primary Health Care',
    clinicAddress: '500 Michigan Ave, Suite 120, Chicago, IL',
    consultationFee: 75,
    rating: 4.86,
    reviewCount: 74,
    status: 'pending', // Pending verification in admin queue!
    medicalLicenseNumber: 'IL-MED-849100-PENDING',
    about: 'General practitioner with focus on preventative health, metabolic wellness, routine health screening, and personalized lifestyle medicine.',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableSlots: [
      { time: '09:00 AM', period: 'morning', available: true },
      { time: '01:00 PM', period: 'afternoon', available: true },
    ],
    consultationModes: ['in_person', 'telehealth'],
    languages: ['English', 'Mandarin'],
    nextAvailableDate: 'Pending Verification'
  }
];

// Seed users for instant exploration
export const initialUsers: User[] = [
  {
    id: 'user-patient-1',
    name: 'Dhana S.',
    email: 'dhanshiyar@gmail.com',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    dob: '1992-05-14',
    gender: 'Female',
    bloodGroup: 'O+',
    emergencyContact: 'Rajesh S. (+1 555-890-1234)',
    createdAt: '2025-10-15T08:00:00.000Z'
  },
  {
    id: 'user-doc-2',
    name: 'Dr. Alexander Mercer, MD',
    email: 'dr.mercer@medibook.health',
    role: 'doctor',
    phone: '+1 (555) 678-9012',
    doctorId: 'doc-2',
    createdAt: '2025-09-01T08:00:00.000Z'
  },
  {
    id: 'user-admin-1',
    name: 'Eleanor Vance (Hospital Director)',
    email: 'admin@medibook.health',
    role: 'admin',
    phone: '+1 (555) 999-0000',
    createdAt: '2025-08-01T08:00:00.000Z'
  }
];

// Seed appointments
export const initialAppointments: Appointment[] = [
  {
    id: 'apt-101',
    doctorId: 'doc-2',
    doctorName: 'Dr. Alexander Mercer, MD',
    doctorSpecialty: 'Neurology',
    doctorAvatar: '/src/assets/images/doctor_neurologist_avatar_1793451712999.jpg',
    doctorHospital: 'Central Neuroscience Medical Center',
    patientId: 'user-patient-1',
    patientName: 'Dhana S.',
    patientEmail: 'dhanshiyar@gmail.com',
    patientPhone: '+1 (555) 234-5678',
    date: '2026-11-04',
    timeSlot: '01:30 PM',
    type: 'telehealth',
    status: 'confirmed',
    symptoms: 'Recurring tension headaches in the temple area, light sensitivity after screen time.',
    notes: 'Please bring recent vision test results or MRI scans if available.',
    attachedDocumentIds: ['doc-file-1'],
    fee: 135,
    paymentStatus: 'paid',
    createdAt: '2026-10-28T14:20:00.000Z'
  },
  {
    id: 'apt-102',
    doctorId: 'doc-1',
    doctorName: 'Dr. Evelyn Vance, MD',
    doctorSpecialty: 'Cardiology',
    doctorAvatar: '/src/assets/images/doctor_cardiologist_avatar_1793451712466.jpg',
    doctorHospital: 'Metropolitan Heart & Vascular Institute',
    patientId: 'user-patient-1',
    patientName: 'Dhana S.',
    patientEmail: 'dhanshiyar@gmail.com',
    patientPhone: '+1 (555) 234-5678',
    date: '2026-10-14',
    timeSlot: '11:15 AM',
    type: 'in_person',
    status: 'completed',
    symptoms: 'Annual cardiovascular risk screening and resting heart rate monitoring.',
    fee: 120,
    paymentStatus: 'paid',
    prescription: {
      id: 'rx-201',
      appointmentId: 'apt-102',
      doctorName: 'Dr. Evelyn Vance, MD',
      doctorSpecialty: 'Cardiology',
      patientName: 'Dhana S.',
      diagnosis: 'Mild sinus tachycardia with normal ECG morphology. Lifestyle-induced stress markers.',
      medications: [
        {
          name: 'Coenzyme Q10 (Ubiquinol)',
          dosage: '100mg',
          frequency: 'Once daily after breakfast',
          duration: '60 days',
          notes: 'Mitochondrial and cardiac tissue support'
        },
        {
          name: 'Magnesium Glycinate',
          dosage: '200mg',
          frequency: 'Nightly before sleep',
          duration: '30 days',
          notes: 'Helps with sleep quality and muscle relaxation'
        }
      ],
      advice: 'Maintain daily 30-min brisk walk. Limit espresso intake to 1 cup before 11:00 AM. Hydrate 2.5L daily.',
      followUpDate: '2027-04-15',
      issuedAt: '2026-10-14T12:05:00.000Z'
    },
    createdAt: '2026-10-10T09:15:00.000Z'
  },
  {
    id: 'apt-103',
    doctorId: 'doc-4',
    doctorName: 'Dr. Aris Patel, MD, FAAD',
    doctorSpecialty: 'Dermatology',
    doctorAvatar: '/src/assets/images/doctor_dermatologist_avatar_1793451713081.jpg',
    doctorHospital: 'Advanced Dermatology & Laser Clinic',
    patientId: 'user-patient-1',
    patientName: 'Dhana S.',
    patientEmail: 'dhanshiyar@gmail.com',
    patientPhone: '+1 (555) 234-5678',
    date: '2026-11-09',
    timeSlot: '10:00 AM',
    type: 'in_person',
    status: 'pending',
    symptoms: 'Seasonal contact dermatitis on right forearm, itching during temperature changes.',
    fee: 110,
    paymentStatus: 'paid',
    createdAt: '2026-10-30T16:45:00.000Z'
  }
];

// Seed medical documents vault
export const initialDocuments: MedicalDocument[] = [
  {
    id: 'doc-file-1',
    patientId: 'user-patient-1',
    title: 'Comprehensive Metabolic & Lipid Panel',
    type: 'lab_report',
    fileName: 'Quest_Diagnostics_Lipid_Panel_2026.pdf',
    fileSize: '1.4 MB',
    uploadedAt: '2026-10-12',
    sharedWithDoctorIds: ['doc-1', 'doc-2'],
    description: 'Fasting lipid profile, HbA1c (5.3%), normal kidney and liver function indices.'
  },
  {
    id: 'doc-file-2',
    patientId: 'user-patient-1',
    title: 'Resting 12-Lead Electrocardiogram (ECG)',
    type: 'scan_imaging',
    fileName: 'MetroHeart_Resting_ECG_Report.pdf',
    fileSize: '2.8 MB',
    uploadedAt: '2026-10-14',
    sharedWithDoctorIds: ['doc-1'],
    description: 'Normal sinus rhythm, regular rate 72 bpm, no ST-elevation or ischemia noted.'
  },
  {
    id: 'doc-file-3',
    patientId: 'user-patient-1',
    title: 'Official Rx: Vance Cardiology Care Plan',
    type: 'prescription',
    fileName: 'Rx_DrVance_CarePlan_Oct2026.pdf',
    fileSize: '480 KB',
    uploadedAt: '2026-10-14',
    sharedWithDoctorIds: ['doc-1'],
    description: 'Prescription with CoQ10 100mg, Magnesium Glycinate, and exercise recommendations.'
  }
];

// Seed reviews
export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    doctorId: 'doc-1',
    patientId: 'user-patient-1',
    patientName: 'Dhana S.',
    rating: 5,
    comment: 'Dr. Vance was incredibly thorough and attentive. She walked me through every parameter of my cardiac panel without rushing. Highly recommend her clinic!',
    date: '2 weeks ago',
    verifiedVisit: true
  },
  {
    id: 'rev-2',
    doctorId: 'doc-1',
    patientId: 'user-patient-2',
    patientName: 'Robert Martinez',
    rating: 5,
    comment: 'Clear explanations, empathetic bedside manner, and the facility is pristine.',
    date: '1 month ago',
    verifiedVisit: true
  },
  {
    id: 'rev-3',
    doctorId: 'doc-2',
    patientId: 'user-patient-3',
    patientName: 'Catherine Kim',
    rating: 5,
    comment: 'Dr. Mercer diagnosed my chronic vestibular migraine after months of uncertainty. Telehealth appointment was prompt and seamless.',
    date: '3 weeks ago',
    verifiedVisit: true
  },
  {
    id: 'rev-4',
    doctorId: 'doc-3',
    patientId: 'user-patient-4',
    patientName: 'David Miller',
    rating: 5,
    comment: 'Dr. Jenkins was wonderful with our 5-year-old daughter. She put her at ease immediately during the wellness check.',
    date: '2 weeks ago',
    verifiedVisit: true
  }
];
