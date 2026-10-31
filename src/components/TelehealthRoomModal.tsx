import React, { useState } from 'react';
import { Appointment } from '../types/index.ts';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Shield,
  FileText,
  User,
  Send,
} from 'lucide-react';

interface TelehealthRoomModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const TelehealthRoomModal: React.FC<TelehealthRoomModalProps> = ({
  appointment,
  onClose,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: 'Dr. Mercer',
      text: 'Good day! I have reviewed your medical history. How is the temple headache today?',
      time: '1:30 PM',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!appointment) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages([
      ...messages,
      {
        sender: 'You',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-white">
      
      {/* Top Telehealth Status Bar */}
      <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold tracking-tight">
              Telehealth Consultation: {appointment.doctorName}
            </h2>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <Shield className="w-3 h-3 text-teal-400" />
              <span>HIPAA Encrypted Video Feed (P2P 1080p)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            chatOpen ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>In-Call Chat ({messages.length})</span>
        </button>
      </div>

      {/* Main Video Stage */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Canvas */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4">
          
          {/* Main Remote Feed: Doctor */}
          <div className="relative w-full h-full max-w-4xl max-h-[70vh] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl flex items-center justify-center">
            <img
              src={appointment.doctorAvatar}
              alt={appointment.doctorName}
              className="w-full h-full object-cover"
            />
            
            {/* Scrim overlay with doctor identity */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white">{appointment.doctorName}</div>
                <div className="text-xs text-teal-300">{appointment.doctorSpecialty}</div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md text-[11px] text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Audio Active</span>
              </div>
            </div>
          </div>

          {/* Self View (Picture-in-Picture) */}
          <div className="absolute bottom-6 right-6 w-48 h-32 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-xl flex items-center justify-center">
            {isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center text-slate-400">
                <User className="w-8 h-8 text-teal-400 mb-1" />
                <span className="text-[10px] text-slate-300">You ({appointment.patientName})</span>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs">Camera Off</div>
            )}
            <div className="absolute bottom-2 left-2 text-[10px] bg-slate-900/70 px-1.5 py-0.5 rounded text-slate-300">
              HD Self View
            </div>
          </div>
        </div>

        {/* In-Call Chat Sidebar */}
        {chatOpen && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
            <div className="p-3 border-b border-slate-800 font-semibold text-xs text-slate-300">
              Consultation Messages
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    m.sender === 'You' ? 'bg-teal-700/60 ml-6 text-white' : 'bg-slate-800 mr-6 text-slate-200'
                  }`}
                >
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type medical query..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3 rounded-full transition-colors ${
            isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
          }`}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full transition-colors ${
            isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
          }`}
          title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={onClose}
          className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Leave Consultation</span>
        </button>
      </div>

    </div>
  );
};
