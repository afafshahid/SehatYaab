import React, { useState } from "react";
import { auth, signInWithGoogle, createUserWithEmailAndPassword, db, doc, getDoc, setDoc, serverTimestamp } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Heart, Chrome, AlertCircle, Building2, User as UserIcon, Store } from "lucide-react";
import { motion } from "motion/react";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
        createdAt: serverTimestamp(),
        points: 0
      });
      
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completion. Please try again.");
      } else {
        setError("Failed to create account. Please try again later.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
        role: role,
        createdAt: serverTimestamp(),
        points: 0
      });
      
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 space-y-10 shadow-2xl"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-teal-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-teal-200">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 font-display">Join SehatYaab</h1>
          <p className="text-slate-500 max-w-sm mx-auto">Select your role and create an account to get started.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <RoleCard 
            active={role === "user"} 
            onClick={() => setRole("user")}
            icon={<UserIcon className="w-6 h-6" />}
            title="Individual"
            desc="Health card & AI assistant"
          />
          <RoleCard 
            active={role === "hospital"} 
            onClick={() => setRole("hospital")}
            icon={<Building2 className="w-6 h-6" />}
            title="Hospital"
            desc="Request urgent blood"
          />
          <RoleCard 
            active={role === "pharmacy"} 
            onClick={() => setRole("pharmacy")}
            icon={<Store className="w-6 h-6" />}
            title="Pharmacy"
            desc="Manage local stock"
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-teal-500 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:bg-teal-600 transition-all shadow-xl shadow-teal-200 disabled:bg-slate-200"
          >
            {loading ? "Creating Account..." : `Continue as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or continue with</span></div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:border-teal-500 hover:text-teal-600 transition-all"
          >
            <Chrome className="w-6 h-6" />
            Google
          </button>
          
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 font-bold hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all space-y-3 ${
        active 
          ? 'bg-teal-50 border-teal-500 ring-4 ring-teal-500/10' 
          : 'bg-white border-slate-100 hover:border-teal-200'
      }`}
    >
      <div className={`p-3 rounded-2xl w-fit ${active ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 leading-tight">{desc}</p>
      </div>
    </motion.div>
  );
}
