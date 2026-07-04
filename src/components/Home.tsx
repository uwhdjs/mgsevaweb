import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Heart, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  Quote,
  Droplets,
  Utensils,
  TreePine,
  Users,
  School
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../App';
import { TESTIMONIALS, ACTIVITIES } from '../types';

const IconMap = {
  Droplets: <Droplets className="w-6 h-6 text-red-500" />,
  Utensils: <Utensils className="w-6 h-6 text-orange-500" />,
  TreePine: <TreePine className="w-6 h-6 text-green-500" />,
  Users: <Users className="w-6 h-6 text-purple-500" />,
  Heart: <Heart className="w-6 h-6 text-pink-500" />,
  School: <School className="w-6 h-6 text-blue-500" />
};

export default function Home() {
  const navigate = useNavigate();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const [donationStats, setDonationStats] = useState({
    target: 1000000,
    current: 645000,
    loaded: true
  });

  // Sync donation stats from firestore for the progress bar
  useEffect(() => {
    const q = query(collection(db, 'donations'), where('status', '==', 'succeeded'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().amount || 0;
      });
      setDonationStats(prev => ({ ...prev, current: total + 645000, loaded: true }));
    }, (error) => {
       console.warn("Real-time donation updates disabled (auth required for advanced listing)");
       setDonationStats(prev => ({ ...prev, loaded: true }));
    });
    return () => unsubscribe();
  }, []);

  const progressPercentage = donationStats.loaded 
    ? Math.min(100, Math.round((donationStats.current / donationStats.target) * 100))
    : 0;

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const triggerDonationModal = (amount: number) => {
    window.dispatchEvent(new CustomEvent('open-donation-modal', { detail: { amount } }));
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <header className="relative w-full min-h-[500px] md:min-h-[580px] bg-slate-950 overflow-hidden flex items-end">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/40 z-10" />
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.65 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover" 
            alt="NGO Banner Kids" 
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Floating Volunteers Badge */}
        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 max-w-[220px] hidden lg:block z-20">
          <div className="flex -space-x-2 mb-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Volunteer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-900">100+ Volunteers</p>
          <p className="text-[10px] text-slate-500 leading-tight">Join our community of heart-led individuals in Lucknow.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pb-16 pt-32">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/25 text-red-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-red-500/30 backdrop-blur-sm"
            >
              <Target className="w-3.5 h-3.5" />
              Serving Lucknow Since 2016
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black leading-tight tracking-tight mb-6 text-white"
            >
              Voice for the <span className="text-red-500">Voiceless.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed max-w-xl opacity-90 mb-8"
            >
              Mangla Gauri Seva Sansthaan is a mission dedicated to providing relief to the underprivileged through healthcare and education in Alambagh, Lucknow.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => triggerDonationModal(1000)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-red-500/15"
              >
                Charity with Us
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all"
              >
                Learn Our History
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Lives Impacted", value: "5000+" },
            { label: "Blood Units Collected", value: "1200+" },
            { label: "Food Drives", value: "300+" },
            { label: "Children Taught", value: "450+" }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ground Activities Section */}
      <section className="py-24 bg-[#fcfbf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs px-3 py-1 bg-red-100/50 rounded-full inline-block">
              OUR FIELD ACTIVITIES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mt-4 tracking-tight">
              Our Ground Campaigns
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 leading-relaxed font-medium">
              We directly serve Lucknow residents through continuous social welfare, healthcare, and educational programs on the ground.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ACTIVITIES.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.1, duration: 0.6 }}
                className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-xl transition-all"
                id={`home-activity-item-${idx}`}
              >
                <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 relative bg-slate-100">
                  <img 
                    src={activity.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={activity.title} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button 
                      onClick={() => triggerDonationModal(1000)}
                      className="text-white text-xs font-bold bg-red-500 px-4 py-2 rounded-xl transition-all active:scale-95 hover:bg-red-600"
                    >
                      Support This Drive
                    </button>
                  </div>
                </div>
                <div className="px-4 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 transition-colors group-hover:bg-red-500/10">
                    {IconMap[activity.iconName as keyof typeof IconMap]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-500 transition-colors">{activity.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Reviews Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-red-500 font-bold uppercase tracking-[0.25em] text-xs block mb-3">
                VOICES FROM THE GROUND
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight text-slate-900">
                Change, in their words.
              </h2>
            </div>
            
            {/* Nav Arrows */}
            <div className="flex gap-3">
              <button 
                onClick={handlePrevReview}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Previous testimonial"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextReview}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Next testimonial"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative"
              >
                {/* Large double quotes logo at top-left */}
                <div className="absolute top-8 left-8 text-red-500/10 pointer-events-none">
                  <Quote className="w-20 h-20 fill-current" />
                </div>

                <div className="relative z-10 space-y-6 md:space-y-8 pl-4">
                  <p className="text-lg md:text-2xl text-slate-700 font-serif leading-relaxed italic">
                    "{TESTIMONIALS[activeReviewIndex].text}"
                  </p>
                  
                  <div>
                    <span className="text-emerald-600 font-black text-lg md:text-xl block">
                      {TESTIMONIALS[activeReviewIndex].name}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mt-1">
                      {TESTIMONIALS[activeReviewIndex].location}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Progress Indicator dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  activeReviewIndex === idx ? 'w-8 bg-red-500' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Donation Progress Banner */}
      <section className="py-20 bg-[#fcfbf9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="bg-red-500 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/20 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <Heart className="w-16 h-16 text-white/40 mx-auto mb-8 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10 uppercase tracking-tight leading-tight">
              Your help can <br className="hidden md:block" /> save someone's life.
            </h2>
            <p className="text-red-50/80 text-base md:text-lg mb-8 max-w-2xl mx-auto relative z-10 font-medium">
              Your small contribution can help us buy wheelchairs, organize more blood donation camps, and feed orphans in Lucknow.
            </p>

            {/* Donation Progress Bar */}
            <div className="max-w-xl mx-auto mb-12 relative z-10">
              <div className="flex justify-between items-end mb-3">
                <div className="text-left">
                  <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-black mb-2 opacity-80">Raised So Far</p>
                  <p className="text-white text-3xl md:text-4xl font-display font-bold tracking-tight">₹{donationStats.current.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-black mb-2 opacity-80">Target Goal</p>
                  <p className="text-white/90 text-xl md:text-2xl font-display font-bold opacity-60">₹{donationStats.target.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden p-1 backdrop-blur-sm border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white rounded-full shadow-lg"
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-tight">Community Supported</p>
                <p className="text-white font-black text-xs">{progressPercentage}% Complete</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
              <button 
                onClick={() => triggerDonationModal(1000)}
                id="donate-banner-btn"
                className="bg-white text-red-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-3 shadow-xl w-full sm:w-auto justify-center"
              >
                <CreditCard className="w-5 h-5" /> Become a Donor
              </button>
              <button 
                onClick={() => navigate('/contact')}
                id="volunteer-banner-btn"
                className="bg-red-600 text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl w-full sm:w-auto justify-center"
              >
                Volunteer With Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
