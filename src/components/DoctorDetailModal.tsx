import React, { useEffect, useState } from 'react';
import { Doctor, Review } from '../types/index.ts';
import { api } from '../services/api.ts';
import { X, Star, MapPin, Building, Award, Calendar, Clock, Globe, Shield, MessageSquare, Plus } from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBook,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  useEffect(() => {
    if (doctor) {
      setIsLoadingReviews(true);
      api.getReviews(doctor.id)
        .then((res) => {
          if (res.success) {
            setReviews(res.reviews);
          }
        })
        .finally(() => setIsLoadingReviews(false));
    }
  }, [doctor]);

  if (!doctor) return null;

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await api.addReview(doctor.id, {
        rating: newRating,
        comment: newComment,
        patientName: 'Dhana S.',
        patientId: 'user-patient-1',
      });
      if (res.success) {
        setReviews([res.review, ...reviews]);
        setNewComment('');
        doctor.rating = res.doctorRating;
        doctor.reviewCount += 1;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-xl border border-slate-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Physician Profile & Credentials
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Doctor Hero Card */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified License
                </span>
              </div>
              <div className="text-sm font-semibold text-teal-700 mt-0.5">{doctor.specialty}</div>
              
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="ml-1 font-semibold text-slate-900 font-mono tabular-nums">{doctor.rating}</span>
                </div>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{doctor.reviewCount} patient reviews</span>
                <span aria-hidden="true">·</span>
                <span>{doctor.experienceYears} years practice</span>
              </div>

              <div className="mt-3 text-xs text-slate-600 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-mono text-slate-700">License #{doctor.medicalLicenseNumber}</span>
              </div>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Schedule
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Patient Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-5 text-sm text-slate-700">
              {/* About Doctor */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  About Dr. {doctor.name.split(' ')[1] || doctor.name}
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm">{doctor.about}</p>
              </div>

              {/* Clinical Affiliations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Medical Education</div>
                  <div className="text-xs font-semibold text-slate-900 flex items-start gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{doctor.qualification}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Hospital Affiliation</div>
                  <div className="text-xs font-semibold text-slate-900 flex items-start gap-1.5">
                    <Building className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{doctor.hospitalAffiliation}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Primary Clinic Address</div>
                  <div className="text-xs text-slate-700 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{doctor.clinicAddress}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Languages Spoken</div>
                  <div className="text-xs text-slate-700 flex items-start gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Consultation Timetable */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Weekly Consultation Days
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isAvailable = doctor.availableDays.includes(day);
                    return (
                      <span
                        key={day}
                        className={`px-3 py-1 text-xs font-medium rounded-lg border ${
                          isAvailable
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200/50'
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Available Time Slots */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Standard Daily Slots
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {doctor.availableSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        slot.available
                          ? 'border-slate-200 bg-white text-slate-800'
                          : 'border-slate-100 bg-slate-50 text-slate-400 line-through'
                      }`}
                    >
                      <span className="font-mono">{slot.time}</span>
                      <span className="capitalize text-[10px] text-slate-400 font-medium">
                        {slot.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Write a review form */}
              <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Leave a Patient Review
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-slate-600">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details of your consultation, doctor's bedside manner, diagnostic clarity..."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !newComment.trim()}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-slate-100 pb-4 last:border-none">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-slate-900">{rev.patientName}</div>
                      <div className="text-[11px] text-slate-400">{rev.date}</div>
                    </div>
                    <div className="flex items-center gap-1 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-200'
                          }`}
                        />
                      ))}
                      {rev.verifiedVisit && (
                        <span className="ml-2 text-[10px] text-teal-700 font-medium">Verified Patient Visit</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Consultation Fee</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              ${doctor.consultationFee}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(doctor);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
