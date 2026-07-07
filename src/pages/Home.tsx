import React from "react";
import { motion } from "motion/react";
import { Droplet, Search, Stethoscope, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', requests: 40 },
  { name: 'Tue', requests: 30 },
  { name: 'Wed', requests: 65 },
  { name: 'Thu', requests: 45 },
  { name: 'Fri', requests: 90 },
  { name: 'Sat', requests: 70 },
  { name: 'Sun', requests: 55 },
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold"
            >
              <Activity className="w-4 h-4" />
              <span>Real-time Healthcare Assistance</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-slate-900 leading-tight"
            >
              Saving Lives Through <br />
              <span className="gradient-text">Intelligent Coordination.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 max-w-xl"
            >
              SehatYaab connects you to emergency blood donors, affordable medicines, 
              and AI-powered health guidance in seconds. 
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/blood" className="px-8 py-4 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl shadow-teal-200/50">
                Find Blood Near Me
              </Link>
              <Link to="/medicine" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Search Medicines
              </Link>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Public Health Intelligence</h3>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip />
                    <Area type="monotone" dataKey="requests" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-xs text-slate-500">Active Donors</span>
                  <p className="text-xl font-bold text-slate-800">1,248</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-xs text-slate-500">Stock Verified</span>
                  <p className="text-xl font-bold text-slate-800">92%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="grid md:grid-cols-3 gap-6">
        <ServiceCard 
          icon={<Droplet className="w-8 h-8 text-rose-500" />}
          title="Find My Blood"
          desc="AI-powered emergency donor matching. Connect with nearby blood donors instantly."
          link="/blood"
          color="rose"
        />
        <ServiceCard 
          icon={<Search className="w-8 h-8 text-blue-500" />}
          title="Medicine Finder"
          desc="Compare real-time prices across pharmacies and find affordable generic alternatives."
          link="/medicine"
          color="blue"
        />
        <ServiceCard 
          icon={<Stethoscope className="w-8 h-8 text-emerald-500" />}
          title="AI Health Copilot"
          desc="Symptom analysis and healthcare guidance powered by advanced AI medical intelligence."
          link="/ai"
          color="emerald"
        />
      </section>

      {/* Emergency Alerts */}
      <section className="glass-card p-8 bg-linear-to-r from-teal-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Live Emergency Feed</span>
            </div>
            <h2 className="text-3xl font-black">Near You: Rare Blood Needed (O-)</h2>
            <p className="text-teal-50 opacity-90">
              A patient at City General Hospital urgently needs 2 units of O- blood. 
              As a verified donor, you can save a life today.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold hover:bg-teal-50 transition-all shadow-xl">
            Respond Now
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, desc, link, color }: { icon: React.ReactNode, title: string, desc: string, link: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-8 group hover:border-teal-500 transition-all duration-300"
    >
      <div className={`p-4 bg-${color}-50 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed">
        {desc}
      </p>
      <Link to={link} className="inline-flex items-center gap-2 font-bold text-teal-600 hover:gap-4 transition-all">
        Try Now
        <TrendingUp className="w-4 h-4 rotate-90" />
      </Link>
    </motion.div>
  );
}

function Activity(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
