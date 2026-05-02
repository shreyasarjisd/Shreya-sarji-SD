import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ChevronLeft, FileText, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

interface Record {
  id: string;
  type: string;
  fileName: string;
  fileURL: string;
  createdAt: any;
}

export default function PatientTimeline() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'records'),
          where('patientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Record));
        setRecords(data);
      } catch (error) {
        console.error('Fetch failed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 font-bold text-sm mb-6 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </button>

      <div className="mb-10">
        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Medical Ledger</h3>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight">Patient Timeline</h1>
        <p className="text-slate-500 font-medium mt-2">All your health interactions in one secure view.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-100 flex flex-col items-center">
          <div className="p-6 bg-slate-50 rounded-3xl mb-4">
            <FileText className="h-12 w-12 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold tracking-tight text-lg">No records found in vault</p>
          <button 
            onClick={() => navigate('/patient/upload')}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Upload your first record
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-500 hover:shadow-md hover:shadow-blue-50/50 transition-all"
            >
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-50 ${record.type === 'prescription' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                   <FileText className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{record.type}</p>
                  <p className="font-bold text-slate-800 text-lg leading-tight truncate max-w-[140px] sm:max-w-none">{record.fileName}</p>
                  <p className="text-xs text-slate-400 font-medium flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {record.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <a 
                href={record.fileURL} 
                target="_blank" 
                rel="noreferrer"
                className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 shadow-sm"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
