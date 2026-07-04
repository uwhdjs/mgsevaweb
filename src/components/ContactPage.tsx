import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Heart
} from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../App';
import { OperationType } from '../types';
import { QRCodeSVG } from 'qrcode.react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [phoneError, setPhoneError] = useState('');
  const [activeScanTab, setActiveScanTab] = useState<'review' | 'chat' | 'donate'>('review');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, phone });
    if (phone.length > 20) {
      setPhoneError('Invalid: Phone number too long');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError || !formData.name || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const path = 'messages';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  return (
    <div className="py-12 space-y-24 bg-[#fcfbf9]">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs px-3 py-1 bg-red-100/50 rounded-full inline-block"
        >
          GET IN TOUCH
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif font-black text-slate-900 mt-4 tracking-tight"
        >
          Contact Our Lucknow Office.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-medium"
        >
          Have questions or want to partner on a ground campaign? We're active and ready to respond.
        </motion.p>
      </section>

      {/* Main Contact Section */}
      <section className="bg-slate-900 py-24 text-white border-y border-slate-950">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
          <div>
            <div className="w-12 h-1.5 bg-red-500 rounded-full mb-8" />
            <h2 className="text-4xl font-serif font-bold mb-8">Let's Connect.</h2>
            <p className="text-slate-400 mb-12 max-w-md">
              Have questions about donating blood, volunteering, or want to suggest a new social initiative in Lucknow? Reach out to us.
            </p>
            
            <div className="space-y-8">
              {[
                { 
                  icon: <MapPin />, 
                  title: "Visit Us", 
                  details: "559 Kha/88, Singar Nagar, Alambagh, Lucknow",
                  href: "https://www.google.com/maps/search/?api=1&query=Mangla+Gauri+Seva+Sansthaan+Lucknow+Srinagar+Alambagh"
                },
                { 
                  icon: <Phone />, 
                  title: "Call Us", 
                  details: "+91 9695712713, +91 7318201101",
                  href: "tel:+919695712713"
                },
                { 
                  icon: <Mail />, 
                  title: "Email Us", 
                  details: "manglagaurisevasansthan@gmail.com",
                  href: "mailto:manglagaurisevasansthan@gmail.com"
                },
                { 
                  icon: <WhatsAppIcon className="w-6 h-6" />, 
                  title: "WhatsApp", 
                  details: "+91 9695712713",
                  href: "https://wa.me/919695712713"
                }
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href}
                  target={item.href.startsWith('http') ? "_blank" : undefined}
                  rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 group transition-all hover:translate-x-1"
                >
                  <div className="p-3 bg-white/5 rounded-xl transition-all ring-1 ring-white/10 text-red-500 group-hover:bg-red-500 group-hover:text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-red-500 transition-colors">{item.title}</h4>
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors tracking-tight">{item.details}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10"
          >
            <h3 className="text-2xl font-serif font-bold mb-8">Send a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all text-white placeholder:text-slate-600" 
                    placeholder="Full Name" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all text-white placeholder:text-slate-600" 
                    placeholder="Email (Optional)" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="phone-validation-wrapper space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-500 block">Phone Number</label>
                  <PhoneInput
                    defaultCountry="in"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="phone-input-field text-slate-900"
                  />
                  {phoneError && <p className="text-[10px] text-red-500 mt-1">{phoneError}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-slate-300 cursor-pointer"
                  >
                    <option value="General Inquiry" className="bg-slate-900 text-white">General Inquiry</option>
                    <option value="Blood Donation" className="bg-slate-900 text-white">Blood Donation</option>
                    <option value="Volunteer Application" className="bg-slate-900 text-white">Volunteer Application</option>
                    <option value="Donation Question" className="bg-slate-900 text-white">Donation Question</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Message</label>
                <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-white" 
                  placeholder="How can we help you?" 
                />
              </div>
              
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-green-500 font-bold py-2 bg-green-500/10 rounded-xl"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Message Sent Successfully!
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-red-500 font-bold py-2 bg-red-500/10 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5" /> Failed to send message. Please try again.
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={isSubmitting || !!phoneError}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 ${
                  (isSubmitting || !!phoneError) ? 'bg-slate-700 cursor-not-allowed opacity-70' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                  </>
                ) : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Review & Connect QR Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-red-500 font-bold uppercase tracking-[0.2em] text-xs px-3 py-1 bg-red-100 rounded-full inline-block">
            CONNECT STATION
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight text-slate-900">
            Interactive Scan & Connect
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Select a service below to display its QR code. Scan with your phone's camera or click to proceed instantly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            
            {/* Tabs List Pane */}
            <div className="md:col-span-3 space-y-3">
              {[
                {
                  id: 'review' as const,
                  title: 'Scan to Rate Us on Google',
                  description: 'Support our mission by leaving a 5-star Google Review and helping us reach more supporters.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.583 1.848l-3.97 2.885a1 1 0 00-.364 1.118l1.52 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.885a1 1 0 00-1.176 0l-3.97 2.885c-.783.57-1.838-.197-1.538-1.118l1.52-4.674a1 1 0 00-.364-1.118l-3.97-2.885c-.777-.596-.378-1.848.583-1.848h4.906a1 1 0 00.95-.69l1.519-4.674z"/>
                    </svg>
                  ),
                  activeClass: 'border-red-500 bg-red-500/5 text-red-600',
                  hoverClass: 'hover:border-red-200'
                },
                {
                  id: 'chat' as const,
                  title: 'Scan to Chat on WhatsApp',
                  description: 'Reach our helpline directly to donate blood, request help, or apply to join our Lucknow volunteer group.',
                  icon: <WhatsAppIcon className="w-5 h-5" />,
                  activeClass: 'border-emerald-500 bg-emerald-500/5 text-emerald-600',
                  hoverClass: 'hover:border-emerald-200'
                },
                {
                  id: 'donate' as const,
                  title: 'Scan to Donate via UPI',
                  description: 'Support our ground operations, including wheelchair distribution, child education, and winter blanket drives.',
                  icon: <Heart className="w-5 h-5" />,
                  activeClass: 'border-red-500 bg-red-500/5 text-red-600',
                  hoverClass: 'hover:border-red-200'
                }
              ].map((tab) => {
                const isActive = activeScanTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScanTab(tab.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      isActive 
                        ? `${tab.activeClass} shadow-sm font-semibold` 
                        : `border-slate-100 bg-white text-slate-700 ${tab.hoverClass}`
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-current/10' : 'bg-slate-50 text-slate-500'}`}>
                      {tab.icon}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm text-slate-900">{tab.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{tab.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* QR Code Preview Pane */}
            <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50 min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeScanTab === 'review' && (
                  <motion.div
                    key="review-qr"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center w-full"
                  >
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-5 inline-block">
                      <QRCodeSVG 
                        value="https://www.google.com/maps/search/?api=1&query=Mangla+Gauri+Seva+Sansthaan+Lucknow+Alambagh"
                        size={150}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">GOOGLE REVIEW CODE</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Mangla+Gauri+Seva+Sansthaan+Lucknow+Alambagh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Write Google Review
                    </a>
                  </motion.div>
                )}

                {activeScanTab === 'chat' && (
                  <motion.div
                    key="chat-qr"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center w-full"
                  >
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-5 inline-block">
                      <QRCodeSVG 
                        value="https://wa.me/919695712713"
                        size={150}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">WHATSAPP CHAT CODE</p>
                    <a 
                      href="https://wa.me/919695712713"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Start WhatsApp Chat
                    </a>
                  </motion.div>
                )}

                {activeScanTab === 'donate' && (
                  <motion.div
                    key="donate-qr"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center w-full"
                  >
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-5 inline-block">
                      <QRCodeSVG 
                        value="upi://pay?pa=MAB0450018A0033160@Yesbank&pn=MANGLA%20GAURI%20SEVA%20SANSTHAN"
                        size={150}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">UPI DONATION CODE</p>
                    <a 
                      href="upi://pay?pa=MAB0450018A0033160@Yesbank&pn=MANGLA%20GAURI%20SEVA%20SANSTHAN"
                      className="w-full text-center bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Pay Directly via UPI
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
