import React, { useState, useEffect } from "react";
import { db, collection, getDocs, query, where, addDoc, serverTimestamp, auth } from "../lib/firebase";
import { Store, Package, Plus, ClipboardList, Loader2, Search } from "lucide-react";
import { motion } from "motion/react";

export default function PharmacyDashboard() {
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStock, setNewStock] = useState({ name: "", price: "", quantity: "" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const q = query(collection(db, "pharmacy_stock"), where("pharmacyId", "==", auth.currentUser?.uid));
      const snap = await getDocs(q);
      setStock(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addToStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "pharmacy_stock"), {
        pharmacyId: auth.currentUser?.uid,
        pharmacyName: auth.currentUser?.displayName || "Local Pharmacy",
        name: newStock.name,
        price: Number(newStock.price),
        stock: Number(newStock.quantity),
        updatedAt: serverTimestamp()
      });
      setNewStock({ name: "", price: "", quantity: "" });
      setIsAdding(false);
      fetchStock();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <Store className="w-10 h-10 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Pharmacy Inventory</h1>
            <p className="text-slate-500 font-medium italic">Manage your medicine stock and pricing.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Inventory
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200"
        >
          <form onSubmit={addToStock} className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Medicine Name</label>
              <input 
                required
                value={newStock.name}
                onChange={e => setNewStock({...newStock, name: e.target.value})}
                placeholder="Panadol 500mg" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-hidden focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Price (PKR)</label>
              <input 
                required
                type="number"
                value={newStock.price}
                onChange={e => setNewStock({...newStock, price: e.target.value})}
                placeholder="20" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-hidden focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
              <input 
                required
                type="number"
                value={newStock.quantity}
                onChange={e => setNewStock({...newStock, quantity: e.target.value})}
                placeholder="100" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-hidden focus:border-amber-500"
              />
            </div>
            <button className="bg-amber-500 text-white p-3 rounded-xl font-black hover:bg-amber-600 shadow-lg shadow-amber-200">
              Save Entry
            </button>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            Current Inventory List
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="pl-9 pr-4 py-2 bg-white rounded-full border border-slate-200 text-sm focus:border-amber-500 outline-none" placeholder="Search my inventory..." />
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-slate-300" /></div>
          ) : stock.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              Your inventory is empty. Start adding stock items.
            </div>
          ) : stock.map(item => (
            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-black">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">Updated: {item.updatedAt?.toDate().toLocaleDateString() || "Recently"}</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Unit Price</p>
                  <p className="text-xl font-black text-slate-900">Rs. {item.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">In Stock</p>
                  <p className={`text-xl font-black ${item.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{item.stock}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
