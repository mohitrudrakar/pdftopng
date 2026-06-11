import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Sparkles, ShieldCheck, Zap, MoveDown, UploadCloud, FileText, Image as ImageIcon, Sun, Moon } from 'lucide-react';
import MorphScene from './MorphScene'; // Ensure this contains FloatingNetwork

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(true);
    }
  }, []);

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleConversion = async (type, e) => {
    const files = e.target.files;
    if (!files.length) return;
    setLoading(true);
    setStatus(type === 'pdf' ? "EXTRACTING JPEG FROM PDF..." : "PACKAGING IMAGES TO PDF...");
    const formData = new FormData();
    if (type === 'pdf') { formData.append("file", files[0]); } 
    else { Array.from(files).forEach(f => formData.append("files", f)); }

    try {
      const endpoint = type === 'pdf' ? "/pdf-to-jpg" : "/jpg-to-pdf";
      const response = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: formData });
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === 'pdf' ? "images_bundle.zip" : "converted_document.pdf";
      a.click();
    } catch (err) {
      alert("Backend error. Ensure Python is running at :8000");
    } finally { setLoading(false); }
  };

  return (
    <div className={`relative font-sans selection:bg-blue-600 overflow-x-hidden transition-colors duration-300 ${isDark ? 'dark bg-[#030303] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* STEP 1: The 3D BACKGROUND (Fixed and behind everything) */}
      <div className={`fixed inset-0 z-0 ${isDark ? 'bg-[#030303]' : 'bg-white'}`}>
        <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
          <Suspense fallback={null}>
            <MorphScene isDark={isDark} />
          </Suspense>
        </Canvas>
      </div>

      {/* STEP 2: THE UI CONTENT (Relative and transparent) */}
      <div className="relative z-10 pointer-events-none">
        {/* THEME TOGGLE BUTTON */}
        <div className="fixed top-8 right-8 z-50 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full backdrop-blur-lg transition-all duration-300 ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-yellow-300'
                : 'bg-black/10 hover:bg-black/20 border border-black/20 text-blue-600'
            }`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.5 }}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* HERO SECTION */}
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: isDark ? 0.05 : 0.03 }} transition={{ duration: 2 }}
              className={`absolute inset-0 flex items-center justify-center overflow-hidden ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              <h1 className="text-[30vw] font-black leading-none uppercase tracking-tighter select-none">CONVERT</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-col items-center pointer-events-auto"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                 <span className={`h-[1px] w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-400/50'}`}></span>
                 <span className={`text-[10px] tracking-[0.6em] uppercase font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>The Ultimate Protocol</span>
                 <span className={`h-[1px] w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-400/50'}`}></span>
              </div>
              
              <h1 className={`text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase mix-blend-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
                PNGtoPDF<span className="text-blue-600 not-italic">.</span>CONVERTER
              </h1>
              
              <p className={`text-lg md:text-xl font-light leading-relaxed max-w-2xl ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                A high-fidelity bridge for your <span className={isDark ? 'text-white' : 'text-gray-900'}>Visual Assets</span> and <span className={isDark ? 'text-white' : 'text-gray-900'}>Digital Documents</span>. 
              </p>

              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className={`mt-20 ${isDark ? 'opacity-30 text-white' : 'opacity-50 text-gray-900'}`}>
                 <MoveDown size={20} />
              </motion.div>
            </motion.div>
        </section>

        {/* TOOLS SECTION */}
        <section className="py-32 px-6 max-w-7xl mx-auto pointer-events-auto">
            <div className="grid lg:grid-cols-2 gap-10">
              <motion.div whileHover={{ scale: 1.02 }} className={`backdrop-blur-3xl rounded-[60px] p-12 relative overflow-hidden transition-all duration-300 ${
                isDark
                  ? 'bg-white/[0.03] border border-white/10'
                  : 'bg-white/80 border border-gray-200 shadow-lg'
              }`}>
                 <FileText className={`absolute -right-10 -top-10 opacity-[0.05] ${isDark ? 'text-blue-500' : 'text-blue-400'}`} size={300} />
                 <div className="relative z-10 text-left">
                    <div className={`mb-6 flex items-center gap-2 ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>
                        <FileText size={20} /> <span className="text-[10px] uppercase tracking-widest font-bold">Source: PDF</span>
                    </div>
                    <h2 className={`text-5xl font-black mb-4 italic tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>PDF TO JPEG</h2>
                    <p className={`mb-10 ${isDark ? 'text-slate-500' : 'text-gray-600'}`}>Instant extraction to high-res JPEG.</p>
                    <label className={`flex items-center justify-between px-8 py-5 rounded-full font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 ${
                      isDark
                        ? 'bg-white text-black hover:bg-blue-600 hover:text-white'
                        : 'bg-gray-900 text-white hover:bg-blue-600 hover:text-white'
                    }`}>
                      <span>Start Process</span>
                      <UploadCloud size={20} />
                      <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleConversion('pdf', e)} />
                    </label>
                 </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className={`backdrop-blur-3xl rounded-[60px] p-12 relative overflow-hidden transition-all duration-300 ${
                isDark
                  ? 'bg-white/[0.03] border border-white/10'
                  : 'bg-white/80 border border-gray-200 shadow-lg'
              }`}>
                 <ImageIcon className={`absolute -right-10 -top-10 opacity-[0.05] ${isDark ? 'text-purple-500' : 'text-purple-400'}`} size={300} />
                 <div className="relative z-10 text-left">
                    <div className={`mb-6 flex items-center gap-2 ${isDark ? 'text-purple-500' : 'text-purple-600'}`}>
                        <ImageIcon size={20} /> <span className="text-[10px] uppercase tracking-widest font-bold">Source: Image</span>
                    </div>
                    <h2 className={`text-5xl font-black mb-4 italic tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>PNG TO PDF</h2>
                    <p className={`mb-10 ${isDark ? 'text-slate-500' : 'text-gray-600'}`}>Compile multiple images into a PDF.</p>
                    <label className={`flex items-center justify-between px-8 py-5 rounded-full font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 ${
                      isDark
                        ? 'bg-white text-black hover:bg-purple-600 hover:text-white'
                        : 'bg-gray-900 text-white hover:bg-purple-600 hover:text-white'
                    }`}>
                      <span>Start Process</span>
                      <UploadCloud size={20} />
                      <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleConversion('jpg', e)} />
                    </label>
                 </div>
              </motion.div>
            </div>
        </section>
      </div>

      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center">
            <div className="w-24 h-[2px] bg-white/10 relative overflow-hidden mb-4">
                <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-blue-500" />
            </div>
            <p className="text-[10px] tracking-[1em] text-blue-500 uppercase animate-pulse font-bold">{status}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
        body { background: #030303; margin: 0; padding: 0; font-family: 'Inter', sans-serif; cursor: crosshair; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}