import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Droplets, 
  Utensils, 
  School, 
  TreePine, 
  Users, 
  Clock, 
  Sparkles,
  FileText,
  TrendingUp,
  Share2,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { YEAR_WISE_MOMENTS, YEARS_RANGE, Moment, YearMoments } from '../data/moments';

const CATEGORY_COLORS = {
  health: {
    bg: "bg-red-50 text-red-700 border-red-100",
    iconBg: "bg-red-500 text-white",
    icon: Heart
  },
  education: {
    bg: "bg-blue-50 text-blue-700 border-blue-100",
    iconBg: "bg-blue-500 text-white",
    icon: School
  },
  environment: {
    bg: "bg-green-50 text-green-700 border-green-100",
    iconBg: "bg-green-500 text-white",
    icon: TreePine
  },
  relief: {
    bg: "bg-amber-50 text-amber-700 border-amber-100",
    iconBg: "bg-amber-500 text-white",
    icon: Utensils
  },
  empowerment: {
    bg: "bg-purple-50 text-purple-700 border-purple-100",
    iconBg: "bg-purple-500 text-white",
    icon: Users
  },
  general: {
    bg: "bg-slate-50 text-slate-700 border-slate-100",
    iconBg: "bg-slate-500 text-white",
    icon: Sparkles
  }
};

export default function MomentsPage() {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<Moment | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const parsedYear = year ? parseInt(year, 10) : 2022;
  const currentData: YearMoments | undefined = YEAR_WISE_MOMENTS[parsedYear];

  // Auto-scroll to top when year changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [parsedYear]);

  // Handle invalid years
  if (!currentData) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-red-100">
            <Clock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif font-black tracking-tight">Year Not Found</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We started our continuous service journey in 2016. Please select a year between 2016 and 2022 to view our historic milestones.
          </p>
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 -z-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold text-slate-600 hover:text-red-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flex-shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1" 
                className="w-full h-full object-contain" 
                alt="Mangla Gauri Logo" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-base font-serif font-black tracking-tighter text-slate-900 block leading-none uppercase">
                MANGLA GAURI
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-black block mt-0.5">
                Seva Sansthaan
              </span>
            </div>
          </div>

          <div className="hidden sm:block">
            <Link
              to="/membership"
              className="bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-600 px-5 py-2 rounded-xl text-xs uppercase tracking-widest font-extrabold transition-all"
            >
              Join Us
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Page Title & Breadcrumbs */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-[10px] uppercase tracking-widest font-bold text-red-600">
            <Sparkles className="w-3 h-3 text-red-500 animate-spin-slow" />
            Historic Memory Lane
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-slate-900">
            Memorable Moments <span className="text-red-500 underline decoration-red-200 decoration-wavy underline-offset-8">{parsedYear}</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
            Discover how small kindnesses combined with volunteer dedication shaped our community in {parsedYear}.
          </p>
        </div>

        {/* Dynamic Horizontal Year Quick Switcher */}
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm max-w-3xl mx-auto mb-16 flex overflow-x-auto justify-between items-center gap-1.5 scrollbar-none">
          {YEARS_RANGE.map((yr) => {
            const isActive = yr === parsedYear;
            return (
              <button
                key={yr}
                onClick={() => navigate(`/moments/${yr}`)}
                className={`flex-1 min-w-[70px] text-center py-3 rounded-xl font-bold text-sm transition-all relative ${
                  isActive 
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/15 scale-105' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.span 
                    layoutId="activeYearBadge"
                    className="absolute inset-0 bg-red-500 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {yr}
              </button>
            );
          })}
        </div>

        {/* Selected Year Core Theme Banner */}
        <motion.div 
          key={parsedYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden mb-16"
        >
          {/* Subtle branding watermarks */}
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-12 translate-y-12">
            <img src="https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1" className="w-80 h-80 object-contain" alt="" referrerPolicy="no-referrer" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="md:col-span-2 space-y-6">
              <span className="text-[10px] tracking-[0.25em] font-black uppercase text-red-400 bg-red-900/40 border border-red-700/30 px-3.5 py-1.5 rounded-full inline-block">
                Annual Focus & Theme
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
                {currentData.theme}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentData.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={handleShare}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-extrabold flex items-center gap-2 transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-red-400" />
                  {copiedLink ? "Link Copied!" : "Share Memories"}
                </button>
              </div>
            </div>

            {/* Year Key Highlights Panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <span className="text-[10px] tracking-widest font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Key Milestones
              </span>
              <ul className="space-y-3">
                {currentData.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-2 text-xs font-semibold text-slate-200">
                    <ChevronRight className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Gallery / Timeline of Memorable Moments */}
        <div className="space-y-16">
          <div className="border-l-2 border-red-500/20 ml-4 md:ml-8 pl-6 md:pl-12 space-y-16 py-4">
            {currentData.moments.map((moment, index) => {
              const category = CATEGORY_COLORS[moment.category];
              const CategoryIcon = category.icon;

              return (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline node icon */}
                  <div className={`absolute -left-[35px] md:-left-[51px] top-0 w-8 h-8 rounded-full border-4 border-[#fcfbf9] flex items-center justify-center shadow-md ${category.iconBg}`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300 grid md:grid-cols-5 gap-8">
                    
                    {/* Moment Image container */}
                    <div className="md:col-span-2 overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 relative shadow-sm">
                      <img 
                        src={moment.image} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={moment.title} 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border flex items-center gap-1.5 ${category.bg}`}>
                          <CategoryIcon className="w-3 h-3" />
                          {moment.category}
                        </span>
                      </div>
                    </div>

                    {/* Moment Text info */}
                    <div className="md:col-span-3 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          <span>{moment.date}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif font-black tracking-tight text-slate-900 leading-tight">
                          {moment.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {moment.description}
                        </p>
                      </div>

                      {/* Stats & Interactive Read More */}
                      <div className="pt-4 border-t border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {moment.stats && (
                          <div className="flex gap-4">
                            {moment.stats.map((stat, sIdx) => (
                              <div key={sIdx} className="font-mono">
                                <span className="block text-slate-400 text-[9px] uppercase tracking-widest font-bold">
                                  {stat.label}
                                </span>
                                <span className="text-base font-black text-slate-800">
                                  {stat.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {moment.longDescription && (
                          <button
                            onClick={() => setSelectedStory(moment)}
                            className="text-xs uppercase tracking-widest font-extrabold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5 self-end sm:self-auto group/btn"
                          >
                            Read Full Story 
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Invitation / CTA section */}
        <div className="mt-24 bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/10 rounded-[2.5rem] p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6">
          <Heart className="w-12 h-12 text-red-500 mx-auto fill-red-500/10 animate-bounce" />
          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 leading-tight">
            Help Us Write More Memorable Stories
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Every medical camp, school supply distribution, and community kitchen meal is only possible because of hands-on support.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/membership"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-extrabold shadow-lg shadow-red-500/10 transition-all hover:scale-105 active:scale-95"
            >
              Become a Member
            </Link>
            <Link
              to="/"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-extrabold transition-all hover:scale-105 active:scale-95"
            >
              Make a Donation
            </Link>
          </div>
        </div>

      </main>

      {/* Footer copyright */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p className="text-xs">© 2026 Mangla Gauri Seva Sansthaan. All Rights Reserved.</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-600">Built for selfless community service</p>
        </div>
      </footer>

      {/* Story Detailed Dialog / Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            {/* Modal Dialog container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#fcfbf9] rounded-[2rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 md:p-8 relative z-10 space-y-6"
            >
              {/* Header / Date */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border flex items-center gap-1 ${CATEGORY_COLORS[selectedStory.category].bg}`}>
                  {selectedStory.category}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  {selectedStory.date}
                </span>
              </div>

              {/* Title & Long Description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-black tracking-tight text-slate-900 leading-tight">
                  {selectedStory.title}
                </h3>
                
                {/* Hero Photo inside modal */}
                <div className="rounded-xl overflow-hidden aspect-[16/9] shadow-sm">
                  <img src={selectedStory.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>

                <p className="text-slate-600 text-sm leading-relaxed font-medium pt-2 whitespace-pre-line">
                  {selectedStory.longDescription || selectedStory.description}
                </p>
              </div>

              {/* Statistics if any */}
              {selectedStory.stats && (
                <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-2 gap-4 border border-slate-100">
                  {selectedStory.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="font-mono">
                      <span className="block text-slate-400 text-[9px] uppercase tracking-widest font-bold">
                        {stat.label}
                      </span>
                      <span className="text-lg font-black text-slate-800">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Back CTA Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-extrabold transition-colors"
                >
                  Close Story
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
