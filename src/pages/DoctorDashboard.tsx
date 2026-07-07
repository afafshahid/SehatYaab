import React, { useState, useEffect } from "react";
import { db, collection, getDocs, query, where, updateDoc, doc, onSnapshot, orderBy, auth } from "../lib/firebase";
import { Stethoscope, Users, Clock, CheckCircle2, MessageSquare, AlertCircle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DoctorDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');

  useEffect(() => {
    // Listen for checkup requests
    const q = query(collection(db, "checkup_requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const requestRef = doc(db, "checkup_requests", requestId);
      await updateDoc(requestRef, {
        status: status,
        doctorId: auth.currentUser?.uid,
        doctorName: auth.currentUser?.displayName,
        updatedAt: new Date()
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = requests.filter(r => {
    if (activeTab === 'pending') return r.status === 'pending';
    return r.status === 'accepted' && r.doctorId === auth.currentUser?.uid;
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-linear-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-teal-500 rounded-2xl shadow-lg shadow-teal-500/20">
            <Stethoscope className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Dr. Panel</h1>
            <p className="text-slate-400 font-medium font-sans">Welcome back, {auth.currentUser?.displayName}. You have {requests.filter(r => r.status === 'pending').length} new patient requests.</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <div className="text-center px-6 py-2 bg-slate-800 rounded-2xl border border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase">Consultations</p>
            <p className="text-2xl font-black text-teal-400">{requests.filter(r => r.status === 'accepted' && r.doctorId === auth.currentUser?.uid).length}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 w-fit rounded-2xl">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          Incoming Requests
        </button>
        <button 
          onClick={() => setActiveTab('accepted')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'accepted' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          My Appointments
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full py-20 text-center font-bold text-slate-400">Scan for patients...</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center">
              <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No {activeTab} consultations found.</p>
            </div>
          ) : filtered.map(req => (
            <motion.div 
              key={req.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.patientName)}&background=random`} className="w-12 h-12 rounded-2xl shadow-sm" alt="Patient" />
                    <div>
                      <h4 className="font-bold text-slate-800">{req.patientName}</h4>
                      <p className="text-xs text-slate-400 font-bold">{req.patientContact || "Age: 28 • Male"}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-tighter ${
                    req.urgency === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {req.urgency} Priority
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
                  <p className="text-slate-400 font-bold italic mb-1">Symptoms Description:</p>
                  <p className="text-slate-700 leading-relaxed">"{req.symptoms}"</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {req.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleRequest(req.id, 'accepted')}
                      className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20"
                    >
                      Accept Request
                    </button>
                    <button 
                      onClick={() => handleRequest(req.id, 'rejected')}
                      className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:text-rose-500 transition-all"
                    >
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Open Consultation
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
