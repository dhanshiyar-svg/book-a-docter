import React, { useState } from 'react';
import { Appointment, MedicalDocument, Prescription } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Pill,
  Shield,
  FileCheck,
} from 'lucide-react';

interface PatientPortalProps {
  appointments: Appointment[];
  documents: MedicalDocument[];
  onRefreshAppointments: () => void;
  onRefreshDocuments: () => void;
  onOpenBooking: () => void;
  onJoinTelehealth: (appointment: Appointment) => void;
  onViewPrescription: (prescription: Prescription) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  appointments,
  documents,
  onRefreshAppointments,
  onRefreshDocuments,
  onOpenBooking,
  onJoinTelehealth,
  onViewPrescription,
}) => {
  const [activeSection, setActiveSection] = useState<'appointments' | 'vault' | 'prescriptions'>('appointments');
  const [appointmentFilter, setAppointmentFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  // Document upload modal state
  const [isUploading, setIsUploading] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<'lab_report' | 'prescription' | 'scan_imaging' | 'insurance'>('lab_report');
  const [docDescription, setDocDescription] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Document preview state
  const [previewDoc, setPreviewDoc] = useState<MedicalDocument | null>(null);

  // Handle appointment cancellation
  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await api.updateAppointmentStatus(id, 'cancelled');
      onRefreshAppointments();
    }
  };

  // Handle document upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docFileName) return;

    setIsSubmittingDoc(true);
    try {
      const res = await api.uploadDocument({
        title: docTitle,
        type: docType,
        fileName: docFileName,
        fileSize: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
        patientId: 'user-patient-1',
        description: docDescription || 'Uploaded securely by patient.',
      });

      if (res.success) {
        setIsUploading(false);
        setDocTitle('');
        setDocFileName('');
        setDocDescription('');
        onRefreshDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  // Handle document deletion
  const handleDeleteDoc = async (id: string) => {
    if (confirm('Delete this document from your secure vault?')) {
      await api.deleteDocument(id);
      onRefreshDocuments();
    }
  };

  // Filter appointments
  const nowStr = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.filter((a) => a.date >= nowStr && a.status !== 'cancelled');
  const pastAppointments = appointments.filter((a) => a.date < nowStr || a.status === 'completed' || a.status === 'cancelled');

  const displayedAppointments =
    appointmentFilter === 'upcoming'
      ? upcomingAppointments
      : appointmentFilter === 'past'
      ? pastAppointments
      : appointments;

  const prescriptions = appointments
    .filter((a) => a.prescription)
    .map((a) => a.prescription as Prescription);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Section Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Health Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access upcoming clinical visits, digital prescriptions, and encrypted medical records.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs">
          <button
            onClick={() => setActiveSection('appointments')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'appointments'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('vault')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'vault'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Vault ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('prescriptions')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'prescriptions'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Prescriptions ({prescriptions.length})</span>
          </button>
        </div>
      </div>

      {/* 1. APPOINTMENTS TAB */}
      {activeSection === 'appointments' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setAppointmentFilter('upcoming')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  appointmentFilter === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setAppointmentFilter('past')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  appointmentFilter === 'past' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                History & Past ({pastAppointments.length})
              </button>
              <button
                onClick={() => setAppointmentFilter('all')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  appointmentFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({appointments.length})
              </button>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Appointment</span>
            </button>
          </div>

          {displayedAppointments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No appointments in this category</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Schedule a consultation with one of our verified specialists in cardiology, neurology, pediatrics, or dermatology.
              </p>
              <button
                onClick={onOpenBooking}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Doctor & Date details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={apt.doctorAvatar}
                      alt={apt.doctorName}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : apt.status === 'completed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-teal-700 mt-0.5">
                        {apt.doctorSpecialty} · {apt.doctorHospital}
                      </div>

                      {/* Typographic date and mode separator */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1 font-mono tabular-nums font-medium text-slate-900">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{apt.date}</span>
                        </div>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <div className="flex items-center gap-1 font-mono text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <div className="flex items-center gap-1 text-slate-600">
                          {apt.type === 'telehealth' ? (
                            <>
                              <Video className="w-3.5 h-3.5 text-teal-600" />
                              <span className="font-medium text-teal-700">Telehealth Video</span>
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Clinic Visit</span>
                            </>
                          )}
                        </div>
                      </div>

                      {apt.symptoms && (
                        <p className="mt-2 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 max-w-xl">
                          <span className="font-medium text-slate-700">Symptoms:</span> {apt.symptoms}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {apt.type === 'telehealth' && apt.status === 'confirmed' && (
                      <button
                        onClick={() => onJoinTelehealth(apt)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Room</span>
                      </button>
                    )}

                    {apt.prescription && (
                      <button
                        onClick={() => onViewPrescription(apt.prescription!)}
                        className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>View Rx</span>
                      </button>
                    )}

                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MEDICAL VAULT TAB */}
      {activeSection === 'vault' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Encrypted Health Document Vault</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload and share medical imaging, blood test results, discharge summaries, and insurance cards.
              </p>
            </div>

            <button
              onClick={() => setIsUploading(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Document Upload Modal Form */}
          {isUploading && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Upload Healthcare Document</h3>
                  <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleFileUpload} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Document Title</label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. Annual Blood Work & Lipid Panel"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Document Category</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                    >
                      <option value="lab_report">Lab Diagnostic Report</option>
                      <option value="prescription">Official Medical Prescription (Rx)</option>
                      <option value="scan_imaging">Scan / X-Ray / MRI Imaging</option>
                      <option value="insurance">Insurance Policy / Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">File Name</label>
                    <input
                      type="text"
                      required
                      value={docFileName}
                      onChange={(e) => setDocFileName(e.target.value)}
                      placeholder="e.g. LabCorp_Panel_2026.pdf"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Summary / Clinical Notes</label>
                    <textarea
                      rows={2}
                      value={docDescription}
                      onChange={(e) => setDocDescription(e.target.value)}
                      placeholder="Optional notes for physician review..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploading(false)}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingDoc}
                      className="px-4 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg disabled:opacity-50"
                    >
                      {isSubmittingDoc ? 'Uploading...' : 'Upload File'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {doc.uploadedAt}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-slate-900 mt-3 truncate">{doc.title}</h4>
                  <div className="text-[11px] text-teal-700 font-medium capitalize mt-0.5">
                    {doc.type.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    {doc.fileName} · {doc.fileSize}
                  </div>

                  {doc.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="text-teal-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Downloading secure copy of ${doc.fileName}`)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-50"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Document Preview Modal */}
          {previewDoc && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-900">{previewDoc.title}</h3>
                  <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Filename:</span>
                    <span className="font-mono text-slate-900">{previewDoc.fileName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Size & Uploaded:</span>
                    <span className="text-slate-800">{previewDoc.fileSize} on {previewDoc.uploadedAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Category:</span>
                    <span className="text-teal-700 font-medium capitalize">{previewDoc.type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Summary:</span>
                    <span className="text-slate-700">{previewDoc.description}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. PRESCRIPTIONS TAB */}
      {activeSection === 'prescriptions' && (
        <div className="mt-6 space-y-4">
          {prescriptions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No prescriptions issued yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                After completed consultations with your physicians, digital prescriptions will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{rx.doctorName}</div>
                        <div className="text-[11px] text-teal-700">{rx.doctorSpecialty}</div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                        {new Date(rx.issuedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-[11px] font-semibold uppercase text-slate-400">Diagnosis</div>
                      <p className="text-xs text-slate-800 font-medium mt-0.5">{rx.diagnosis}</p>
                    </div>

                    <div className="mt-3">
                      <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1.5">Prescribed Medications</div>
                      <div className="space-y-1.5">
                        {rx.medications.map((m, idx) => (
                          <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                            <div className="font-semibold text-slate-900">{m.name} ({m.dosage})</div>
                            <div className="text-slate-600 text-[11px]">{m.frequency} · {m.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {rx.advice && (
                      <div className="mt-3 text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Clinical Advice:</span> {rx.advice}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Rx ID: {rx.id}</span>
                    <button
                      onClick={() => onViewPrescription(rx)}
                      className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      Printable View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
