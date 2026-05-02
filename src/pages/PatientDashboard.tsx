import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { Upload, History, Share2, Info, User as UserIcon, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';

export default function PatientDashboard() {
  const { user, profile, refreshProfile } = useAuth();

  const toggleSharing = async () => {
    if (!user || !profile) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isSharingEnabled: !profile.isSharingEnabled
      });
      await refreshProfile();
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-4 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[320px]"
        >
          <div>
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Personal Identity</h3>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-2">{profile.name}</h1>
            <p className="text-slate-500 font-medium">{profile.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Age</span>
              <p className="text-xl font-bold text-slate-800">{profile.age} yrs</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Blood Group</span>
              <p className="text-xl font-bold text-red-600">{profile.bloodGroup}</p>
            </div>
          </div>
        </motion.div>

        {/* Privacy Toggle Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`md:col-span-4 bg-blue-600 rounded-3xl p-8 shadow-xl shadow-blue-100 flex flex-col justify-between min-h-[220px] transition-all ${!profile.isSharingEnabled ? 'bg-slate-800 shadow-slate-100' : ''}`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Privacy Control</h3>
            {profile.isSharingEnabled && <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse shadow-glow shadow-green-400"></div>}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white text-2xl font-semibold">
              {profile.isSharingEnabled ? 'Sharing Active' : 'Vault Locked'}
            </span>
            <button
              onClick={toggleSharing}
              className={`w-14 h-8 bg-white/20 rounded-full p-1 flex items-center transition-all ${profile.isSharingEnabled ? 'justify-end' : 'justify-start'}`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
            </button>
          </div>
          <p className="text-blue-100 text-sm font-medium">
            {profile.isSharingEnabled 
              ? 'Doctors can currently scan your QR code to view records.' 
              : 'Medical practitioners have zero access to your vault.'}
          </p>
        </motion.div>

        {/* Quick Actions (Dashboard Card) */}
        <div className="md:col-span-4 flex flex-col gap-4">
           <Link 
            to="/patient/upload"
            className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between group hover:border-blue-500 hover:bg-blue-50/10 transition-all font-bold text-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors text-blue-600">
                <Upload className="h-6 w-6" />
              </div>
              <span className="text-xl">Upload Record</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link 
            to="/patient/timeline"
            className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between group hover:border-purple-500 hover:bg-purple-50/10 transition-all font-bold text-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors text-purple-600">
                <History className="h-6 w-6" />
              </div>
              <span className="text-xl">Medical Timeline</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* QR Access Key */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-6"
        >
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest w-full text-left">Vault Access Key</h3>
          <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-center border-2 border-slate-100 shadow-inner">
            <QRCodeSVG 
              value={`${window.location.origin}/doctor/patient/${user?.uid}`} 
              size={180}
              level="H"
              includeMargin={false}
              className="mix-blend-multiply"
            />
          </div>
          <p className="text-center text-slate-500 text-sm font-medium">Use this token to grant practitioners verified one-time access</p>
        </motion.div>

        {/* Info/Warning Block */}
        <div className="md:col-span-8 bg-slate-800 rounded-3xl p-8 flex flex-col justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Vault Security</h3>
            <p className="text-2xl font-bold leading-tight mb-4 tracking-tight">Your data is stored in a decentralized ledger with E2E encryption.</p>
            <div className="flex gap-4">
              <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10">HIPAA COMPLIANT</div>
              <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10">AES-256 ENCRYPTED</div>
            </div>
          </div>
          <Shield className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 rotate-12" />
        </div>

      </div>
    </div>
  );
}
