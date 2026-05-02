import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, QrCode, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function DoctorDashboard() {
  const [patientId, setPatientId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      navigate(`/doctor/patient/${patientId.trim()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center mb-10 mt-4">
        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Practitioner Gateway</h3>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Vault Access</h1>
        <p className="text-slate-500 font-medium mt-2">Verified Patient Record Lookup</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[24px] mb-10 mx-auto shadow-xl shadow-blue-100">
          <QrCode className="h-10 w-10 text-white" />
        </div>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input
              type="text"
              placeholder="Patient Identity Token"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={!patientId.trim()}
            className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-extrabold text-lg hover:bg-black transition-all shadow-xl shadow-slate-100 flex items-center justify-center group"
          >
            <span>Request Vault Entry</span>
            <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-loose">
            Access requires direct authorization<br/>via patient's active sharing token
          </p>
        </div>
      </motion.div>

      <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl shadow-sm">
          <Search className="h-5 w-5 text-blue-600" />
        </div>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          <strong className="text-slate-900">Pro Tip:</strong> Scan the patient's QR code directly from their dashboard for zero-friction authenticated access.
        </p>
      </div>
    </div>
  );
}
