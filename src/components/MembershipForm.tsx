import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { db, auth, handleFirestoreError } from '../App';
import { OperationType } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const IMAGES = {
  logo: "https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1"
};

const interestOptions = [
  "Women Development in Rural Area",
  "Swachh India Mission",
  "Healthcare checkup and handicapped facilities",
  "Development of village and Rural Sanitation",
  "Education for uneducated and poor population"
];

const InputBox = ({ label, value, onChange, placeholder, type = "text", required = false }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white w-full focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none placeholder:text-slate-500 text-base shadow-inner"
    />
  </div>
);

export default function MembershipForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    fatherHusbandName: '',
    gender: 'Male',
    maritalStatus: 'Single',
    dob: '',
    education: '',
    profession: '',
    address: '',
    bloodGroup: '',
    mobile: '',
    altMobile: '',
    email: '',
    membershipOption: 'Basic Membership',
    interests: [] as string[],
    suggestions: '',
    agreedToTerms: false
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      await addDoc(collection(db, 'members'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      const amount = formData.membershipOption === 'Basic Membership' ? 1000 : 500;
      setSubmitStatus('success');
      setTimeout(() => navigate(`/?donate=true&amount=${amount}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`), 2000);
    } catch (error: any) {
      console.error("Error submitting membership:", error);
      setSubmitStatus('error');
      try {
        handleFirestoreError(error, OperationType.CREATE, 'members');
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans selection:bg-orange-500/30 pb-20">
      {/* Floating Back Button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 bg-orange-600 rounded-full px-6 py-3 text-white hover:bg-orange-700 transition-all shadow-2xl flex items-center gap-2 group font-black uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Visual Header matching the image */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 h-48 flex items-center px-6 md:px-12 pt-12 md:pt-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 -mr-32 -mt-32 transform rotate-12" />
        <div className="flex items-center gap-6 z-10">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full p-2 shadow-2xl overflow-hidden shrink-0">
            <img src={IMAGES.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-2xl md:text-5xl font-serif font-black text-white italic tracking-tighter drop-shadow-lg leading-tight">
              Mangla Gauri Seva Sansthaan
            </h1>
            <p className="text-[10px] md:text-base text-white/90 font-bold tracking-widest mt-1 opacity-80 uppercase">
              559KHA/88, Singar Nagar, Alambagh, Lucknow
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center mb-12">
           <div className="bg-sky-500 text-white px-8 py-3 uppercase font-black tracking-[0.3em] text-xs md:text-sm shadow-xl shadow-sky-900/20 rounded-full">
             MEMBERSHIP FORM
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* General Info */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <div className="space-y-6">
              <InputBox 
                label="Name" 
                required
                value={formData.name} 
                onChange={(e: any) => setFormData({...formData, name: e.target.value})} 
                placeholder="Enter Full Name"
              />
              <InputBox 
                label="Father's / Husband Name" 
                required
                value={formData.fatherHusbandName} 
                onChange={(e: any) => setFormData({...formData, fatherHusbandName: e.target.value})} 
                placeholder="Enter Name"
              />
              
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest">Gender</label>
                <div className="flex gap-4">
                  {['Male', 'Female'].map(g => (
                    <label key={g} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer py-3 rounded-xl border transition-all ${
                      formData.gender === g ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-900/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="gender" 
                        value={g} 
                        checked={formData.gender === g}
                        onChange={() => setFormData({...formData, gender: g})}
                        className="hidden"
                      />
                      <span className="font-bold">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest">Marital Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Single', 'Married', 'Other'].map(s => (
                    <label key={s} className={`flex items-center justify-center gap-2 cursor-pointer py-3 rounded-xl border transition-all text-xs ${
                      formData.maritalStatus === s ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-900/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="maritalStatus" 
                        value={s} 
                        checked={formData.maritalStatus === s}
                        onChange={() => setFormData({...formData, maritalStatus: s})}
                        className="hidden"
                      />
                      <span className="font-bold">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <InputBox 
                label="Date of Birth" 
                type="date"
                value={formData.dob} 
                onChange={(e: any) => setFormData({...formData, dob: e.target.value})} 
              />
              <InputBox 
                label="Education" 
                value={formData.education} 
                onChange={(e: any) => setFormData({...formData, education: e.target.value})} 
                placeholder="Highest Qualification"
              />
              <InputBox 
                label="Profession" 
                value={formData.profession} 
                onChange={(e: any) => setFormData({...formData, profession: e.target.value})} 
                placeholder="Occupation"
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <InputBox 
              label="Communication Address" 
              value={formData.address} 
              onChange={(e: any) => setFormData({...formData, address: e.target.value})} 
              placeholder="Residential address with pin code"
            />
          </div>

          {/* Contact Details */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <div className="space-y-6">
              <InputBox 
                label="Blood Group" 
                value={formData.bloodGroup} 
                onChange={(e: any) => setFormData({...formData, bloodGroup: e.target.value})} 
                placeholder="e.g. O+"
              />
              <InputBox 
                label="Mobile Number" 
                required
                value={formData.mobile} 
                onChange={(e: any) => setFormData({...formData, mobile: e.target.value})} 
                placeholder="10-digit number"
              />
            </div>
            <div className="space-y-6">
              <InputBox 
                label="Alternate Mobile" 
                value={formData.altMobile} 
                onChange={(e: any) => setFormData({...formData, altMobile: e.target.value})} 
                placeholder="Optional"
              />
              <InputBox 
                label="Email Address" 
                type="email"
                value={formData.email} 
                onChange={(e: any) => setFormData({...formData, email: e.target.value})} 
                placeholder="example@mail.com"
              />
            </div>
          </div>

          {/* Membership Option */}
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <h3 className="text-orange-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <div className="w-4 h-1 bg-orange-500 rounded-full" />
              Membership Option
            </h3>
            <div className="grid gap-4">
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                formData.membershipOption === 'Basic Membership' 
                  ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg' 
                  : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="membershipOption" 
                    value="Basic Membership"
                    checked={formData.membershipOption === 'Basic Membership'}
                    onChange={() => setFormData({...formData, membershipOption: 'Basic Membership'})}
                    className="accent-orange-500 w-5 h-5"
                  />
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs">Basic Membership</p>
                    <p className="text-[10px] opacity-60">One Year Enrollment</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-orange-500">Rs. 1000/-</span>
              </label>
              
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                formData.membershipOption === 'Monthly Contribution' 
                  ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg' 
                  : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="membershipOption" 
                    value="Monthly Contribution"
                    checked={formData.membershipOption === 'Monthly Contribution'}
                    onChange={() => setFormData({...formData, membershipOption: 'Monthly Contribution'})}
                    className="accent-orange-500 w-5 h-5"
                  />
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs">Monthly Contribution</p>
                    <p className="text-[10px] opacity-60">Become a recurring supporter</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-orange-500">Rs. 500/-</span>
              </label>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <h3 className="text-orange-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <div className="w-4 h-1 bg-orange-500 rounded-full" />
              I am interested to participate in
            </h3>
            <div className="grid gap-3">
              {interestOptions.map(option => (
                <label key={option} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  formData.interests.includes(option)
                    ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg' 
                    : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rotate-45 transition-colors ${formData.interests.includes(option) ? 'bg-orange-500' : 'bg-slate-700'}`} />
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.interests.includes(option)}
                    onChange={() => handleInterestToggle(option)}
                    className="accent-orange-500 w-5 h-5 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
            <h3 className="text-orange-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <div className="w-4 h-1 bg-orange-500 rounded-full" />
              Community Ideas & Event Suggestions
            </h3>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest px-1">
              Invite us to organize events in your region
            </p>
            <textarea 
              value={formData.suggestions}
              onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
              rows={4}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-3xl p-6 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-slate-700 text-base"
              placeholder="Tell us how we can help your local community..."
            />
          </div>

          {/* T&C */}
          <div className="bg-black/30 p-8 rounded-[2rem] border border-white/5 text-xs text-slate-500 space-y-4">
            <h4 className="font-bold text-slate-300 uppercase tracking-widest">Terms and Conditions:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>I never be involved in any illegal/unlawful activities the countries or elsewhere.</li>
              <li>As a member of Mangla Gauri Seva Sansthaan, I undertake to liable to do only development & cultural issues that are adjacent to my region.</li>
              <li>Mangla Gauri Seva Sansthaan, has right the Cancel/modify/update my membership anytime anywhere, if found guilty or irregularities.</li>
            </ul>
            <label className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5 cursor-pointer">
              <input 
                type="checkbox" 
                required
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                className="accent-orange-500 w-5 h-5 rounded"
              />
              <span className="text-sm font-bold text-white uppercase">I agree to the terms and conditions</span>
            </label>
          </div>

          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold py-4 rounded-2xl text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Membership Application Submitted Successfully!
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col gap-2"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-2xl text-center flex items-center justify-center gap-2 font-black uppercase text-sm">
                    <AlertCircle className="w-5 h-5" /> Failed to submit. Please try again.
                  </div>
                  {errorMessage && (
                    <div className="p-4 bg-slate-800 border border-white/5 rounded-xl text-[10px] font-mono text-slate-500 break-all">
                      DEBUG INFO: {errorMessage}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Membership Form"}
            </button>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-black">
              सेवा परमो धर्मः (Service is the highest duty)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
