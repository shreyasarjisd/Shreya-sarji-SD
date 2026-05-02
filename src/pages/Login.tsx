import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, UserRound, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (role: 'patient' | 'doctor') => {
    try {
      setLoading(role);
      await login(role);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-200">
            <Shield className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">MedVault</h1>
          <p className="text-slate-400 font-bold tracking-[0.2em] text-[10px] uppercase">Secure Healthcare Ledger</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('patient')}
            disabled={!!loading}
            className="w-full flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all group hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <User className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-bold text-slate-900 text-lg">Patient</p>
                <p className="text-xs text-slate-400 font-medium tracking-tight">Access my health records</p>
              </div>
            </div>
            {loading === 'patient' ? (
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            )}
          </button>

          <button
            onClick={() => handleLogin('doctor')}
            disabled={!!loading}
            className="w-full flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all group hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <UserRound className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-bold text-slate-900 text-lg">Doctor</p>
                <p className="text-xs text-slate-400 font-medium tracking-tight">View patient case studies</p>
              </div>
            </div>
            {loading === 'doctor' ? (
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            )}
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-50">
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
            End-to-End Encrypted<br/>Cloud Storage Access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
