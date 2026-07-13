import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Menu, 
  X, 
  CreditCard, 
  Building, 
  Facebook, 
  Instagram, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { db, auth, handleFirestoreError } from '../App';
import { IMAGES, OperationType } from '../types';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | 'upi' | 'bank'>('upi');
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [donationStep, setDonationStep] = useState<1 | 2>(1);
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '', address: '', purpose: 'General Social Welfare' });
  const [donationStatus, setDonationStatus] = useState<{ type: 'success' | 'error' | 'cancel', message: string } | null>(null);

  const [donationStats, setDonationStats] = useState({
    target: 1000000,
    current: 645000,
    loaded: true
  });

  // Handle donation triggering from custom event
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.amount) {
        setDonationAmount(customEvent.detail.amount);
      }
      setShowDonationModal(true);
    };

    window.addEventListener('open-donation-modal', handleOpenModal);
    return () => window.removeEventListener('open-donation-modal', handleOpenModal);
  }, []);

  // Handle redirect parameters from Membership Form or Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldDonate = urlParams.get('donate') === 'true';
    const amount = urlParams.get('amount');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (shouldDonate) {
      if (amount) setDonationAmount(parseInt(amount, 10));
      setDonorInfo({
        name: name ? decodeURIComponent(name) : '',
        email: email ? decodeURIComponent(email) : '',
        phone: '',
        address: '',
        purpose: 'Membership Fee Contribution'
      });
      setDonationStep(2); // Since they filled out membership form, skip directly to payment step
      setShowDonationModal(true);
      window.history.replaceState({}, document.title, location.pathname);
    }

    const status = urlParams.get('donation_status');
    const sessionId = urlParams.get('session_id');
    const donationId = urlParams.get('donation_id');

    if (status === 'success' && sessionId && donationId) {
      const finishDonation = async () => {
        try {
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
          window.history.replaceState({}, document.title, location.pathname);
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
        window.history.replaceState({}, document.title, location.pathname);
      };
      cancelDonation();
    }
  }, [location.pathname]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showDonationModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // If modal opened, reset step to 1 unless there is a 'donate=true' in URL
      const urlParams = new URLSearchParams(window.location.search);
      const shouldDonate = urlParams.get('donate') === 'true';
      if (!shouldDonate) {
        setDonationStep(1);
      }
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
      setShowQRCode(false);
      setShowDonationModal(false);
      setDonationStatus({ 
        type: 'error', 
        message: 'Payment session expired. Please try again.' 
      });
    }
    return () => clearInterval(timer);
  }, [showQRCode, isPaid, timeLeft, paymentMethod]);

  // Reset timer on modal change
  useEffect(() => {
    if (showQRCode) {
      setTimeLeft(120);
    }
  }, [showQRCode]);

  // Sync donation stats from firestore
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    setIsDonating(true);
    const path = 'donations';
    try {
      let donationRef;
      try {
        donationRef = await addDoc(collection(db, path), {
          amount: donationAmount,
          donorName: donorInfo.name || 'Anonymous',
          donorEmail: donorInfo.email || '',
          donorPhone: donorInfo.phone || '',
          donorAddress: donorInfo.address || '',
          donationPurpose: donorInfo.purpose || 'General Social Welfare',
          status: 'pending',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        throw handleFirestoreError(err, OperationType.CREATE, path);
      }

      if (paymentMethod === 'razorpay') {
        // Call server to create Razorpay order
        const orderResponse = await window.fetch('/api/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: donationAmount,
            donationId: donationRef.id,
            donorName: donorInfo.name,
            donorEmail: donorInfo.email
          })
        });

        const orderData = await orderResponse.json();
        if (!orderResponse.ok || orderData.error) {
          throw new Error(orderData.error || "Failed to create Razorpay order");
        }

        // Check if mock order
        if (orderData.mock) {
          const confirmMock = window.confirm(
            `[DEMO MODE] Razorpay credentials are not configured in .env yet.\n\nWould you like to simulate a successful payment of ₹${donationAmount}?\n\nClick OK to simulate success, Cancel to simulate failure.`
          );

          if (confirmMock) {
            // Call verify with isMock flag
            const verifyResponse = await window.fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: orderData.id,
                razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
                razorpay_signature: "mock_signature",
                donationId: donationRef.id,
                isMock: true
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setShowDonationModal(false);
              setDonationStatus({
                type: 'success',
                message: `Thank you! Mock donation of ₹${donationAmount} received successfully.`
              });
            } else {
              throw new Error(verifyData.error || "Mock verification failed");
            }
          } else {
            setDonationStatus({
              type: 'error',
              message: 'Mock payment cancelled.'
            });
          }
          return;
        }

        // Real order flow - Load SDK
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Razorpay SDK failed to load. Check your internet connection.");
        }

        const keyId = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || '';

        const options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "MANGLA GAURI SEVA SANSTHAN",
          description: `Support Campaign: ${donorInfo.purpose}`,
          image: "https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1",
          order_id: orderData.id,
          handler: async function (response: any) {
            setIsDonating(true);
            try {
              const verifyResponse = await window.fetch('/api/verify-razorpay-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  donationId: donationRef.id,
                  isMock: false
                })
              });

              const verifyData = await verifyResponse.json();
              if (verifyData.success) {
                setShowDonationModal(false);
                setDonationStatus({
                  type: 'success',
                  message: `Thank you for donating ₹${donationAmount}! Your payment was verified.`
                });
              } else {
                throw new Error(verifyData.error || "Verification failed");
              }
            } catch (err: any) {
              console.error("Verification error:", err);
              setDonationStatus({
                type: 'error',
                message: `Payment successful but verification failed: ${err.message}`
              });
            } finally {
              setIsDonating(false);
            }
          },
          prefill: {
            name: donorInfo.name,
            email: donorInfo.email,
            contact: donorInfo.phone
          },
          theme: {
            color: "#ef4444"
          },
          modal: {
            ondismiss: function () {
              setIsDonating(false);
            }
          }
        };

        const rzpWindow = new (window as any).Razorpay(options);
        rzpWindow.open();

      } else {
        // Stripe flow
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
          try {
            await updateDoc(donationRef, { stripeSessionId: data.id });
          } catch (err) {
            throw handleFirestoreError(err, OperationType.UPDATE, `${path}/${donationRef.id}`);
          }
          window.location.href = data.url;
        } else {
          throw new Error(data.error || 'Failed to create checkout session');
        }
      }
    } catch (error) {
      console.error("Donation Flow Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setDonationStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsDonating(false);
    }
  };

  const handleUPIInitiate = async () => {
    setIsDonating(true);
    const path = 'donations';
    try {
      try {
        await addDoc(collection(db, path), {
          amount: donationAmount,
          donorName: donorInfo.name || 'Anonymous',
          donorEmail: donorInfo.email || '',
          donorPhone: donorInfo.phone || '',
          donorAddress: donorInfo.address || '',
          donationPurpose: donorInfo.purpose || 'General Social Welfare',
          status: 'succeeded',
          createdAt: serverTimestamp()
        });
        
        setShowQRCode(true);
      } catch (err) {
        throw handleFirestoreError(err, OperationType.CREATE, path);
      }
    } catch (error) {
      console.error("UPI Donation Save Error:", error);
      setDonationStatus({ type: 'error', message: 'Failed to record donation. Please try again.' });
    } finally {
      setIsDonating(false);
    }
  };

  const progressPercentage = donationStats.loaded 
    ? Math.min(100, Math.round((donationStats.current / donationStats.target) * 100))
    : 0;

  const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Top Utility Bar */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-slate-900 text-slate-300 text-xs flex items-center z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-end items-center">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[9px] mr-1 hidden sm:inline">Connect with us:</span>
            <a 
              href="https://www.facebook.com/profile.php?id=100064902391238" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-[#1877F2] flex items-center justify-center transition-all hover:scale-110 text-white"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://www.instagram.com/manglagaurisevasansthaan5/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-[#E1306C] flex items-center justify-center transition-all hover:scale-110 text-white"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://wa.me/919695712713" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-[#25D366] flex items-center justify-center transition-all hover:scale-110 text-white"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-10 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
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
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', path: '/' },
              { label: 'About Us', path: '/about' },
              { label: 'Our Activities', path: '/activities' },
              { label: 'Contact Us', path: '/contact' }
            ].map((item) => (
              <Link 
                key={item.label} 
                to={item.path} 
                className={`text-xs uppercase tracking-widest font-extrabold transition-all hover:scale-105 ${
                  isActiveLink(item.path) ? 'text-red-500 font-black' : 'text-slate-600 hover:text-red-500'
                }`}
                id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              to="/membership" 
              className={`text-xs uppercase tracking-widest font-extrabold transition-all ${
                isActiveLink('/membership') ? 'text-orange-500' : 'text-orange-600 hover:text-orange-700'
              }`}
            >
              Join Us
            </Link>
            <button 
              onClick={() => setShowDonationModal(true)}
              className="bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-100"
            >
              Charity with Us
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
            className="fixed inset-0 z-40 bg-white pt-32 overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Our Activities', path: '/activities' },
                { label: 'Contact Us', path: '/contact' }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-3xl font-serif font-black uppercase tracking-tighter ${
                    isActiveLink(item.path) ? 'text-red-500' : 'text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                to="/membership" 
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-serif font-black text-orange-500 uppercase tracking-tighter"
              >
                Join Us
              </Link>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowDonationModal(true);
                }}
                className="w-full bg-red-500 text-white py-4 rounded-2xl text-lg font-bold shadow-lg"
              >
                Charity with Us
              </button>

              {/* Social Media Connections */}
              <div className="w-full pt-6 mt-4 border-t border-slate-100 flex flex-col items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Connect With Us</span>
                <div className="flex items-center gap-4 justify-center">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100064902391238" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-lg"
                    title="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/manglagaurisevasansthaan5/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-full bg-[#E1306C] flex items-center justify-center text-white shadow-lg"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://wa.me/919695712713" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg"
                    title="WhatsApp"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content */}
      <div className="pt-24 min-h-[calc(100vh-280px)]">
        {children}
      </div>

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
                <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
                <Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link>
                <Link to="/activities" className="hover:text-red-500 transition-colors">Activities</Link>
                <Link to="/membership" className="hover:text-orange-500 transition-colors">Membership</Link>
                <Link to="/contact" className="hover:text-red-500 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
          <p className="text-sm">© 2026 Mangla Gauri Seva Sansthaan. All Rights Reserved.</p>
          <p className="text-[10px] mt-2 uppercase tracking-widest text-slate-600">Built for selfless community service in Lucknow</p>
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
                <Heart className="w-12 h-12 mb-4 animate-pulse" />
                <h3 className="text-3xl font-serif font-bold">Charity with Us</h3>
                <p className="text-red-100 mt-2">Your contribution supports our noble cause.</p>
              </div>
              
              <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                {isPaid ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-900">Donation Successful!</h4>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Thank you for your generous contribution. A receipt has been sent to your email.</p>
                    <button 
                      onClick={() => {
                        setShowDonationModal(false);
                        setIsPaid(false);
                        setShowQRCode(false);
                      }}
                      className="mt-6 bg-red-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : showQRCode ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4 space-y-6"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-red-50 text-red-600 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6">
                        UPI Payment Portal
                      </div>
                      
                      <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-slate-100 mb-4 inline-block relative">
                        <QRCodeSVG 
                          value={`upi://pay?pa=manglagauri@sbi&pn=MANGLA%20GAURI%20SEVA%20SANSTHAN&am=${donationAmount}&cu=INR`}
                          size={200}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                      
                      <div className="text-slate-900 font-serif font-extrabold text-3xl mb-4">
                        ₹{donationAmount.toLocaleString()}
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-w-sm w-full mb-6">
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">To complete donation:</p>
                        <ol className="text-left text-xs text-slate-500 list-decimal pl-4 mt-2 space-y-1">
                          <li>Open GooglePay, PhonePe, Paytm, or BHIM app</li>
                          <li>Choose the scan QR code option</li>
                          <li>Scan the QR code shown above</li>
                          <li>Confirm payment of ₹{donationAmount}</li>
                        </ol>
                        <p className="text-[10px] text-slate-400 mt-3 text-center">Scan to pay with any UPI app</p>
                      </div>

                      <div className="w-full mt-2 space-y-4">
                        <a 
                          href={`upi://pay?pa=manglagauri@sbi&pn=MANGLA%20GAURI%20SEVA%20SANSTHAN&am=${donationAmount}&cu=INR`}
                          className="w-full bg-slate-100 text-slate-900 py-3.5 rounded-xl font-bold text-sm text-center block md:hidden hover:bg-slate-200 transition-colors"
                        >
                          Open in UPI App
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ) : donationStep === 1 ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setDonationStep(2);
                    }}
                    className="space-y-6"
                  >
                    {/* Membership Quick Link Card */}
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3">
                      <span className="p-1.5 bg-orange-100 rounded-xl text-orange-600 font-black text-[10px] uppercase shrink-0">🌟 JOIN NGO</span>
                      <div className="text-xs text-orange-800 leading-relaxed font-medium">
                        <p className="font-bold mb-0.5">Want to become an official NGO Member instead?</p>
                        <p className="text-orange-700 mb-2">Become a voting member, participate in internal polls, and support us regularly.</p>
                        <Link 
                          to="/membership" 
                          onClick={() => setShowDonationModal(false)}
                          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-lg transition-all"
                        >
                          Fill Membership Form
                        </Link>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 px-2.5 py-1 bg-red-50 rounded-full inline-block mb-2">
                        STEP 1 OF 2: DONOR DETAILS
                      </span>
                      <h4 className="text-lg font-serif font-black text-slate-900 leading-tight">Identify Your Contribution</h4>
                      <p className="text-xs text-slate-500 mt-1">Provide your details to initiate a transparent donation receipt.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-widest font-black text-slate-400">Full Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          required
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-sm font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs uppercase tracking-widest font-black text-slate-400">Phone Number <span className="text-red-500">*</span></label>
                          <input 
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={donorInfo.phone}
                            onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                            placeholder="10-digit Mobile Number"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-sm font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs uppercase tracking-widest font-black text-slate-400">Email Address <span className="text-red-500">*</span></label>
                          <input 
                            type="email"
                            required
                            value={donorInfo.email}
                            onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-sm font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-widest font-black text-slate-400">Communication Address <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          required
                          value={donorInfo.address}
                          onChange={(e) => setDonorInfo({ ...donorInfo, address: e.target.value })}
                          placeholder="Full Mailing Address with PIN code"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-sm font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-widest font-black text-slate-400">Donation Purpose / Campaign</label>
                        <div className="relative">
                          <select
                            value={donorInfo.purpose}
                            onChange={(e) => setDonorInfo({ ...donorInfo, purpose: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-sm font-semibold appearance-none pr-10 text-slate-800"
                          >
                            <option value="General Social Welfare">General Social Welfare</option>
                            <option value="Blood Donation Camps">Blood Donation Camps</option>
                            <option value="Hunger Relief Drives">Hunger Relief Drives</option>
                            <option value="Children Free Education">Children Free Education</option>
                            <option value="Winter Blankets Distribution">Winter Blankets Distribution</option>
                            <option value="Support for Specially-Abled">Support for Specially-Abled</option>
                            <option value="Environmental & Sanitation Drives">Environmental & Sanitation Drives</option>
                            <option value="Membership Fee Contribution">Membership Fee Contribution</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-red-500 text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-100"
                    >
                      Proceed to Payment Step
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => setDonationStep(1)}
                          className="text-xs text-red-500 hover:text-red-600 font-black uppercase tracking-wider flex items-center gap-1.5 text-left"
                        >
                          <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                          Back to Details
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 px-2.5 py-1 bg-red-50 rounded-full inline-block">
                          STEP 2 OF 2: PAYMENT
                        </span>
                      </div>

                      {/* Donor summary card */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5 text-xs text-slate-600">
                        <p><strong className="text-slate-800 font-semibold">Donor Name:</strong> {donorInfo.name}</p>
                        <p><strong className="text-slate-800 font-semibold">Contact:</strong> {donorInfo.phone} | {donorInfo.email}</p>
                        <p><strong className="text-slate-800 font-semibold">Address:</strong> {donorInfo.address}</p>
                        <p><strong className="text-slate-800 font-semibold">Campaign:</strong> <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">{donorInfo.purpose}</span></p>
                      </div>

                      <div>
                        <label className="text-xs uppercase tracking-widest font-bold text-slate-400 block mb-2">Enter Amount (INR) / राशि दर्ज करें</label>
                        <div className="relative mb-3.5">
                          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                            <span className="text-slate-500 font-extrabold text-lg">₹</span>
                          </div>
                          <input 
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter Amount"
                            value={donationAmount === 0 ? '' : donationAmount.toString()}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              const sanitized = val.replace(/^0+/, '');
                              setDonationAmount(sanitized === '' ? 0 : parseInt(sanitized, 10));
                            }}
                            className="w-full py-4.5 pl-10 pr-4 rounded-2xl font-extrabold border-2 border-slate-100 focus:border-red-500 focus:outline-none text-slate-800 text-xl transition-colors shadow-inner"
                          />
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[500, 1000, 2000, 5000, 10000].map(amt => (
                            <button 
                              key={amt}
                              onClick={() => setDonationAmount(amt)}
                              className={`py-2 rounded-xl font-bold border transition-all text-xs ${
                                donationAmount === amt 
                                  ? 'bg-red-500 border-red-500 text-white' 
                                  : 'bg-white border-slate-150 text-slate-600 hover:border-red-300'
                              }`}
                            >
                              ₹{amt}
                            </button>
                          ))}
                        </div>
                        {donationAmount > 0 && donationAmount < 50 && (
                          <p className="text-xs text-red-500 font-bold mt-1.5">Minimum donation amount is ₹50</p>
                        )}
                      </div>

                      <button 
                        onClick={handleUPIInitiate}
                        disabled={isDonating || donationAmount < 50}
                        className="w-full bg-red-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDonating ? (
                          <span className="flex items-center gap-2 justify-center font-black uppercase tracking-[0.1em] text-xs">
                            <Loader2 className="w-4 h-4 animate-spin" /> Initiating Payment...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 justify-center font-black uppercase tracking-[0.1em] text-xs">
                            Proceed to Pay ₹{donationAmount} / भुगतान करें
                          </span>
                        )}
                      </button>
                      <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-semibold">
                        Secure UPI QR Code Payment Option
                      </p>
                    </div>
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
