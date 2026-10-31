import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { Terminal, Play, CheckCircle2, Copy, RefreshCw, X } from 'lucide-react';

interface ApiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'automated' | 'manual'>('automated');
  const [testResults, setTestResults] = useState<any | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET /api/doctors');
  const [manualResponse, setManualResponse] = useState<any | null>(null);
  const [manualLoading, setManualLoading] = useState(false);

  if (!isOpen) return null;

  const handleRunAllTests = async () => {
    setIsRunning(true);
    try {
      const data = await api.runCrudTests();
      setTestResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleExecuteManual = async () => {
    setManualLoading(true);
    try {
      let resData;
      if (selectedEndpoint === 'GET /api/doctors') {
        resData = await api.getDoctors();
      } else if (selectedEndpoint === 'GET /api/admin/stats') {
        resData = await api.getAdminStats();
      } else if (selectedEndpoint === 'GET /api/appointments') {
        resData = await api.getAppointments();
      } else if (selectedEndpoint === 'GET /api/documents') {
        resData = await api.getDocuments();
      } else if (selectedEndpoint === 'POST /api/auth/login') {
        resData = await api.login('dhanshiyar@gmail.com', 'patient');
      }
      setManualResponse(resData);
    } catch (err: any) {
      setManualResponse({ error: err.message });
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">API Testing & CRUD Validation Console</h3>
              <p className="text-[11px] text-slate-500">
                Verify MERN endpoints, JWT authentication, and booking consistency.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 py-2 border-b border-slate-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('automated')}
            className={`pb-2 transition-colors border-b-2 ${
              activeTab === 'automated' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500'
            }`}
          >
            Automated CRUD Test Suite
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-2 transition-colors border-b-2 ${
              activeTab === 'manual' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500'
            }`}
          >
            Interactive Endpoint Runner
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {activeTab === 'automated' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">MERN Stack Test Suite</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Runs comprehensive assertions across Auth, Doctors, Appointments, Documents, and Admin modules.
                  </div>
                </div>
                <button
                  onClick={handleRunAllTests}
                  disabled={isRunning}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Executing Tests...' : 'Run All Tests'}</span>
                </button>
              </div>

              {testResults ? (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{testResults.summary}</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-600">
                      {new Date(testResults.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {testResults.results?.map((t: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <span>{t.module}</span>
                            <span className="font-mono text-[11px] text-slate-500 font-normal">{t.endpoint}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">{t.notes}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-400 text-[11px]">{t.latencyMs}ms</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                            {t.statusCode} {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Database state */}
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                    <div className="text-slate-400 mb-2 font-sans font-semibold text-[11px]">Database Document State:</div>
                    <pre>{JSON.stringify(testResults.databaseState, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Click "Run All Tests" to execute full validation suite against active server endpoints.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                >
                  <option value="GET /api/doctors">GET /api/doctors (List Verified Doctors)</option>
                  <option value="GET /api/appointments">GET /api/appointments (Appointments Ledger)</option>
                  <option value="GET /api/documents">GET /api/documents (Medical Document Vault)</option>
                  <option value="GET /api/admin/stats">GET /api/admin/stats (Platform Analytics)</option>
                  <option value="POST /api/auth/login">POST /api/auth/login (JWT Session Token)</option>
                </select>

                <button
                  onClick={handleExecuteManual}
                  disabled={manualLoading}
                  className="px-4 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg text-xs shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {manualLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Send Request</span>
                </button>
              </div>

              {manualResponse && (
                <div className="bg-slate-900 text-teal-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-80">
                  <pre>{JSON.stringify(manualResponse, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
