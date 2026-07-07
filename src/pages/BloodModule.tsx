import React, { useState, useEffect } from "react";
import { auth, db, collection, addDoc, getDocs, serverTimestamp, query, orderBy, handleFirestoreError, OperationType, onSnapshot } from "../lib/firebase";
import { Droplet, MapPin, Send, Plus, Search, AlertCircle, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string;
  urgency: string;
  createdAt: any;
}

export default function BloodModule() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "A+",
    hospitalName: "",
    unitsRequired: 1,
    urgency: "moderate"
  });

  useEffect(() => {
    const q = query(collection(db, "blood_requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BloodRequest));
      setRequests(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "blood_requests");
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please sign in first");

    try {
      await addDoc(collection(db, "blood_requests"), {
        ...formData,
        requesterId: auth.currentUser.uid,
        status: "open",
        createdAt: serverTimestamp()
      });
      setShowModal(false);
      setFormData({
        patientName: "",
        bloodGroup: "A+",
        hospitalName: "",
        unitsRequired: 1,
        urgency: "moderate"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "blood_requests");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Find My Blood</h1>
          <p className="text-slate-600">Connect with local donors or register to save lives.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          Post Urgent Request
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            Active Emergencies
          </h2>
          
          <div className="grid gap-4">
            {requests.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No active requests right now.
              </div>
            ) : (
              requests.map((req) => (
                <motion.div 
                  key={req.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-rose-200 transition-all border-l-4 border-l-rose-500"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 font-black">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{req.patientName}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {req.hospitalName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                        req.urgency === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.urgency}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {req.createdAt?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                      I can help
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="glass-card p-6 bg-linear-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="text-xl font-bold mb-4">Be a Hero</h3>
            <p className="text-slate-400 text-sm mb-6">
              Register as a donor and get notified when someone nearby needs your blood type.
            </p>
            <button className="w-full py-4 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all">
              Register as Donor
            </button>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <h3 className="font-bold text-slate-800 mb-2">Nearby Blood Banks</h3>
            <div className="space-y-4 pt-2">
              <div className="text-sm p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700">Central Blood Bank</p>
                <p className="text-slate-500">2.4 km away - Verified</p>
              </div>
              <div className="text-sm p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700">Red Crescent Center</p>
                <p className="text-slate-500">3.8 km away - High Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-100 rounded-2xl text-rose-500">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Post Urgent Request</h2>
                  <p className="text-slate-500 text-sm">Please provide accurate information</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Patient Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    placeholder="e.g Ahmad Khan" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-hidden bg-slate-50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Blood Group</label>
                    <select 
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-hidden bg-slate-50"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Urgency</label>
                    <select 
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-hidden bg-slate-50"
                    >
                      <option value="critical">Critical (Immediate)</option>
                      <option value="high">High (Today)</option>
                      <option value="moderate">Moderate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Hospital Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    placeholder="e.g. Aga Khan University Hospital" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-hidden bg-slate-50"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
                  >
                    Post Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
