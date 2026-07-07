import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db, doc, getDoc, onAuthStateChanged, User } from "./lib/firebase";
import { 
  Heart, 
  Search, 
  Stethoscope, 
  User as UserIcon, 
  Home, 
  PlusCircle, 
  Droplet, 
  Activity,
  Menu,
  X,
  LogIn,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import HomePage from "./pages/Home";
import BloodModule from "./pages/BloodModule";
import MedicineModule from "./pages/MedicineModule";
import AICopilot from "./pages/AICopilot";
import Profile from "./pages/Profile";
import SeedPage from "./pages/SeedPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HospitalDashboard from "./pages/HospitalDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-4 bg-teal-500 rounded-2xl shadow-lg"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 p-4">
          <div className="max-w-6xl mx-auto glass-card flex items-center justify-between px-6 py-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-teal-500 rounded-xl">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold font-display gradient-text">SehatYaab</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <NavLink to="/" icon={<Home className="w-4 h-4" />} label="Home" />
              <NavLink to="/blood" icon={<Droplet className="w-4 h-4" />} label="Blood" />
              <NavLink to="/medicine" icon={<Search className="w-4 h-4" />} label="Medicine" />
              <NavLink to="/ai" icon={<Stethoscope className="w-4 h-4" />} label="AI Copilot" />
              {userData?.role === 'hospital' && <NavLink to="/hospital/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Hospital" />}
              {userData?.role === 'doctor' && <NavLink to="/doctor/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Doctor" />}
              {userData?.role === 'pharmacy' && <NavLink to="/pharmacy/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Pharmacy" />}
              {user ? (
                <Link to="/profile" className="flex items-center gap-2 p-1 pr-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-8 h-8 rounded-full" />
                  <span className="text-slate-900">{user.displayName?.split(' ')[0]}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-slate-600 hover:text-teal-600 transition-colors">Login</Link>
                  <Link 
                    to="/register"
                    className="bg-teal-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-teal-600 transition-all shadow-md shadow-teal-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 z-[60] bg-white p-8 flex flex-col gap-8 md:hidden"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-display gradient-text">SehatYaab</span>
                <button onClick={() => setMobileMenuOpen(false)}><X className="w-8 h-8 text-slate-400" /></button>
              </div>
              <div className="flex flex-col gap-6 text-xl font-medium text-slate-600">
                <MobileNavLink to="/" label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/blood" label="Blood Donation" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/medicine" label="Find Medicine" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/ai" label="AI Health Assistant" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/profile" label="My Health Card" onClick={() => setMobileMenuOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blood" element={<BloodModule />} />
            <Route path="/medicine" element={<MedicineModule />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ai" element={user ? <AICopilot /> : <AuthRequired />} />
            <Route path="/profile" element={user ? <Profile /> : <AuthRequired />} />
            <Route path="/hospital/dashboard" element={userData?.role === 'hospital' ? <HospitalDashboard /> : <Navigate to="/" />} />
            <Route path="/doctor/dashboard" element={userData?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/" />} />
            <Route path="/pharmacy/dashboard" element={userData?.role === 'pharmacy' ? <PharmacyDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/seed" element={<SeedPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function AuthRequired() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-6 bg-slate-100 rounded-full mb-6">
        <LogIn className="w-12 h-12 text-slate-400" />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-4 font-display">Authentication Required</h2>
      <p className="text-slate-500 max-w-md mb-8">Please join the community to access AI assistance, emergency requests, and your personal health card.</p>
      <div className="flex gap-4">
        <Link to="/login" className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold">Sign In</Link>
        <Link to="/register" className="bg-teal-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-teal-200">Register</Link>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-2 transition-colors ${active ? 'text-teal-600 font-bold' : 'hover:text-teal-500'}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, label, onClick }: { to: string, label: string, onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="hover:text-teal-500 transition-colors">{label}</Link>
  );
}

