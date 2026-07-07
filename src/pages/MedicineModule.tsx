import { useState } from "react";
import { Search, MapPin, TrendingDown, Info, ShoppingCart, Tag, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DUMMY_MEDICINES = [
  { id: '1', name: 'Brufen', genericName: 'Ibuprofen', basePrice: 45, category: 'Painkiller', stock: 'available', pharmacies: 8 },
  { id: '2', name: 'Panadol', genericName: 'Paracetamol', basePrice: 20, category: 'Analgesic', stock: 'available', pharmacies: 15 },
  { id: '3', name: 'Augmentin', genericName: 'Amoxicillin + Clavulanic Acid', basePrice: 350, category: 'Antibiotic', stock: 'limited', pharmacies: 3 },
  { id: '4', name: 'Amoxil', genericName: 'Amoxicillin', basePrice: 120, category: 'Antibiotic', stock: 'available', pharmacies: 10 },
  { id: '5', name: 'Zantac', genericName: 'Ranitidine', basePrice: 60, category: 'Antacid', stock: 'out of stock', pharmacies: 0 },
];

const PHARMACIES = [
  { name: 'Sehat Pharmacy', address: 'Block 4, Gulshan', price: 42, stock: 'High' },
  { name: 'Clinix Pharmacy', address: 'North Nazimabad', price: 48, stock: 'Medium' },
  { name: 'Kausar Medicos', address: 'DHA Phase 6', price: 44, stock: 'In Stock' },
];

export default function MedicineModule() {
  const [search, setSearch] = useState("");
  const [selectedMed, setSelectedMed] = useState<any>(null);

  const filtered = DUMMY_MEDICINES.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.genericName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Medicine Finder</h1>
        <p className="text-slate-600">Find the best prices and generic alternatives nearby.</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
          <Search className="w-6 h-6" />
        </div>
        <input 
          type="text" 
          placeholder="Search by brand or generic name (e.g. Panadol, Ibuprofen)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white pl-14 pr-6 py-5 rounded-3xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg shadow-sm"
        />
        <div className="absolute inset-y-3 right-3">
          <button className="h-full px-6 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
            <Filter className="w-4 h-4" />
            Advanced
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-12 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-slate-700">Displaying {filtered.length} results</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Sort by:</span>
              <select className="bg-transparent font-bold text-slate-700 outline-hidden cursor-pointer">
                <option>Price (Low to High)</option>
                <option>Distance</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {filtered.map((med) => (
              <motion.div 
                layoutId={med.id}
                key={med.id}
                onClick={() => setSelectedMed(med)}
                className={`glass-card p-6 cursor-pointer hover:border-teal-200 transition-all group scale-100 hover:scale-[1.01] ${selectedMed?.id === med.id ? 'border-teal-500 ring-2 ring-teal-500/10' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-800">{med.name}</h3>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm">{med.category}</span>
                    </div>
                    <p className="text-slate-500 font-medium italic">{med.genericName}</p>
                  </div>
                  <p className="text-2xl font-black text-teal-600">Rs. {med.basePrice}</p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span>View Availability</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedMed ? (
              <motion.div 
                key={selectedMed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="glass-card p-8 sticky top-28 bg-slate-50/50"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900">{selectedMed.name}</h3>
                      <p className="text-lg text-slate-500 mt-1">{selectedMed.genericName}</p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-teal-600">
                      <Info className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2">
                       <Tag className="w-4 h-4" /> Price Comparison
                    </h4>
                    <div className="space-y-3">
                      {PHARMACIES.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-400">{p.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">Rs. {p.price}</p>
                            <p className="text-[10px] uppercase font-bold text-emerald-500">{p.stock}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Suggestion</p>
                    <p className="text-sm text-blue-800 font-medium leading-relaxed">
                      Buying the generic version of this medicine can save you up to 40% on average in this area.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button className="py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" /> Route
                    </button>
                    <button className="py-4 px-6 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center text-slate-400 bg-dashed border-2 border-slate-100 h-96 flex flex-col items-center justify-center">
                <Search className="w-12 h-12 mb-4 opacity-10" />
                <p className="font-medium">Select a medicine to view <br /> price comparison and stock status</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
