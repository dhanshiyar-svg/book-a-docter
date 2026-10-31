import React, { useState } from 'react';
import { Appointment, Doctor, Medication } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Pill,
  Plus,
  Trash2,
  User,
  Settings,
  DollarSign,
} from 'lucide-react';

interface DoctorDashboardProps {
  doctor: Doctor | null;
  appointments: Appointment[];
  onRefreshAppointments: () => void;
  onRefreshDoctor: () => void;
  onJoinTelehealth: (appointment: Appointment) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctor,
  appointments,
  onRefreshAppointments,
  onRefreshDoctor,
  onJoinTelehealth,
}) => {
  // Prescription modal state
  const [selectedAptForRx, setSelectedAptForRx] = useState<Appointment | null>(null);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxAdvice, setRxAdvice] = useState('');
  const [rxFollowUpDate, setRxFollowUpDate] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '', notes: '' },
  ]);
  const [isSubmittingRx, setIsSubmittingRx] = useState(false);

  // Settings state (Fee and status)
  const [consultationFee, setConsultationFee] = useState(doctor?.consultationFee || 120);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Handle status changes
  const handleUpdateStatus = async (
    id: string,
    status: 'confirmed' | 'completed' | 'cancelled'
  ) => {
    await api.updateAppointmentStatus(id, status);
    onRefreshAppointments();
  };

  // Add medication row
  const addMedicationRow = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const removeMedicationRow = (idx: number) => {
    setMedications(medications.filter((_, i) => i !== idx));
  };

  const updateMedication = (idx: number, field: keyof Medication, val: string) => {
    const next = [...medications];
    next[idx] = { ...next[idx], [field]: val };
    setMedications(next);
  };

  // Handle Prescription Submit
  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAptForRx || !rxDiagnosis) return;

    setIsSubmittingRx(true);
    try {
      const validMeds = medications.filter((m) => m.name.trim());
      await api.issuePrescription(selectedAptForRx.id, {
        diagnosis: rxDiagnosis,
        medications: validMeds,
        advice: rxAdvice,
        followUpDate: rxFollowUpDate,
      });

      setSelectedAptForRx(null);
      setRxDiagnosis('');
      setRxAdvice('');
      setRxFollowUpDate('');
      setMedications([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
      onRefreshAppointments();
    } catch (err) {
      console.error('Failed to issue prescription', err);
    } finally {
      setIsSubmittingRx(false);
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async () => {
    if (!doctor) return;
    setIsSavingSettings(true);
    try {
      await api.updateDoctor(doctor.id, {
        consultationFee,
      });
      onRefreshDoctor();
      alert('Consultation settings updated.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const doctorAppointments = doctor
    ? appointments.filter((a) => a.doctorId === doctor.id)
    : appointments;

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingApts = doctorAppointments.filter((a) => a.status === 'pending');
  const confirmedApts = doctorAppointments.filter((a) => a.status === 'confirmed');
  const completedApts = doctorAppointments.filter((a) => a.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Doctor Clinical Workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {doctor ? doctor.name : 'Practitioner Portal'} · {doctor?.specialty}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your daily patient queue, conduct telehealth calls, and issue official prescriptions.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-xs">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Pending Review</div>
            <div className="text-lg font-bold text-amber-600 font-mono tabular-nums">{pendingApts.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-xs">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Scheduled</div>
            <div className="text-lg font-bold text-teal-700 font-mono tabular-nums">{confirmedApts.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-xs">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Completed</div>
            <div className="text-lg font-bold text-slate-800 font-mono tabular-nums">{completedApts.length}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue & Quick Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointments Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Patient Consultation Schedule</span>
            <span className="text-xs font-mono text-slate-500 font-normal">
              {doctorAppointments.length} Total Records
            </span>
          </h2>

          {doctorAppointments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
              No appointments scheduled for this doctor yet.
            </div>
          ) : (
            <div className="space-y-3">
              {doctorAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{apt.patientName}</h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : apt.status === 'completed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : apt.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {apt.patientEmail} · {apt.patientPhone}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="font-mono font-bold text-slate-900">{apt.date}</div>
                      <div className="font-mono text-slate-500">{apt.timeSlot}</div>
                    </div>
                  </div>

                  {/* Symptoms & Medical Reason */}
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800">Reported Symptoms:</span> {apt.symptoms}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 capitalize">
                        Mode: <span className="font-medium text-slate-800">{apt.type.replace('_', ' ')}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500">
                        Fee: <span className="font-mono font-medium text-slate-800">${apt.fee}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.type === 'telehealth' && apt.status === 'confirmed' && (
                        <button
                          onClick={() => onJoinTelehealth(apt)}
                          className="px-3 py-1.5 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Video</span>
                        </button>
                      )}

                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          className="px-3 py-1.5 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                        >
                          Confirm
                        </button>
                      )}

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            setSelectedAptForRx(apt);
                            setRxDiagnosis(apt.symptoms || '');
                          }}
                          className="px-3 py-1.5 font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1"
                        >
                          <Pill className="w-3.5 h-3.5" />
                          <span>Issue Rx</span>
                        </button>
                      )}

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'completed')}
                          className="px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Practice Settings Panel (1 col) */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-teal-600" />
            <span>Practice Settings</span>
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Consultation Fee ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                License Verification Status
              </label>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                {doctor?.medicalLicenseNumber || 'LIC-VERIFIED-ACTIVE'}
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="w-full py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {isSavingSettings ? 'Saving...' : 'Update Settings'}
            </button>
          </div>
        </div>

      </div>

      {/* Prescription Builder Modal */}
      {selectedAptForRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Issue Digital Prescription (Rx)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: <span className="font-semibold text-slate-900">{selectedAptForRx.patientName}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAptForRx(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  required
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  placeholder="e.g. Tension cefalea with muscle contraction, normal neuro reflexes."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
              </div>

              {/* Medication rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-700 font-semibold">Prescribed Medications</label>
                  <button
                    type="button"
                    onClick={addMedicationRow}
                    className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {medications.map((med, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Medicine name (e.g. Sumatriptan)"
                          value={med.name}
                          onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                          className="p-2 bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 50mg)"
                          value={med.dosage}
                          onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                          className="p-2 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Frequency (e.g. At onset of headache)"
                          value={med.frequency}
                          onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                          className="p-2 bg-white border border-slate-200 rounded-lg"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Duration (e.g. 14 days)"
                            value={med.duration}
                            onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                            className="p-2 bg-white border border-slate-200 rounded-lg flex-1"
                          />
                          {medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedicationRow(idx)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Clinical Advice / Lifestyle</label>
                <textarea
                  rows={2}
                  value={rxAdvice}
                  onChange={(e) => setRxAdvice(e.target.value)}
                  placeholder="e.g. Avoid dehydration, sleep 8 hours, maintain screen breaks."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recommended Follow-up Date</label>
                <input
                  type="date"
                  value={rxFollowUpDate}
                  onChange={(e) => setRxFollowUpDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAptForRx(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRx || !rxDiagnosis}
                  className="px-5 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs disabled:opacity-50"
                >
                  {isSubmittingRx ? 'Signing Rx...' : 'Sign & Complete Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
