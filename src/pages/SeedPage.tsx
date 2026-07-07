import { useState } from "react";
import { db, collection, addDoc, serverTimestamp, setDoc, doc } from "../lib/firebase";
import { Database, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const seedData = async () => {
    setLoading(true);
    try {
      // 1. Seed Medicines
      const medicines = [
        { name: 'Brufen', genericName: 'Ibuprofen', category: 'Painkiller', basePrice: 45 },
        { name: 'Panadol', genericName: 'Paracetamol', category: 'Analgesic', basePrice: 20 },
        { name: 'Augmentin', genericName: 'Amoxicillin', category: 'Antibiotic', basePrice: 450 },
        { name: 'Flagyl', genericName: 'Metronidazole', category: 'Antiprotozoal', basePrice: 85 },
        { name: 'Arinac', genericName: 'Ibuprofen + Pseudoephedrine', category: 'Flu', basePrice: 150 },
      ];

      for (const med of medicines) {
        await addDoc(collection(db, "medicines"), med);
      }

      // 2. Sample Checkup Requests
      const requests = [
        { 
          patientName: "Ayesha Khan", 
          symptoms: "High fever and persistent cough for 2 days. Feeling very weak.", 
          status: "pending", 
          urgency: "high", 
          createdAt: serverTimestamp() 
        },
        { 
          patientName: "Omar Ali", 
          symptoms: "Mild headache after working long hours on computer.", 
          status: "pending", 
          urgency: "normal", 
          createdAt: serverTimestamp() 
        }
      ];

      for (const req of requests) {
        await addDoc(collection(db, "checkup_requests"), req);
      }
      
      // 3. Blood Requests
      const bloodRequests = [
        { patientName: "Zaka Ullah", bloodGroup: "A+", hospitals: "Mayo Hospital", city: "Lahore", status: "urgent", createdAt: serverTimestamp() },
        { patientName: "Fatima Bi", bloodGroup: "O-", hospitals: "Civil Hospital", city: "Karachi", status: "normal", createdAt: serverTimestamp() },
      ];
      for (const br of bloodRequests) {
        await addDoc(collection(db, "blood_requests"), br);
      }

      // 4. Pharmacy Stock
      const pharmacyStock = [
        { pharmacyName: "Green Pharmacy", medicineId: "aug-123", name: "Augmentin", price: 420, stock: 50, location: "Islamabad" },
        { pharmacyName: "City Care", medicineId: "pan-456", name: "Panadol", price: 18, stock: 200, location: "Lahore" },
      ];
      for (const ps of pharmacyStock) {
        await addDoc(collection(db, "pharmacy_stock"), ps);
      }

      // 5. Seed some sample Users for display (Note: these won't have Auth until registered)
      const testUsers = [
        { email: 'hospital@test.com', displayName: 'Sehat General Hospital', role: 'hospital' },
        { email: 'doctor@test.com', displayName: 'Dr. Kashif Ahmed', role: 'doctor', specialty: 'General Physician' },
        { email: 'pharmacy@test.com', displayName: 'Al-Shifa Pharmacy', role: 'pharmacy' },
      ];

      for (const tu of testUsers) {
        // We use a query to check if they exist or just add them
        // For testing simplicity, we can use setDoc with a deterministic ID or just addDoc
        await addDoc(collection(db, "users"), {
          ...tu,
          createdAt: serverTimestamp(),
          isTestData: true
        });
      }
      
      alert("Test data seeded! Medicines, Patient Requests, and Blood/Stock are now live.");
      setDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-8">
      <div className="text-center space-y-4">
        <div className="p-6 bg-teal-50 rounded-full w-fit mx-auto">
          <Database className="w-12 h-12 text-teal-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900">Database Seeder</h1>
        <p className="text-slate-500 max-w-lg mx-auto">Initialize your SehatYaab environment with sample data. Use the credentials below to test different roles.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-2 border-dashed border-slate-200 flex flex-col justify-center">
          {done ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-4 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h2 className="text-2xl font-bold">Data Seeded Successfully</h2>
              <p className="text-slate-500">The platform is now populated with real-world health scenarios.</p>
            </motion.div>
          ) : (
            <button 
              onClick={seedData}
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Database />}
              {loading ? "Seeding..." : "Seed Medicine & Requests"}
            </button>
          )}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-2xl">
          <h3 className="text-xl font-bold border-b border-slate-800 pb-4">Test Credentials</h3>
          <p className="text-slate-400 text-sm">Use these to log in and test specialized dashboards. All use password: <code className="text-teal-400">Password123</code></p>
          
          <div className="space-y-4">
            <CredentialRow label="🏥 Hospital" email="hospital@test.com" />
            <CredentialRow label="🩺 Doctor" email="doctor@test.com" />
            <CredentialRow label="💊 Pharmacy" email="pharmacy@test.com" />
            <CredentialRow label="👤 Regular User" email="user@test.com" />
          </div>

          <div className="p-4 bg-slate-800 rounded-2xl flex gap-3 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <p>If login fails, click "Register" and use the same email/password to create the account locally. Firestore roles are pre-seeded.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CredentialRow({ label, email }: { label: string, email: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
      <span className="font-bold text-sm">{label}</span>
      <span className="font-mono text-teal-400 text-xs">{email}</span>
    </div>
  );
}
