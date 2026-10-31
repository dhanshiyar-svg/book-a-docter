import React from 'react';
import { Doctor } from '../types/index.ts';
import { Star, MapPin, Building, Video, Clock, Award, Calendar } from 'lucide-react';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  isLoading: boolean;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onResetFilters: () => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  doctors,
  isLoading,
  onSelectDoctor,
  onBookDoctor,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Building className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No doctors match your criteria</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
          Try expanding your search query, adjusting consultation fee limits, or selecting a different specialty.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Scannable count header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900 font-mono tabular-nums">{doctors.length}</span> verified practitioners
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>Real-time availability updated</span>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => {
          return (
            <div
              key={doctor.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Doctor Header: Portrait & Identity */}
                <div className="flex gap-4 items-start">
                  <div className="relative shrink-0">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-xl object-cover bg-slate-100 border border-slate-200"
                      onError={(e) => {
                        // Resilient fallback container if external link fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {doctor.name}
                    </h3>
                    <div className="text-xs font-medium text-teal-700 mt-0.5">
                      {doctor.specialty}
                    </div>

                    {/* Unboxed metadata with typographic separators */}
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="ml-1 font-semibold text-slate-800 font-mono tabular-nums">
                          {doctor.rating}
                        </span>
                      </div>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">({doctor.reviewCount} reviews)</span>
                      <span aria-hidden="true">·</span>
                      <span>{doctor.experienceYears}y exp</span>
                    </div>
                  </div>
                </div>

                {/* Qualification & Affiliation */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.hospitalAffiliation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.clinicAddress}</span>
                  </div>
                </div>

                {/* Consultation Modes & Next Availability */}
                <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500">
                    {doctor.consultationModes.includes('in_person') && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>In-Clinic</span>
                      </span>
                    )}
                    {doctor.consultationModes.includes('telehealth') && (
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3 text-teal-600" />
                        <span className="text-teal-700 font-medium">Video</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="font-medium text-slate-800">{doctor.nextAvailableDate}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer with Fee & Book CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Consultation</div>
                  <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                    ${doctor.consultationFee}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDoctor(doctor)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onBookDoctor(doctor)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
