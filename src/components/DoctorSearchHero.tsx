import React from 'react';
import { Search, MapPin, Video, Building2, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { Specialty } from '../types/index.ts';

interface DoctorSearchHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  maxFee: number;
  setMaxFee: (fee: number) => void;
  onSearchSubmit?: () => void;
}

const SPECIALTIES: { name: string; description: string }[] = [
  { name: 'All', description: 'All Specialties' },
  { name: 'Cardiology', description: 'Heart & Vascular' },
  { name: 'Neurology', description: 'Brain & Nerves' },
  { name: 'Pediatrics', description: 'Child Healthcare' },
  { name: 'Dermatology', description: 'Skin & Aesthetics' },
  { name: 'Orthopedics', description: 'Joints & Bones' },
  { name: 'General Medicine', description: 'Primary & Family' },
];

export const DoctorSearchHero: React.FC<DoctorSearchHeroProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedMode,
  setSelectedMode,
  maxFee,
  setMaxFee,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial headline with no orphans and clean typography */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            Verified Healthcare Booking Platform
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Schedule Appointments with Board-Certified Specialists
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Browse top-rated physicians, verify medical credentials, book in-person or telehealth consultations, and access digital prescriptions securely.
          </p>

          {/* Claim-to-proof strip with quiet typography */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>100% Verified Medical Licenses</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>HIPAA-Compliant Document Vault</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Instant Digital Prescriptions (Rx)</span>
            </div>
          </div>
        </div>

        {/* Multi-parameter Search Hub */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            
            {/* Search Input: Doctor name or clinic */}
            <div className="md:col-span-5 relative">
              <label htmlFor="doctor-search" className="block text-xs font-medium text-slate-700 mb-1">
                Doctor Name, Condition, or Hospital
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="doctor-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Dr. Vance, Cardiology, or Boston..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                />
              </div>
            </div>

            {/* Mode Selector (In-Person vs Telehealth) */}
            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Consultation Type
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedMode('all')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedMode === 'all'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Types
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('in_person')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
                    selectedMode === 'in_person'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>Clinic</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('telehealth')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
                    selectedMode === 'telehealth'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* Max Fee Slider */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Max Fee:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">${maxFee}</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Specialty Filter Bar: Functional filter tabs */}
          <div className="mt-4 pt-4 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Filter by Medical Specialty:</span>
              {(selectedSpecialty !== 'All' || searchTerm || selectedMode !== 'all' || maxFee < 200) && (
                <button
                  onClick={() => {
                    setSelectedSpecialty('All');
                    setSearchTerm('');
                    setSelectedMode('all');
                    setMaxFee(200);
                  }}
                  className="text-xs text-teal-700 hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SPECIALTIES.map((spec) => (
                <button
                  key={spec.name}
                  onClick={() => setSelectedSpecialty(spec.name)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                    selectedSpecialty === spec.name
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {spec.name}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
