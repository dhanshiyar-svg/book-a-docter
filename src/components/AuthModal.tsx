import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { X, Lock, Mail, User, Shield, Stethoscope, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, login, register, logout, switchRoleDemo } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [qualification, setQualification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const ok = await login(email, role);
        if (ok) onClose();
        else setErrorMessage('Invalid login credentials.');
      } else {
        const ok = await register({
          name,
          email,
          role,
          phone,
          specialty: role === 'doctor' ? specialty : undefined,
          licenseNumber: role === 'doctor' ? licenseNumber : undefined,
          qualification: role === 'doctor' ? qualification : undefined,
        });
        if (ok) onClose();
        else setErrorMessage('Could not register account. Email might be in use.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {currentUser ? 'Healthcare Account Session' : mode === 'signin' ? 'Sign In to MediBook' : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-based access for patients, doctors, and hospital administrators.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Currently Signed In View */
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Role:</span>
                <span className="font-semibold text-teal-700 capitalize">{currentUser.role}</span>
              </div>
            </div>

            {/* Quick Demo Switcher */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Quick Role Switching (Demo)
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => switchRoleDemo('patient')}
                  className={`p-2.5 rounded-xl border font-medium transition-colors ${
                    currentUser.role === 'patient'
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => switchRoleDemo('doctor')}
                  className={`p-2.5 rounded-xl border font-medium transition-colors ${
                    currentUser.role === 'doctor'
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => switchRoleDemo('admin')}
                  className={`p-2.5 rounded-xl border font-medium transition-colors ${
                    currentUser.role === 'admin'
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Register Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Mode switch */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
                  mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Register
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Role selection for registration */}
            {mode === 'register' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`p-2 rounded-lg border text-center transition-colors ${
                      role === 'patient'
                        ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`p-2 rounded-lg border text-center transition-colors ${
                      role === 'doctor'
                        ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Healthcare Provider
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'doctor' ? 'Dr. John Doe, MD' : 'John Doe'}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
              />
            </div>

            {mode === 'register' && role === 'doctor' && (
              <>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Medical Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Medical License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. NY-MED-849201"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30 font-mono"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In with JWT'
                : 'Create Account & Continue'}
            </button>

            {/* Quick Demo Logins for effortless testing */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">Or test instantly as:</span>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    switchRoleDemo('patient');
                    onClose();
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                >
                  Demo Patient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchRoleDemo('doctor');
                    onClose();
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                >
                  Demo Doctor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchRoleDemo('admin');
                    onClose();
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
