import React, { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs, query, where, serverTimestamp, auth } from "../lib/firebase";
import { Building2, UserPlus, Users, Activity, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function HospitalDashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", email: "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const q = query(collection(db, "users"), where("hospitalId", "==", auth.currentUser?.uid));
      const snap = await getDocs(q);
      setDoctors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would involve creating a Firebase Auth user for the doctor.
      // For this demo, we'll create a user profile with role 'doctor' linked to this hospital.
      // We'll tell the hospital to share the email/password with the doctor.
      
      await addDoc(collection(db, "users"), {
        displayName: newDoctor.name,
        email: newDoctor.email,
        specialty: newDoctor.specialty,
        role: "doctor",
        hospitalId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        // Default password for demo purposes
        tempPassword: "DoctorPassword123"
      });

      setSuccess(`Doctor ${newDoctor.name} added! Temp Password: DoctorPassword123`);
      setIsAdding(false);
      setNewDoctor({ name: "", specialty: "", email: "" });
      fetchDoctors();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hospital Administration</h1>
          <p className="text-slate-500">Manage your medical staff and facility resources.</p>
        </div>
        <Building2 className="w-12 h-12 text-teal-500 bg-teal-50 p-2 rounded-2xl" />
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card p-6 bg-slate-900 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-teal-400" />
              Add New Doctor
            </h3>
            <form onSubmit={addDoctor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Doctor Name</label>
                <input 
                  required
                  value={newDoctor.name}
                  onChange={e => setNewDoctor({...newDoctor, name: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 ring-teal-500 text-white"
                  placeholder="Dr. Sarah Ahmed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Specialty</label>
                <input 
                  required
                  value={newDoctor.specialty}
                  onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 ring-teal-500 text-white"
                  placeholder="Cardiologist"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Doctor Email</label>
                <input 
                  required
                  type="email"
                  value={newDoctor.email}
                  onChange={e => setNewDoctor({...newDoctor, email: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 ring-teal-500 text-white"
                  placeholder="sarah@sehatyaab.pk"
                />
              </div>
              <button className="w-full bg-teal-500 py-3 rounded-xl font-black hover:bg-teal-600 transition-all">
                Registry Doctor
              </button>
            </form>
          </div>

          {success && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-emerald-800 font-bold">
              {success}
            </motion.div>
          )}
        </div>

        <div className="md:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                <Users className="w-6 h-6 text-teal-500" />
                Verified Staff
              </h3>
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                {doctors.length} Doctors
              </span>
            </div>
            
            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-20 text-center text-slate-400"><Loader2 className="animate-spin mx-auto w-10 h-10" /></div>
              ) : doctors.length === 0 ? (
                <div className="p-20 text-center text-slate-400">No doctors registered yet.</div>
              ) : doctors.map(doc => (
                <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-black">
                      {doc.displayName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{doc.displayName}</h4>
                      <p className="text-sm text-slate-500 italic">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold">{doc.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-sm border border-emerald-100 uppercase tracking-tighter">Verified Provider</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
