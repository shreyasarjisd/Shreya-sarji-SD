import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FileUp, Clipboard, Activity, CheckCircle2, ChevronLeft, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function PatientUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'prescription' | 'report'>('prescription');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `records/${user.uid}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'records'), {
        patientId: user.uid,
        fileURL: url,
        fileName: file.name,
        type: type,
        createdAt: serverTimestamp(),
      });

      navigate('/patient/timeline');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 font-bold text-sm mb-6 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-100"
      >
        <div className="mb-8">
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Vault Ingestion</h3>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Sync New Record</h1>
          <p className="text-slate-500 font-medium mt-2">Add prescriptions or medical reports to your secure ledger.</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-8">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Record Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('prescription')}
                className={`p-6 rounded-[24px] border-2 flex items-center space-x-4 transition-all ${type === 'prescription' ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-50' : 'border-slate-50 bg-slate-50'}`}
              >
                <div className={`p-3 rounded-xl ${type === 'prescription' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                  <Clipboard className="h-6 w-6" />
                </div>
                <span className={`text-lg font-bold ${type === 'prescription' ? 'text-blue-900' : 'text-slate-500'}`}>Prescription</span>
              </button>
              <button
                type="button"
                onClick={() => setType('report')}
                className={`p-6 rounded-[24px] border-2 flex items-center space-x-4 transition-all ${type === 'report' ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-50' : 'border-slate-50 bg-slate-50'}`}
              >
                <div className={`p-3 rounded-xl ${type === 'report' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                  <Activity className="h-6 w-6" />
                </div>
                <span className={`text-lg font-bold ${type === 'report' ? 'text-blue-900' : 'text-slate-500'}`}>Medical Report</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Document Payload</label>
            <div 
              className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center cursor-pointer hover:border-blue-400 transition-all bg-slate-50/50 flex flex-col items-center justify-center min-h-[220px]"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-slate-400 mt-2 font-medium">Ready for deployment ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <FileUp className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-lg font-bold text-slate-600">Select Document</p>
                  <p className="text-sm text-slate-400 mt-2 font-medium">Supports PDF or High-Res Images up to 10MB</p>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-extrabold text-lg hover:bg-black transition-all shadow-xl shadow-slate-100 disabled:opacity-50 disabled:shadow-none flex items-center justify-center space-x-3"
          >
            {uploading ? (
              <>
                <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Syncing with Vault...</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Finalize Upload</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
