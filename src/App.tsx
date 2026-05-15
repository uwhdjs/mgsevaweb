/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { 
  Heart, 
  Droplets, 
  Utensils, 
  School, 
  TreePine, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Menu,
  X,
  CreditCard,
  Target,
  MessageCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  Copy
} from 'lucide-react';

import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation,
  Link
} from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDocFromServer,
  onSnapshot,
  query,
  where,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

import { onAuthStateChanged } from 'firebase/auth';

// CRITICAL: Test Connection to Firestore on boot
async function testConnection() {
  try {
    const testDocRef = doc(db, 'health_check', 'status');
    await getDocFromServer(testDocRef);
    console.log("Firestore client connected successfully");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Client is offline.");
    } else {
      console.warn("Firestore connection test warning:", error);
    }
  }
}
testConnection();

// Admin Guard Component
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const sessionAuth = sessionStorage.getItem('isAdminAuthenticated') === 'true';
      const sessionId = sessionStorage.getItem('adminSessionId');
      
      // If we have the session flag and a session ID, we're good to go
      // We don't strictly need Firebase Auth here because the Dashboard uses backend APIs
      if (sessionAuth && sessionId) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};


// Firestore Error Handler
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}


const IMAGES = {
  treePlantation: "https://lh3.googleusercontent.com/d/17v_5m2wDqGHeThg5Ba8gBqheh8z1SSz-",
  bloodVan: "https://lh3.googleusercontent.com/d/1v9E0atC8sJxTdTBTtYp-QKZospj9z4dU",
  education: "https://lh3.googleusercontent.com/d/1ZTtCPrerpI_O1kNkYsl1-o6sauydzfcw",
  distribution: "https://lh3.googleusercontent.com/d/1kR_rf0EMOoooTP9LYRzhVzTxN5Bym21O",
  bloodCamp: "https://lh3.googleusercontent.com/d/1plBN9RKgwSQHNdGd97uFOt8zibQ917DO",
  healthcare: "https://lh3.googleusercontent.com/d/1nagW4m1xGi4WSACn9OGlSxiKobOg6NL2",
  bannerKids: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
  handicapSupport: "https://lh3.googleusercontent.com/d/1KAkkFGRQA_m7TeHnQwaUQKVIH029rQ6U",
  foodService: "https://lh3.googleusercontent.com/d/16xpzfYrZSpEt7An5bJ-42o9DHc2Io6uz",
  logo: "https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1",
  gallery1: "https://lh3.googleusercontent.com/d/1_FXGtiLbfxIKOTIXGAUKumrQuGa_jYyL",
  gallery2: "https://lh3.googleusercontent.com/d/12UaXzNet0ZzVVEDWOMXk1QuJfv5ESNOS",
  gallery3: "https://lh3.googleusercontent.com/d/1rrRZ13jmL4GLTXBDt4UnqUleHEQRpkWD",
  gallery4: "https://lh3.googleusercontent.com/d/1H_BSJJQqzMwPIb6rPdnx2CbK6wEIDr5k",
  gallery5: "https://lh3.googleusercontent.com/d/1B1pWQ_nkMLwMJGUfzTp7KnRVNjaeUmSH",
  communityService: "https://lh3.googleusercontent.com/d/1WOXeu4naHk4NUlV_d-fN_A7pb14aAaH3",
  medicalCamp: "https://lh3.googleusercontent.com/d/1HhUPBIIPkAapAHotXrHVS6oNcBh0KWEO",
  volunteer1: "https://lh3.googleusercontent.com/d/1WwVv_KCksvBZVyyugCc0LWaKDOb5zegl",
  relief1: "https://lh3.googleusercontent.com/d/1HMY4Foq8onQJbTTZ-S1YlwWSvgyfOvD3",
  gathering: "https://lh3.googleusercontent.com/d/1oMs7qizlDQuaacqWMI2_eeK9klsILD38",
  gallery6: "https://lh3.googleusercontent.com/d/1Cpk5xmHMMJkjItkbrenv6fE-YzrQi9Ax",
  gallery7: "https://lh3.googleusercontent.com/d/1g-ktQGifp3_fcXtEVn8gr0IeDxmrM5_-"
};

const ACTIVITIES = [
  {
    title: "Blood Donation Camps",
    description: "Regularly organizing camps to ensure a steady supply of blood to those in need, saving countless lives through community action.",
    icon: <Droplets className="w-6 h-6 text-red-500" />,
    image: IMAGES.gallery4
  },
  {
    title: "Hunger Relief",
    description: "Providing nutrition through community feasts and regular food distribution drives in slums and for those struggling in Alambagh, Lucknow.",
    icon: <Utensils className="w-6 h-6 text-orange-500" />,
    image: IMAGES.relief1
  },
  {
    title: "Environmental Care",
    description: "Actively participating in plantation drives to keep our city green and combat climate change.",
    icon: <TreePine className="w-6 h-6 text-green-500" />,
    image: IMAGES.treePlantation
  },
  {
    title: "Supporting Disabled",
    description: "Empowering our specially-abled brothers and sisters through mobility support distributions and community inclusion.",
    icon: <Users className="w-6 h-6 text-purple-500" />,
    image: IMAGES.volunteer1
  },
  {
    title: "Winter Relief",
    description: "Distributing warm clothes and blankets to help the underprivileged survive the harsh winter nights in Lucknow.",
    icon: <Heart className="w-6 h-6 text-pink-500" />,
    image: IMAGES.gathering
  },
  {
    title: "Child Education",
    description: "Reaching out to children in local schools to provide stationery, books, and educational guidance for a brighter future.",
    icon: <School className="w-6 h-6 text-blue-500" />,
    image: IMAGES.education
  }
];


import { QRCodeSVG } from 'qrcode.react';

function MainSite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'upi' | 'bank'>('stripe');
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '' });
  const [donationStatus, setDonationStatus] = useState<{ type: 'success' | 'error' | 'cancel', message: string } | null>(null);
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [phoneError, setPhoneError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showDonationModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [showDonationModal]);

  // Timer logic for UPI Payment
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQRCode && !isPaid && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (showQRCode && timeLeft === 0 && !isPaid && paymentMethod !== 'bank') {
      // Auto-expire for UPI, but not for bank details
      setShowQRCode(false);
      setShowDonationModal(false);
      setDonationStatus({ 
        type: 'error', 
        message: 'Payment session expired. Please try again.' 
      });
    }
    return () => clearInterval(timer);
  }, [showQRCode, isPaid, timeLeft, paymentMethod]);

  // Removed automatic UPI simulation to allow users to actually perform the payment/see the QR
  useEffect(() => {
    // Cleanup if component unmounts
    return () => {
      if (!isPaid) {
        setIsDonating(false);
      }
    };
  }, [isPaid]);

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
      alert('Message sent successfully!');
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
      const err = handleFirestoreError(error, OperationType.CREATE, 'messages');
      alert(`Failed to send message: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const [donationStats, setDonationStats] = useState({
    target: 1000000,
    current: 645000,
    loaded: true
  });

  // Handle Stripe Redirection and Real-time Donations
  useEffect(() => {
    // 1. Listen for real-time donations
    const q = query(collection(db, 'donations'), where('status', '==', 'succeeded'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().amount || 0;
      });
      // Add a base amount if real donations are low for demo visual
      setDonationStats(prev => ({ ...prev, current: total + 645000, loaded: true }));
    }, (error) => {
       console.warn("Real-time donation updates disabled (auth required for advanced listing)");
       // Fallback to demo value if listener fails due to rules or connectivity
       setDonationStats(prev => ({ ...prev, loaded: true }));
    });

    // 2. Handle URL parameters for Stripe success/cancel
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('donation_status');
    const sessionId = urlParams.get('session_id');
    const donationId = urlParams.get('donation_id');

    if (status === 'success' && sessionId && donationId) {
      const finishDonation = async () => {
        try {
          // Verify with server
          const response = await window.fetch(`/api/verify-session/${sessionId}`);
          const data = await response.json();
          
          if (data.status === 'complete' || data.status === 'paid') {
            await updateDoc(doc(db, 'donations', donationId), {
              status: 'succeeded',
              stripeSessionId: sessionId
            });
            setIsPaid(true);
            setShowDonationModal(true);
            setDonationStatus({ type: 'success', message: 'Thank you! Your donation was successful.' });
          }
        } catch (err) {
          console.error("Error finalizing donation:", err);
        } finally {
          window.history.replaceState({}, document.title, "/");
        }
      };
      finishDonation();
    } else if (status === 'cancel' && donationId) {
      const cancelDonation = async () => {
        try {
          await updateDoc(doc(db, 'donations', donationId), {
            status: 'failed'
          });
        } catch (err) { }
        setDonationStatus({ type: 'cancel', message: 'Donation was cancelled.' });
        window.history.replaceState({}, document.title, "/");
      };
      cancelDonation();
    }

    return () => unsubscribe();
  }, []);

  const handleDonate = async () => {
    setIsDonating(true);
    const path = 'donations';
    try {
      // 1. Create a pending record in Firestore
      let donationRef;
      try {
        donationRef = await addDoc(collection(db, path), {
          amount: donationAmount,
          donorName: donorInfo.name || 'Anonymous',
          donorEmail: donorInfo.email || '',
          status: 'pending',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        throw handleFirestoreError(err, OperationType.CREATE, path);
      }

      // 2. Create Stripe Checkout Session
      const response = await window.fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          donorName: donorInfo.name,
          donorEmail: donorInfo.email,
          donationId: donationRef.id
        })
      });

      const data = await response.json();
      if (data.url) {
        // Update with session ID
        try {
          await updateDoc(donationRef, { stripeSessionId: data.id });
        } catch (err) {
          throw handleFirestoreError(err, OperationType.UPDATE, `${path}/${donationRef.id}`);
        }
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error("Donation Flow Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setDonationStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsDonating(false);
    }
  };

  const progressPercentage = donationStats.loaded 
    ? Math.min(100, Math.round((donationStats.current / donationStats.target) * 100))
    : 0;

  const SectionTitle = ({ children, light = false }: { children: React.ReactNode, light?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      className="mb-12 text-center"
    >
      <h2 className={`text-3xl md:text-4xl font-serif font-bold ${light ? 'text-white' : 'text-slate-900'} mb-4`}>
        {children}
      </h2>
      <div className={`h-1.5 w-24 mx-auto font-bold rounded-full ${light ? 'bg-white/30' : 'bg-red-500/20'}`}>
        <div className={`h-full w-12 mx-auto rounded-full ${light ? 'bg-white' : 'bg-red-500'}`} />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0">
              <img 
                src={IMAGES.logo} 
                className="w-full h-full object-contain" 
                alt="Mangla Gauri Logo" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-serif font-black tracking-tighter text-slate-900 block leading-none uppercase">
                MANGLA GAURI
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-red-600 font-black flex items-center gap-1">
                Seva Sansthaan
              </span>
            </div>
          </div>
          
            <div className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Activities', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-xs uppercase tracking-widest font-extrabold text-slate-600 hover:text-red-500 transition-all hover:scale-105"
                id={`nav-${item.toLowerCase()}`}
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => setShowDonationModal(true)}
              className="bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-100"
            >
              Donate Now
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            id="mobile-menu-toggle"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20"
          >
            <div className="flex flex-col items-center gap-8 p-12">
              {['Home', 'About', 'Activities', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif font-black text-slate-900 uppercase tracking-tighter"
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-red-500 text-white py-4 rounded-2xl text-lg font-bold"
              >
                Donate Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header id="home" className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/2 bg-red-50 rounded-bl-[100px] blur-3xl opacity-50" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-red-200/50">
              <Target className="w-3.5 h-3.5" />
              Serving Lucknow Since 2016
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-slate-900 leading-tight tracking-tight mb-8">
              Service to humanity is <span className="text-red-500">service to God.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 mb-12 font-medium leading-relaxed max-w-xl opacity-90">
              Mangla Gauri Seva Sansthaan is a mission dedicated to providing relief to the underprivileged through healthcare and education in Alambagh, Lucknow.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-100 hover:-translate-y-1"
              >
                Support Our Mission <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src={IMAGES.bannerKids} 
                className="w-full h-full object-cover" 
                alt="Mangla Gauri Seva Sansthaan Activities" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[240px]">
              <div className="flex -space-x-2 mb-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Volunteer" className="rounded-full" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-900">100+ Volunteers</p>
              <p className="text-xs text-slate-500">Join our growing community of heart-led individuals.</p>
            </div>
          </motion.div>
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

      {/* About Section */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 grid grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <img src={IMAGES.healthcare} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Medical Support" referrerPolicy="no-referrer" />
              <img src={IMAGES.treePlantation} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Environment" referrerPolicy="no-referrer" />
              <img src={IMAGES.gallery2} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Community Service" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-6 pt-12">
              <img src={IMAGES.distribution} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Relief work" referrerPolicy="no-referrer" />
              <img src={IMAGES.education} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Education" referrerPolicy="no-referrer" />
              <img src={IMAGES.medicalCamp} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Medical Camp" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <div className="w-12 h-1.5 bg-red-500 rounded-full mb-8" />
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              A decade of selfless service in the heart of Lucknow.
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Mangla Gauri Seva Sansthaan was born from a simple desire: to make a tangible difference in the lives of those often forgotten by society. Based in Alambagh, we've grown into a multi-faceted mission working across healthcare, hunger relief, and education.
            </p>
            <p className="text-slate-600 mb-10 leading-relaxed">
              Our team consists of professionals, students, and citizens who believe that through consistent efforts, such as our regular blood donation camps and wheelchair distribution drives, we can uplift the entire community.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Target className="w-8 h-8 text-red-500 mb-4" />
                <h4 className="font-bold mb-2">Our Vision</h4>
                <p className="text-xs text-slate-500">To build an inclusive society where no one is left behind due to health or financial struggles.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Heart className="w-8 h-8 text-red-500 mb-4" />
                <h4 className="font-bold mb-2">Our Mission</h4>
                <p className="text-xs text-slate-500">Connecting generous donors with those in desperate need through transparent and efficient systems.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activities Grid */}
      <section id="activities" className="py-24 bg-[#fcfbf9]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle>Our Core Activities</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8">
            {ACTIVITIES.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ delay: (idx % 3) * 0.1, duration: 0.6 }}
                className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl hover:shadow-red-500/5 transition-all"
                id={`activity-${idx}`}
              >
                <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 relative">
                  <img 
                    src={activity.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={activity.title} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-xs font-medium">Join us for our next drive</p>
                  </div>
                </div>
                <div className="px-4 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 transition-colors group-hover:bg-red-500/10">
                    {activity.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-500 transition-colors">{activity.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery - showcasing unique images */}
      <section id="gallery" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle>Moments of Service</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              IMAGES.gallery2, IMAGES.gallery7, IMAGES.gallery3, IMAGES.gallery4,
              IMAGES.gallery5, IMAGES.gallery6, IMAGES.medicalCamp, IMAGES.gallery1,
              IMAGES.volunteer1, IMAGES.relief1, IMAGES.gathering, IMAGES.healthcare,
              IMAGES.treePlantation, IMAGES.distribution, IMAGES.education, IMAGES.bloodCamp,
              IMAGES.bloodVan, IMAGES.foodService, IMAGES.handicapSupport, IMAGES.communityService,
              IMAGES.bannerKids, IMAGES.medicalCamp, IMAGES.relief1, IMAGES.distribution
            ].map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: (idx % 4) * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-100"
                id={`gallery-item-${idx}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="NGO Activity" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              className="bg-red-500 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/20 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <Heart className="w-16 h-16 text-white/40 mx-auto mb-8 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10 uppercase tracking-tight">
                Your help can <br className="hidden md:block" /> save someone's life.
              </h2>
              <p className="text-red-50/80 text-lg mb-8 max-w-2xl mx-auto relative z-10 font-medium">
                Your small contribution can help us buy wheelchairs, organize more blood donation camps, and feed orphans in Lucknow.
              </p>

              {/* Donation Progress Bar */}
              <div className="max-w-xl mx-auto mb-12 relative z-10">
                <div className="flex justify-between items-end mb-3">
                  <div className="text-left">
                    <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-black mb-2 opacity-80">Raised So Far</p>
                    <p className="text-white text-4xl font-display font-bold tracking-tight">₹{donationStats.current.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-black mb-2 opacity-80">Target Goal</p>
                    <p className="text-white/90 text-2xl font-display font-bold opacity-60">₹{donationStats.target.toLocaleString()}</p>
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
                  onClick={() => setShowDonationModal(true)}
                  id="donate-banner-btn"
                  className="bg-white text-red-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-3 shadow-xl"
                >
                  <CreditCard className="w-5 h-5" /> Become a Donor
                </button>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  id="volunteer-banner-btn"
                  className="bg-red-600 text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl"
                >
                  Volunteer With Us
                </button>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
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
                  details: "559 Kha/88, Srinagar, Singarnagar, Alambagh, Lucknow",
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
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  ), 
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
            viewport={{ once: false }}
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-white" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-white" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Phone Number</label>
                  <div className="phone-input-container">
                    <PhoneInput
                      defaultCountry="in"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="phone-input-field"
                    />
                  </div>
                  {phoneError && <p className="text-[10px] text-red-500 mt-1">{phoneError}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all appearance-none text-white cursor-pointer"
                  >
                    <option className="bg-slate-900">General Inquiry</option>
                    <option className="bg-slate-900">Blood Donation</option>
                    <option className="bg-slate-900">Volunteer Application</option>
                    <option className="bg-slate-900">Donation Question</option>
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

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-left border-b border-white/5 pb-8">
            <div className="space-y-4">
              <h4 className="text-white font-serif font-bold text-lg">Mangla Gauri Seva Sansthaan</h4>
              <p className="text-sm">A registered NGO dedicated to serving humanity since a decade in Lucknow.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contact Info</h4>
              <ul className="text-sm space-y-2">
                <li>Ph: +91 9695712713, +91 7318201101</li>
                <li>Email: manglagaurisevasansthan@gmail.com</li>
                <li>Lucknow, Uttar Pradesh, India</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="#about" className="hover:text-red-500 transition-colors">About</a>
                <a href="#activities" className="hover:text-red-500 transition-colors">Activities</a>
                <a href="#gallery" className="hover:text-red-500 transition-colors">Gallery</a>
                <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <p className="text-sm">© 2024 Mangla Gauri Seva Sansthaan. All Rights Reserved.</p>
          <p className="text-[10px] mt-2 uppercase tracking-widest text-slate-600">Built for selfless community service</p>
        </div>
      </footer>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDonationModal(false);
                setShowQRCode(false);
                setIsPaid(false);
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-red-500 p-8 text-white relative">
                <button 
                  onClick={() => {
                    setShowDonationModal(false);
                    setShowQRCode(false);
                    setIsPaid(false);
                    setIsDonating(false);
                  }}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <Heart className="w-12 h-12 mb-4" />
                <h3 className="text-3xl font-serif font-bold">Donate Now</h3>
                <p className="text-red-100 mt-2">Your contribution supports our noble cause.</p>
              </div>
              
              <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                {isPaid ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 px-4 space-y-8"
                  >
                    <div className="relative inline-block">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                        className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200"
                      >
                        <CheckCircle2 className="w-16 h-16 text-white" />
                      </motion.div>
                      {/* Decorative elements to look like confetti */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{ scale: 1, x: (i % 2 === 0 ? 1 : -1) * (30 + i * 10), y: (i < 3 ? -1 : 1) * (30 + i * 5) }}
                          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-orange-400"
                        />
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                       <h4 className="text-4xl font-serif font-black text-slate-900 tracking-tighter">THANK YOU!</h4>
                       <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">Payment Successfully Verified</p>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left">
                       <p className="text-slate-600 text-sm leading-relaxed">
                        Dear <span className="font-black text-slate-900 underline decoration-red-500/30">{donorInfo.name || 'Noble Donor'}</span>, 
                        your contribution of <span className="font-black text-slate-900">₹{donationAmount.toLocaleString()}</span> has been securely saved in our records.
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                          <Heart className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Your kindness helps us provide healthcare, education, and nutrition to those in need in Lucknow.</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowDonationModal(false);
                        setIsPaid(false);
                        setShowQRCode(false);
                        setIsDonating(false);
                      }}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                    >
                      Return to Website
                    </button>
                  </motion.div>
                ) : showQRCode ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center space-y-6"
                  >
                    {paymentMethod === 'bank' ? (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 text-left space-y-6">
                          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                              <Building className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Direct Bank Transfer</p>
                              <h4 className="font-bold text-slate-900 tracking-tight">NGO Official Account</h4>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {[
                              { 
                                bank: "YES BANK", 
                                holder: "Mangla Gauri Seva Sansthaan", 
                                acc: "001888700000542", 
                                ifsc: "YESB0000018",
                                color: "text-blue-600",
                                logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Yes_Bank_Logo.svg/1200px-Yes_Bank_Logo.svg.png"
                              },
                              { 
                                bank: "STATE BANK OF INDIA", 
                                holder: "Mangla Gauri Seva Sansthaan", 
                                acc: "39330764756", 
                                ifsc: "SBIN0003222",
                                color: "text-blue-500",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1024px-SBI-logo.svg.png"
                              }
                            ].map((account, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => {
                                  navigator.clipboard.writeText(account.acc);
                                  alert(`Account number ${account.acc} copied!`);
                                }}
                                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-red-500 hover:shadow-md transition-all cursor-pointer group relative active:scale-[0.98]"
                              >
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                                  Click to Copy
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                                      <img src={account.logo} alt={account.bank} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                    </div>
                                    <p className={`text-[11px] font-black uppercase tracking-tighter ${account.color}`}>{account.bank}</p>
                                  </div>
                                </div>
                                <div className="space-y-1.5 text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-xs text-left">Acc No:</span> 
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-slate-900">{account.acc}</span>
                                      <Copy className="w-3 h-3 text-slate-300 group-hover:text-red-500" />
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-xs text-left">IFSC:</span> 
                                    <span className="font-mono font-bold text-slate-900">{account.ifsc}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                             <div className="flex gap-3">
                               <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                               <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                 Please share the donation screenshot on our WhatsApp (+91 9695712713) after transfer to receive your 80G receipt.
                               </p>
                             </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="pt-2">
                             <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest mb-3">Or choose instant payment</p>
                             <button 
                               onClick={async () => {
                                 setPaymentMethod('stripe');
                                 setShowQRCode(false);
                                 await handleDonate();
                               }}
                               className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl ring-2 ring-red-500/20"
                             >
                                <CreditCard className="w-5 h-5 text-red-500" /> Pay with Credit/Debit Card
                             </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => {
                                window.open('https://wa.me/919695712713', '_blank');
                              }}
                              className="bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-sm"
                            >
                               WhatsApp Help
                            </button>
                            <button 
                              onClick={() => {
                                setShowQRCode(false);
                                setIsDonating(false);
                              }}
                              className="bg-slate-50 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors text-sm"
                            >
                              Go Back
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#f2f5ff] p-8 rounded-[2.5rem] flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-6">
                          <img src={IMAGES.logo} className="w-8 h-8 object-contain" alt="Logo" referrerPolicy="no-referrer" />
                          <span className="text-xl font-bold text-slate-800 tracking-tight">manglagaurisevasansthan</span>
                        </div>
                        
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-6 w-full max-w-[260px] flex flex-col items-center">
                          <div className="bg-white p-2 mb-4">
                            <QRCodeSVG 
                              value={`upi://pay?pa=manglagaurisevasansthan@oksbi&pn=Mangla%20Gauri%20Seva%20Sansthaan&am=${donationAmount}&cu=INR`}
                              size={180}
                              level="H"
                              includeMargin={false}
                            />
                          </div>
                          <p className="text-sm font-bold text-slate-700 tracking-tight">UPI ID: manglagaurisevasansthan@oksbi</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-black text-slate-900 mb-1">₹{donationAmount.toLocaleString()}</p>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount to Pay</p>
                        </div>
                        
                        <div className="mt-8 text-center">
                          <p className="text-sm font-bold text-slate-600">Scan to pay with any UPI app</p>
                        </div>

                        <div className="w-full mt-8 space-y-4">
                          {isDonating ? (
                            <div className="flex flex-col items-center gap-3 py-4">
                              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                              <p className="text-sm font-bold text-slate-900">Verifying Payment...</p>
                              <p className="text-xs text-slate-400 text-center">Please wait while we confirm your transaction with the bank.</p>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-center gap-2 py-2 text-red-500">
                                 <Loader2 className="w-4 h-4 animate-spin" />
                                 <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Awaiting UPI Confirmation...</span>
                              </div>
                                
                              <a 
                                href={`upi://pay?pa=manglagaurisevasansthan@oksbi&pn=Mangla%20Gauri%20Seva%20Sansthaan&am=${donationAmount}&cu=INR`}
                                className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-bold text-sm text-center block md:hidden"
                              >
                                Open in UPI App
                              </a>
                              <div className="hidden md:block py-2 bg-slate-50 rounded-xl border border-slate-100 italic text-[10px] text-slate-400 text-center">
                                Please use your phone to scan the QR code above.
                              </div>

                              <button 
                                onClick={() => {
                                  setShowQRCode(false);
                                  setIsDonating(false);
                                }}
                                className="w-full text-slate-400 text-sm font-medium hover:text-slate-600 pt-2"
                              >
                                Cancel & Change Amount
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <label className="text-xs uppercase tracking-widest font-bold text-slate-400 block mb-3">Select Amount (INR)</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[500, 1000, 2000, 5000, 10000].map(amt => (
                          <button 
                            key={amt}
                            onClick={() => setDonationAmount(amt)}
                            className={`py-3 rounded-xl font-bold border-2 transition-all ${
                              donationAmount === amt 
                                ? 'bg-red-500 border-red-500 text-white' 
                                : 'bg-white border-slate-100 text-slate-600 hover:border-red-200'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                        <div className="relative">
                          <input 
                            type="text"
                            inputMode="numeric"
                            placeholder="Other"
                            value={donationAmount === 0 ? '' : donationAmount.toString()}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              // Remove leading zeros
                              const sanitized = val.replace(/^0+/, '');
                              setDonationAmount(sanitized === '' ? 0 : parseInt(sanitized, 10));
                            }}
                            className="w-full h-full py-3 px-4 rounded-xl font-bold border-2 border-slate-100 focus:border-red-500 focus:outline-none text-slate-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-slate-400">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button 
                            onClick={() => setPaymentMethod('stripe')}
                            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-bold border-2 transition-all ${
                              paymentMethod === 'stripe' 
                                ? 'bg-red-50 border-red-500 text-red-600' 
                                : 'bg-white border-slate-100 text-slate-500'
                            }`}
                          >
                            <CreditCard className="w-4 h-4" /> 
                            <span className="text-[10px] uppercase">Card</span>
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('upi')}
                            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-bold border-2 transition-all ${
                              paymentMethod === 'upi' 
                                ? 'bg-red-50 border-red-500 text-red-600' 
                                : 'bg-white border-slate-100 text-slate-500'
                            }`}
                          >
                            <div className="w-4 h-4 rounded bg-red-500 flex items-center justify-center text-[8px] text-white font-bold">QR</div>
                            <span className="text-[10px] uppercase">UPI</span>
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('bank')}
                            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-bold border-2 transition-all ${
                              paymentMethod === 'bank' 
                                ? 'bg-red-50 border-red-500 text-red-600' 
                                : 'bg-white border-slate-100 text-slate-500'
                            }`}
                          >
                            <Building className="w-4 h-4" />
                            <span className="text-[10px] uppercase">Bank</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-slate-400">Your Name</label>
                        <input 
                          type="text"
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                          placeholder="Optional"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-slate-400">Email Address</label>
                        <input 
                          type="email"
                          value={donorInfo.email}
                          onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                          placeholder="Optional"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (paymentMethod === 'upi') {
                          setShowQRCode(true);
                        } else if (paymentMethod === 'bank') {
                          setShowQRCode(true); // Re-using showQRCode state for bank details view to simplify logic
                        } else {
                          handleDonate();
                        }
                      }}
                      disabled={isDonating || donationAmount < 1}
                      className="w-full bg-red-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDonating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-6 h-6" /> 
                          {paymentMethod === 'bank' ? 'View Bank Details' : 'Proceed to Pay'}
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest">
                      {paymentMethod === 'stripe' ? 'Secure Payment via Stripe' : 'UPI Payment with amount pre-filled'}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Notifications */}
      <AnimatePresence>
        {donationStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
              donationStatus.type === 'success' ? 'bg-green-600 text-white' : 
              donationStatus.type === 'cancel' ? 'bg-slate-800 text-white' : 
              'bg-red-600 text-white'
            }`}
          >
            {donationStatus.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span className="font-bold">{donationStatus.message}</span>
            <button onClick={() => setDonationStatus(null)} className="p-1 hover:bg-white/20 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          } 
        />
        {/* Redirect any other admin routes to the admin dashboard */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
