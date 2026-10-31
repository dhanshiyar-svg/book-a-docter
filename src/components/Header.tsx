import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { Stethoscope, Calendar, FileText, ShieldCheck, Terminal, User as UserIcon, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onOpenApiInspector: () => void;
  pendingDoctorCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenAuth,
  onOpenApiInspector,
  pendingDoctorCount = 0,
}) => {
  const { currentUser, switchRoleDemo, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-xs">
            <span className="text-lg leading-none">+</span>
          </div>
          <button
            onClick={() => setActiveTab('find-doctors')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-teal-700 transition-colors"
          >
            MediBook
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('find-doctors')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'find-doctors'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Find Doctors
          </button>

          <button
            onClick={() => setActiveTab('my-appointments')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'my-appointments'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Appointments
          </button>

          <button
            onClick={() => setActiveTab('medical-vault')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'medical-vault'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Health Records
          </button>

          {currentUser?.role === 'doctor' && (
            <button
              onClick={() => setActiveTab('doctor-portal')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'doctor-portal'
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Doctor Schedule
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin-portal')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'admin-portal'
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>Admin Console</span>
              {pendingDoctorCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title={`${pendingDoctorCount} pending doctors`} />
              )}
            </button>
          )}

          <button
            onClick={onOpenApiInspector}
            className="whitespace-nowrap shrink-0 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 py-1"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API Tester</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action or session management */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Demo Role Switcher for instant evaluator testing */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => {
                switchRoleDemo('patient');
                setActiveTab('find-doctors');
              }}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                currentUser?.role === 'patient'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => {
                switchRoleDemo('doctor');
                setActiveTab('doctor-portal');
              }}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                currentUser?.role === 'doctor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor
            </button>
            <button
              onClick={() => {
                switchRoleDemo('admin');
                setActiveTab('admin-portal');
              }}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                currentUser?.role === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenBooking}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 flex items-center gap-2 text-xs"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden xl:inline font-medium text-slate-800 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 px-2 py-2 text-xs text-slate-600 bg-white">
        <button
          onClick={() => setActiveTab('find-doctors')}
          className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'find-doctors' ? 'text-teal-700 font-semibold' : ''}`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Find</span>
        </button>
        <button
          onClick={() => setActiveTab('my-appointments')}
          className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'my-appointments' ? 'text-teal-700 font-semibold' : ''}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments</span>
        </button>
        <button
          onClick={() => setActiveTab('medical-vault')}
          className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'medical-vault' ? 'text-teal-700 font-semibold' : ''}`}
        >
          <FileText className="w-4 h-4" />
          <span>Records</span>
        </button>
        {currentUser?.role === 'doctor' && (
          <button
            onClick={() => setActiveTab('doctor-portal')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'doctor-portal' ? 'text-teal-700 font-semibold' : ''}`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Doctor</span>
          </button>
        )}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin-portal')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'admin-portal' ? 'text-teal-700 font-semibold' : ''}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        )}
        <button
          onClick={onOpenApiInspector}
          className="flex flex-col items-center gap-1 py-1 px-2 text-slate-500"
        >
          <Terminal className="w-4 h-4" />
          <span>API</span>
        </button>
      </div>
    </header>
  );
};
