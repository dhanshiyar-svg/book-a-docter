import React, { useState, useEffect } from 'react';
import { Doctor, PlatformStats, Appointment } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  ShieldCheck,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileBadge,
  Award,
  Building,
  Activity,
} from 'lucide-react';

interface AdminDashboardProps {
  stats: PlatformStats | null;
  pendingDoctors: Doctor[];
  appointments: Appointment[];
  onRefreshAll: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  pendingDoctors,
  appointments,
  onRefreshAll,
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await api.approveDoctor(id);
      onRefreshAll();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Are you sure you want to reject this doctor application?')) {
      setProcessingId(id);
      try {
        await api.rejectDoctor(id);
        onRefreshAll();
      } catch (err) {
        console.error(err);
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Executive Platform Governance
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          Admin Credential Verification & Operations Console
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review medical board credentials, approve practicing doctors, and audit healthcare consultations.
        </p>
      </div>

      {/* KPI Metric Cards - Tabular figures & clean surface math */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Pending Approvals</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
            {stats?.pendingApprovals ?? pendingDoctors.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting credential review</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Verified Physicians</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {stats?.totalDoctors ?? 5}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active licensed specialists</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {appointments.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Clinic & Telehealth visits</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Platform Satisfaction</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            {stats?.overallSatisfaction ?? 98.4}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified patient ratings</div>
        </div>
      </div>

      {/* 1. Pending Doctor Verification Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Physician Credential Verification Queue</span>
            {pendingDoctors.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                {pendingDoctors.length} Action Needed
              </span>
            )}
          </h2>
        </div>

        {pendingDoctors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-800 text-sm">All Physician Credentials Verified</div>
            <p className="mt-1">No doctor licenses are currently pending administrator review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-lg text-slate-700 shrink-0">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                      <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        License: {doc.medicalLicenseNumber}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-teal-700 mt-0.5">
                      {doc.specialty} · {doc.experienceYears} Years Clinical Experience
                    </div>

                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doc.qualification}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doc.hospitalAffiliation} · {doc.clinicAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleReject(doc.id)}
                    disabled={processingId === doc.id}
                    className="px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(doc.id)}
                    disabled={processingId === doc.id}
                    className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{processingId === doc.id ? 'Approving...' : 'Verify & Approve License'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Platform Consultation Ledger */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Platform Appointments Ledger</h2>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Physician</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{apt.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{apt.patientEmail}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{apt.doctorName}</div>
                      <div className="text-[10px] text-teal-700">{apt.doctorSpecialty}</div>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {apt.date} · {apt.timeSlot}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {apt.type === 'telehealth' ? 'Telehealth Video' : 'Clinic Visit'}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-900 tabular-nums">
                      ${apt.fee}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : apt.status === 'completed'
                            ? 'bg-blue-50 text-blue-700'
                            : apt.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
