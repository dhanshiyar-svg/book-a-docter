export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  createdAt: string;
  doctorId?: string; // If role is doctor
}

export type Specialty = 
  | 'Cardiology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Orthopedics'
  | 'General Medicine'
  | 'Ophthalmology'
  | 'Psychiatry';

export interface TimeSlot {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface Doctor {
  id: string;
  userId?: string;
  name: string;
  email: string;
  avatar: string;
  specialty: Specialty;
  qualification: string;
  experienceYears: number;
  hospitalAffiliation: string;
  clinicAddress: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  status: 'approved' | 'pending' | 'rejected';
  medicalLicenseNumber: string;
  about: string;
  availableDays: string[];
  availableSlots: TimeSlot[];
  consultationModes: ('in_person' | 'telehealth')[];
  languages: string[];
  nextAvailableDate: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationType = 'in_person' | 'telehealth';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  diagnosis: string;
  medications: Medication[];
  advice: string;
  followUpDate?: string;
  issuedAt: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorAvatar: string;
  doctorHospital: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  type: ConsultationType;
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  attachedDocumentIds?: string[];
  fee: number;
  paymentStatus: 'paid' | 'pending';
  prescription?: Prescription | null;
  createdAt: string;
}

export type DocumentType = 'lab_report' | 'prescription' | 'scan_imaging' | 'discharge_summary' | 'insurance';

export interface MedicalDocument {
  id: string;
  patientId: string;
  title: string;
  type: DocumentType;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  sharedWithDoctorIds: string[];
  fileContentUrl?: string;
  description?: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedVisit: boolean;
}

export interface PlatformStats {
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  pendingApprovals: number;
  completedConsultations: number;
  overallSatisfaction: number;
}
