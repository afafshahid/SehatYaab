import React, { useState, useEffect } from "react";
import { auth, db, doc, getDoc, updateDoc, handleFirestoreError, OperationType, serverTimestamp } from "../lib/firebase";
import { 
  User as UserIcon, 
  Settings, 
  QrCode, 
  Droplet, 
  Heart, 
  Activity, 
  MapPin, 
  Mail, 
  Edit3,
  CheckCircle2,
  Trophy,
  ShieldAlert
} from "lucide-react";
import { motion } from "motion/react";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, 'users', auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, "users");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const updateRole = async (newRole: string, hId?: string) => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { 
        role: newRole,
        hospitalId: hId || "",
        updatedAt: serverTimestamp() 
      } as any);
      setUserData({ ...userData, role: newRole, hospitalId: hId });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "users");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* ... existing header ... */}
      <div className="relative h-48 bg-linear-to-r from-teal-500 to-emerald-500 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -bottom-1 w-full h-1/2 bg-slate-50/50 backdrop-blur-3xl" />
      </div>

      <div className="relative px-8 -mt-24 space-y-8">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <img 
              src={auth.currentUser?.photoURL || ""} 
              alt="Profile" 
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl shadow-slate-200"
            />
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-slate-900">{userData?.displayName}</h1>
              {userData?.role !== 'user' && <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-black uppercase">{userData?.role}</span>}
              <CheckCircle2 className="text-teal-500 w-6 h-6" />
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" /> {userData?.email}
            </p>
          </div>

          <div className="flex gap-3">
             <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">
               <Edit3 className="w-5 h-5" />
               {isEditing ? "Cancel" : "Manage Role"}
             </button>
          </div>
        </div>

        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 bg-teal-50 border-teal-200">
            <h3 className="font-bold text-teal-900 mb-4 text-lg">Select Your Professional Role</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <RoleButton current={userData?.role} role="user" label="Standard User" onClick={updateRole} />
              <RoleButton current={userData?.role} role="hospital" label="Hospital Entity" onClick={updateRole} />
              <RoleButton current={userData?.role} role="pharmacy" label="Pharmacy Owner" onClick={updateRole} />
              <RoleButton current={userData?.role} role="doctor" label="Verified Doctor" onClick={updateRole} />
            </div>
            <p className="mt-4 text-xs text-teal-600 font-medium italic">* Note: Some features like posting blood requests require the Hospital role.</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column: Health Card */}
          <div className="md:col-span-12 lg:col-span-8 space-y-8">
            <div className="glass-card p-8 bg-white border-none shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-800">Smart Digital Health Card</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Medical Identity</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-sm flex items-center gap-2">
                  <Droplet className="w-4 h-4 fill-emerald-600" />
                  Group: {userData?.bloodGroup || 'Not Set'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CardItem icon={<ShieldAlert className="text-rose-500" />} label="Allergies" value="None Reported" />
                <CardItem icon={<Activity className="text-blue-500" />} label="Last Donation" value="2 months ago" />
                <CardItem icon={<Trophy className="text-amber-500" />} label="Health Points" value={userData?.points || 0} />
                <CardItem icon={<MapPin className="text-teal-500" />} label="Base Region" value="Gulshan, Karachi" />
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-inner border border-slate-100">
                  <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center p-2">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <h4 className="font-bold text-slate-800 text-lg">Emergency Access QR</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    First responders can scan this code to access your critical health data in case of an emergency. 
                    Manage privacy settings to control what data is shared.
                  </p>
                  <button className="text-teal-600 font-bold text-sm hover:underline">Download Card PDF</button>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 flex items-center gap-6 group hover:border-rose-200 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Become a Donor</h4>
                  <p className="text-sm text-slate-400">Save lives in emergencies</p>
                </div>
              </div>
              <div className="glass-card p-6 flex items-center gap-6 group hover:border-teal-200 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Verified Health Card</h4>
                  <p className="text-sm text-slate-400">Identity secure and active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity */}
          <div className="md:col-span-12 lg:col-span-4 space-y-6">
            <div className="glass-card p-6 space-y-6 bg-slate-900 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Recent History</h3>
                <span className="text-xs text-slate-500 font-bold underline cursor-pointer">View All</span>
              </div>
              <div className="space-y-4">
                <HistoryItem label="Blood Donation" desc="O- Request fulfilled" time="Oct 14" points="+50" />
                <HistoryItem label="Medicine Search" desc="Augmentin Price Check" time="Oct 12" points="+5" />
                <HistoryItem label="AI Consultation" desc="Flu Symptoms Analysis" time="Oct 10" points="+10" />
              </div>
            </div>

            <div className="glass-card p-6 bg-linear-to-br from-amber-50 to-orange-50 border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h3 className="font-bold text-amber-900">Health Rewards</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed mb-6">
                Redeem your points for significant discounts at verified pharmacy partners.
              </p>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-amber-500 rounded-full" />
              </div>
              <p className="text-[10px] font-black text-amber-600 mt-2 uppercase text-right">650 / 1000 Pts to Next Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleButton({ role, label, current, onClick }: any) {
  const active = current === role;
  return (
    <button 
      onClick={() => onClick(role)}
      className={`p-4 rounded-2xl font-bold text-sm transition-all border-2 ${
        active ? 'bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-200' : 'bg-white text-slate-600 border-slate-100 hover:border-teal-300'
      }`}
    >
      {label}
    </button>
  );
}

function CardItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
      {icon}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="font-black text-slate-800 text-sm">{value}</span>
    </div>
  );
}

function HistoryItem({ label, desc, time, points }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <div className="text-right">
        <p className="font-black text-emerald-400 text-xs">{points}</p>
        <p className="text-[10px] text-slate-600 uppercase font-bold">{time}</p>
      </div>
    </div>
  );
}
