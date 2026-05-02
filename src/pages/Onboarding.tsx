import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function OnboardingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: '',
    gender: 'Other',
    bloodGroup: 'A+',
    address: '',
    degree: '',
  });
  const [loading, setLoading] = useState(false);

  if (!profile) return null;

  const isPatient = profile.role === 'patient';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const data: any = {
        onboarded: true,
        name: formData.name,
        address: formData.address,
      };

      if (isPatient) {
        data.age = parseInt(formData.age);
        data.gender = formData.gender;
        data.bloodGroup = formData.bloodGroup;
      } else {
        data.degree = formData.degree;
      }

      await updateDoc(doc(db, 'users', user.uid), data);
      await refreshProfile();
      navigate('/');
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[32px] shadow-xl p-10 border border-slate-100"
      >
        <div className="mb-8">
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Vault Registration</h3>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Complete your profile</h1>
          <p className="text-slate-500 font-medium mt-2">Personalize your MedVault experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
            />
          </div>

          {isPatient ? (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Blood Group</label>
                <div className="grid grid-cols-4 gap-2">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData(p => ({...p, bloodGroup: bg}))}
                      className={`py-3 rounded-xl border font-bold text-sm transition-all ${formData.bloodGroup === bg ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Degree / Specialization</label>
              <input
                type="text"
                name="degree"
                required
                placeholder="e.g. MBBS, MD (Cardiology)"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Clinic / Home Address</label>
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none font-medium"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-extrabold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 mt-4"
          >
            {loading ? 'Securing Profile...' : 'Initialize Vault'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
