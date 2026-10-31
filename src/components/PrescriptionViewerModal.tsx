import React from 'react';
import { Prescription } from '../types/index.ts';
import { X, Printer, ShieldCheck, Pill } from 'lucide-react';

interface PrescriptionViewerModalProps {
  prescription: Prescription | null;
  onClose: () => void;
}

export const PrescriptionViewerModal: React.FC<PrescriptionViewerModalProps> = ({
  prescription,
  onClose,
}) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Official Medical Prescription (Rx)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="overflow-y-auto flex-1 p-8 space-y-6 print:p-0">
          
          {/* Clinic Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">
                {prescription.doctorName}
              </div>
              <div className="text-xs font-semibold text-teal-800">
                {prescription.doctorSpecialty} · Board Certified Specialist
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Metropolitan Healthcare Network · Clinical Licensure Verified
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono font-bold text-slate-800">Rx ID: {prescription.id}</div>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                Date: {new Date(prescription.issuedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Patient Info Strip */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex justify-between text-xs">
            <div>
              <span className="text-slate-500">Patient Name: </span>
              <span className="font-bold text-slate-900">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-slate-500">Consultation: </span>
              <span className="font-mono text-slate-800">{prescription.appointmentId}</span>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Clinical Diagnosis
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 leading-relaxed">
              {prescription.diagnosis}
            </div>
          </div>

          {/* Rx Medications */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <span className="text-lg font-serif italic text-teal-800 font-bold leading-none">℞</span>
              <span>Prescribed Regimen</span>
            </div>

            <div className="space-y-2">
              {prescription.medications.map((med, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                    <span className="font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="text-slate-600 flex gap-4">
                    <span>Frequency: <strong className="text-slate-800">{med.frequency}</strong></span>
                    <span>Duration: <strong className="text-slate-800">{med.duration}</strong></span>
                  </div>
                  {med.notes && (
                    <div className="text-[11px] text-slate-500 italic mt-1">{med.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Instructions */}
          {prescription.advice && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Physician Advice & Lifestyle Recommendations
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {prescription.advice}
              </p>
            </div>
          )}

          {/* Follow-up Date */}
          {prescription.followUpDate && (
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Scheduled Follow-up: </span>
              <span className="font-mono font-bold text-teal-700">{prescription.followUpDate}</span>
            </div>
          )}

          {/* Doctor Signature Block */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Digitally cryptographically signed</span>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-slate-800 font-bold">
                {prescription.doctorName}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Authorized Physician Signature
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
