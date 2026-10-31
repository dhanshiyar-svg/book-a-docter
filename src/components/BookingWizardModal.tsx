import React, { useState } from 'react';
import { Doctor, Appointment, MedicalDocument } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { X, Calendar, Clock, Video, Building2, FileText, CheckCircle2, AlertCircle, ChevronRight, ShieldCheck } from 'lucide-react';

interface BookingWizardModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
  availableDocuments?: MedicalDocument[];
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  doctor,
  onClose,
  onSuccess,
  availableDocuments = [],
}) => {
  const { currentUser } = useAuth();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    doctor?.availableSlots?.find((s) => s.available)?.time || '09:00 AM'
  );
  const [consultationType, setConsultationType] = useState<'in_person' | 'telehealth'>('in_person');
  const [symptoms, setSymptoms] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  if (!doctor) return null;

  // Generate next 6 days
  const upcomingDays = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.bookAppointment({
        doctorId: doctor.id,
        patientId: currentUser?.id || 'user-patient-1',
        patientName: currentUser?.name || 'Dhana S.',
        patientEmail: currentUser?.email || 'dhanshiyar@gmail.com',
        patientPhone: currentUser?.phone || '+1 (555) 234-5678',
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        type: consultationType,
        symptoms: symptoms || 'General medical consultation and routine review.',
        notes: patientNotes,
        attachedDocumentIds: selectedDocIds,
      });

      if (res.success) {
        setBookedAppointment(res.appointment);
        onSuccess(res.appointment);
      }
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDocumentAttachment = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Healthcare Appointment Booking
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {doctor.name} · {doctor.specialty}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard progress tracker */}
        {!bookedAppointment && (
          <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
            <span className={step >= 1 ? 'text-teal-700 font-semibold' : ''}>1. Date & Time</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step >= 2 ? 'text-teal-700 font-semibold' : ''}>2. Symptoms & Files</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step >= 3 ? 'text-teal-700 font-semibold' : ''}>3. Confirmation</span>
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {bookedAppointment ? (
            /* Booking Confirmed State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your appointment with <span className="font-semibold text-slate-900">{doctor.name}</span> has been scheduled and confirmed.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{bookedAppointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-semibold text-slate-900">{bookedAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-semibold text-slate-900">{bookedAppointment.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consultation Mode:</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {bookedAppointment.type === 'telehealth' ? 'HD Telehealth Video' : 'In-Person Clinic Visit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location / Provider:</span>
                  <span className="text-slate-900 text-right">{doctor.hospitalAffiliation}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-medium text-slate-700">Amount Paid:</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums">${bookedAppointment.fee}.00</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                >
                  View in My Appointments
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* STEP 1: DATE & TIME */
            <div className="space-y-5">
              {/* Consultation Mode */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Select Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType('in_person')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      consultationType === 'in_person'
                        ? 'border-teal-600 bg-teal-50/40 text-slate-900 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 shrink-0 ${consultationType === 'in_person' ? 'text-teal-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Clinic Visit</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        In-person physical exam at {doctor.hospitalAffiliation}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('telehealth')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      consultationType === 'telehealth'
                        ? 'border-teal-600 bg-teal-50/40 text-slate-900 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Video className={`w-5 h-5 shrink-0 ${consultationType === 'telehealth' ? 'text-teal-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Telehealth Video</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Secure HD video conference with doctor
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Select Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Select Appointment Date
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {upcomingDays.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDate === d.iso
                          ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-[11px] uppercase font-medium">{d.dayName}</div>
                      <div className="text-lg font-bold font-mono tabular-nums leading-tight">{d.dateNum}</div>
                      <div className="text-[10px] opacity-80">{d.month}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Time Slot */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Available Time Slots ({selectedDate})
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {doctor.availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                        !slot.available
                          ? 'border-slate-100 bg-slate-50 text-slate-300 line-through cursor-not-allowed'
                          : selectedTimeSlot === slot.time
                          ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-mono">{slot.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            /* STEP 2: SYMPTOMS & MEDICAL RECORDS */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Reason for Visit / Primary Symptoms
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your health symptoms, duration, current discomfort, or reason for scheduling..."
                  rows={3}
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Additional Notes for Doctor (Optional)
                </label>
                <input
                  type="text"
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="e.g. Current allergies, recent prescriptions, or medication reactions..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
              </div>

              {/* Attach Existing Medical Documents */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Attach Medical Reports from Vault
                  </label>
                  <span className="text-[11px] text-slate-400">Optional</span>
                </div>

                {availableDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {availableDocuments.map((doc) => {
                      const isSelected = selectedDocIds.includes(doc.id);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => toggleDocumentAttachment(doc.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'border-teal-600 bg-teal-50/50 text-slate-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                            <div className="truncate">
                              <div className="font-medium text-slate-900 truncate">{doc.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{doc.fileName} · {doc.fileSize}</div>
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="text-[10px] leading-none">✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                    No documents currently in your vault. You can upload reports in the Health Records tab anytime.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STEP 3: SUMMARY & CONFIRMATION */
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="font-semibold text-slate-900 text-sm border-b border-slate-200/80 pb-2">
                  Review Appointment Details
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Specialist:</span>
                    <span className="font-medium text-slate-900">{doctor.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Specialty:</span>
                    <span className="font-medium text-slate-900">{doctor.specialty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date & Time:</span>
                    <span className="font-medium text-slate-900">{selectedDate} at {selectedTimeSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Type:</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {consultationType === 'telehealth' ? 'HD Telehealth Video' : 'In-Clinic Visit'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <span className="text-slate-400 block text-[11px]">Reported Symptoms:</span>
                  <span className="text-slate-800">{symptoms || 'General wellness and routine check.'}</span>
                </div>

                {selectedDocIds.length > 0 && (
                  <div className="pt-1 text-slate-600">
                    <span className="text-slate-400 block text-[11px]">Attached Documents:</span>
                    <span className="text-teal-700 font-medium">{selectedDocIds.length} medical file(s) attached</span>
                  </div>
                )}
              </div>

              {/* Consultation Fee Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Specialist Consultation Fee</span>
                  <span className="font-mono tabular-nums text-slate-900 font-medium">${doctor.consultationFee}.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Booking & Platform Handling</span>
                  <span className="text-emerald-600 font-medium">$0.00 (Waived)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="font-mono tabular-nums text-teal-700">${doctor.consultationFee}.00</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Protected by HIPAA and end-to-end medical encryption.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!bookedAppointment && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="px-6 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming Booking...' : `Confirm & Schedule ($${doctor.consultationFee})`}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
