import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ChevronLeft, Lock, User as UserIcon, FileText, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  isSharingEnabled: boolean;
}

interface Record {
  id: string;
  type: string;
  fileName: string;
  fileURL: string;
  createdAt: any;
}

export default function DoctorPatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as PatientProfile;
          if (!data.isSharingEnabled) {
            setDenied(true);
            setLoading(false);
            return;
          }
          setProfile(data);

          // Fetch records
          const q = query(
            collection(db, 'records'),
            where('patientId', '==', id),
            orderBy('createdAt', 'desc')
          );
          const recSnap = await getDocs(q);
          setRecords(recSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record)));
        } else {
          setDenied(true);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
        setDenied(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (denied) return (
    <div className="max-w-md mx-auto py-12 px-4 text-center mt-12">
      <div className="inline-flex p-4 bg-red-50 rounded-3xl mb-6">
        <Lock className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-8 font-medium">The patient has either disabled sharing or the ID is invalid.</p>
      <button 
        onClick={() => navigate('/doctor/dashboard')}
        className="text-blue-600 font-bold flex items-center justify-center mx-auto hover:underline"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Return to Dashboard
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 font-bold text-sm mb-2 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-center space-x-5">
          <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
            <UserIcon className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Authenticated View</h3>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">{profile?.name}</h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-green-400/10 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center border border-green-400/20">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Session Secure
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pl-0 md:pl-8 md:border-l border-slate-100">
           <div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Type</p>
             <p className="text-2xl font-bold text-red-600 tracking-tighter">{profile?.bloodGroup}</p>
           </div>
           <div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Demographics</p>
             <p className="text-xl font-bold text-slate-800 uppercase tracking-tight">{profile?.age}Y • {profile?.gender}</p>
           </div>
        </div>
      </motion.div>

      <div className="pt-4 flex justify-between items-end">
        <div>
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Vault Data Stream</h3>
          <h3 className="text-2xl font-bold text-slate-900">Medical History</h3>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">
          {records.length} Records found
        </div>
      </div>
      
      {records.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
          <FileText className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-lg">No medical data sync yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-500 transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-50 ${record.type === 'prescription' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                   <FileText className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{record.type}</p>
                  <p className="font-bold text-slate-800 text-lg leading-tight truncate max-w-[150px] sm:max-w-none">{record.fileName}</p>
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
                className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-2xl flex items-center justify-center transition-all border border-transparent hover:border-slate-100"
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
