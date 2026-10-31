import { Doctor, User, Appointment, MedicalDocument, Review, PlatformStats } from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, role?: string): Promise<{ success: boolean; token: string; user: User; doctor?: Doctor }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    return res.json();
  },

  async register(data: {
    name: string;
    email: string;
    role: string;
    phone?: string;
    specialty?: string;
    licenseNumber?: string;
    qualification?: string;
  }): Promise<{ success: boolean; token: string; user: User; doctor?: Doctor; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Doctors
  async getDoctors(filters?: {
    search?: string;
    specialty?: string;
    minRating?: number;
    maxFee?: number;
    mode?: string;
    status?: string;
  }): Promise<{ success: boolean; count: number; doctors: Doctor[] }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.specialty && filters.specialty !== 'All') params.append('specialty', filters.specialty);
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());
    if (filters?.maxFee) params.append('maxFee', filters.maxFee.toString());
    if (filters?.mode && filters.mode !== 'all') params.append('mode', filters.mode);
    if (filters?.status) params.append('status', filters.status);

    const res = await fetch(`${API_BASE}/doctors?${params.toString()}`);
    return res.json();
  },

  async getDoctor(id: string): Promise<{ success: boolean; doctor: Doctor; reviews: Review[] }> {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    return res.json();
  },

  async updateDoctor(id: string, data: Partial<Doctor>): Promise<{ success: boolean; doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Appointments
  async getAppointments(filters?: {
    userId?: string;
    doctorId?: string;
    role?: string;
  }): Promise<{ success: boolean; count: number; appointments: Appointment[] }> {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.doctorId) params.append('doctorId', filters.doctorId);
    if (filters?.role) params.append('role', filters.role);

    const res = await fetch(`${API_BASE}/appointments?${params.toString()}`);
    return res.json();
  },

  async bookAppointment(data: {
    doctorId: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    date: string;
    timeSlot: string;
    type: 'in_person' | 'telehealth';
    symptoms?: string;
    notes?: string;
    attachedDocumentIds?: string[];
  }): Promise<{ success: boolean; appointment: Appointment; message: string }> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateAppointmentStatus(
    id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
    date?: string,
    timeSlot?: string
  ): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, date, timeSlot }),
    });
    return res.json();
  },

  async issuePrescription(
    appointmentId: string,
    data: {
      diagnosis: string;
      medications: { name: string; dosage: string; frequency: string; duration: string; notes?: string }[];
      advice: string;
      followUpDate?: string;
    }
  ): Promise<{ success: boolean; appointment: Appointment; prescription: any; document: MedicalDocument }> {
    const res = await fetch(`${API_BASE}/appointments/${appointmentId}/prescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Documents
  async getDocuments(patientId?: string): Promise<{ success: boolean; count: number; documents: MedicalDocument[] }> {
    const url = patientId ? `${API_BASE}/documents?patientId=${patientId}` : `${API_BASE}/documents`;
    const res = await fetch(url);
    return res.json();
  },

  async uploadDocument(data: {
    title: string;
    type: string;
    fileName: string;
    fileSize: string;
    patientId: string;
    description?: string;
    fileContentUrl?: string;
  }): Promise<{ success: boolean; document: MedicalDocument }> {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Reviews
  async getReviews(doctorId: string): Promise<{ success: boolean; reviews: Review[] }> {
    const res = await fetch(`${API_BASE}/reviews/doctor/${doctorId}`);
    return res.json();
  },

  async addReview(
    doctorId: string,
    data: { rating: number; comment: string; patientName: string; patientId: string }
  ): Promise<{ success: boolean; review: Review; doctorRating: number }> {
    const res = await fetch(`${API_BASE}/reviews/doctor/${doctorId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Admin
  async getAdminStats(): Promise<{ success: boolean; stats: PlatformStats }> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    return res.json();
  },

  async getPendingDoctors(): Promise<{ success: boolean; count: number; doctors: Doctor[] }> {
    const res = await fetch(`${API_BASE}/admin/pending-doctors`);
    return res.json();
  },

  async approveDoctor(id: string): Promise<{ success: boolean; message: string; doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/admin/doctors/${id}/approve`, {
      method: 'PATCH',
    });
    return res.json();
  },

  async rejectDoctor(id: string): Promise<{ success: boolean; message: string; doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/admin/doctors/${id}/reject`, {
      method: 'PATCH',
    });
    return res.json();
  },

  // Test Runner
  async runCrudTests(): Promise<any> {
    const res = await fetch(`${API_BASE}/test-crud`);
    return res.json();
  },
};
