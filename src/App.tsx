import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { DoctorSearchHero } from './components/DoctorSearchHero.tsx';
import { DoctorDirectory } from './components/DoctorDirectory.tsx';
import { DoctorDetailModal } from './components/DoctorDetailModal.tsx';
import { BookingWizardModal } from './components/BookingWizardModal.tsx';
import { PatientPortal } from './components/PatientPortal.tsx';
import { DoctorDashboard } from './components/DoctorDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { TelehealthRoomModal } from './components/TelehealthRoomModal.tsx';
import { PrescriptionViewerModal } from './components/PrescriptionViewerModal.tsx';
import { ApiInspectorModal } from './components/ApiInspectorModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Doctor, Appointment, MedicalDocument, PlatformStats, Prescription } from './types/index.ts';
import { api } from './services/api.ts';
import { initialDoctors } from './data/seedData.ts';

function MainApp() {
  const { currentUser, currentDoctor } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('find-doctors');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedMode, setSelectedMode] = useState('all');
  const [maxFee, setMaxFee] = useState(200);

  // Data state
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors.filter((d) => d.status === 'approved'));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [adminStats, setAdminStats] = useState<PlatformStats | null>(null);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  // Modals state
  const [selectedDoctorForDetail, setSelectedDoctorForDetail] = useState<Doctor | null>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [activeTelehealthApt, setActiveTelehealthApt] = useState<Appointment | null>(null);
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const [isApiInspectorOpen, setIsApiInspectorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load doctors with current filters
  const loadDoctors = async () => {
    setIsLoadingDoctors(true);
    try {
      const res = await api.getDoctors({
        search: searchTerm,
        specialty: selectedSpecialty,
        mode: selectedMode,
        maxFee,
        status: 'approved',
      });
      if (res.success) {
        setDoctors(res.doctors);
      }
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  // Load appointments
  const loadAppointments = async () => {
    try {
      const res = await api.getAppointments({
        userId: currentUser?.id,
        role: currentUser?.role,
      });
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    }
  };

  // Load documents
  const loadDocuments = async () => {
    try {
      const res = await api.getDocuments(currentUser?.id);
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err) {
      console.error('Failed to load documents', err);
    }
  };

  // Load Admin Data
  const loadAdminData = async () => {
    try {
      const statsRes = await api.getAdminStats();
      if (statsRes.success) setAdminStats(statsRes.stats);

      const pendingRes = await api.getPendingDoctors();
      if (pendingRes.success) setPendingDoctors(pendingRes.doctors);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  // Initial and reactive loads
  useEffect(() => {
    loadDoctors();
  }, [searchTerm, selectedSpecialty, selectedMode, maxFee]);

  useEffect(() => {
    loadAppointments();
    loadDocuments();
    loadAdminData();
  }, [currentUser]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All');
    setSelectedMode('all');
    setMaxFee(200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => setSelectedDoctorForBooking(doctors[0] || null)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenApiInspector={() => setIsApiInspectorOpen(true)}
        pendingDoctorCount={pendingDoctors.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'find-doctors' && (
          <div>
            <DoctorSearchHero
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              maxFee={maxFee}
              setMaxFee={setMaxFee}
            />

            <DoctorDirectory
              doctors={doctors}
              isLoading={isLoadingDoctors}
              onSelectDoctor={(doc) => setSelectedDoctorForDetail(doc)}
              onBookDoctor={(doc) => setSelectedDoctorForBooking(doc)}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {(activeTab === 'my-appointments' || activeTab === 'medical-vault') && (
          <PatientPortal
            appointments={appointments}
            documents={documents}
            onRefreshAppointments={loadAppointments}
            onRefreshDocuments={loadDocuments}
            onOpenBooking={() => setSelectedDoctorForBooking(doctors[0] || null)}
            onJoinTelehealth={(apt) => setActiveTelehealthApt(apt)}
            onViewPrescription={(rx) => setActivePrescription(rx)}
          />
        )}

        {activeTab === 'doctor-portal' && (
          <DoctorDashboard
            doctor={
              currentUser?.role === 'doctor'
                ? currentDoctor || doctors.find((d) => d.id === 'doc-2') || doctors[0]
                : doctors[0]
            }
            appointments={appointments}
            onRefreshAppointments={loadAppointments}
            onRefreshDoctor={loadDoctors}
            onJoinTelehealth={(apt) => setActiveTelehealthApt(apt)}
          />
        )}

        {activeTab === 'admin-portal' && (
          <AdminDashboard
            stats={adminStats}
            pendingDoctors={pendingDoctors}
            appointments={appointments}
            onRefreshAll={() => {
              loadAdminData();
              loadDoctors();
              loadAppointments();
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">MediBook</span>
            <span>— Healthcare Appointment & Practice Management Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiInspectorOpen(true)}
              className="text-teal-700 hover:underline font-mono"
            >
              Live REST API Explorer
            </button>
            <span aria-hidden="true">·</span>
            <span>HIPAA-Compliant Encrypted Vault</span>
          </div>
        </div>
      </footer>

      {/* Doctor Detail & Credentials Modal */}
      {selectedDoctorForDetail && (
        <DoctorDetailModal
          doctor={selectedDoctorForDetail}
          onClose={() => setSelectedDoctorForDetail(null)}
          onBook={(doc) => {
            setSelectedDoctorForDetail(null);
            setSelectedDoctorForBooking(doc);
          }}
        />
      )}

      {/* Multi-step Appointment Booking Wizard */}
      {selectedDoctorForBooking && (
        <BookingWizardModal
          doctor={selectedDoctorForBooking}
          availableDocuments={documents}
          onClose={() => setSelectedDoctorForBooking(null)}
          onSuccess={(newApt) => {
            loadAppointments();
          }}
        />
      )}

      {/* Virtual Telehealth Consultation Room */}
      {activeTelehealthApt && (
        <TelehealthRoomModal
          appointment={activeTelehealthApt}
          onClose={() => setActiveTelehealthApt(null)}
        />
      )}

      {/* Official Prescription Printable Viewer */}
      {activePrescription && (
        <PrescriptionViewerModal
          prescription={activePrescription}
          onClose={() => setActivePrescription(null)}
        />
      )}

      {/* REST API & CRUD Testing Console */}
      <ApiInspectorModal
        isOpen={isApiInspectorOpen}
        onClose={() => setIsApiInspectorOpen(false)}
      />

      {/* Authentication & Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
