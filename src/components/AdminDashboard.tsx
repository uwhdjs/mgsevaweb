import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  IndianRupee, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Users
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// Use same image references as App.tsx
const ADMIN_IMAGES = {
  logo: "https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1",
  gallery: [
    "https://lh3.googleusercontent.com/d/1_FXGtiLbfxIKOTIXGAUKumrQuGa_jYyL",
    "https://lh3.googleusercontent.com/d/12UaXzNet0ZzVVEDWOMXk1QuJfv5ESNOS",
    "https://lh3.googleusercontent.com/d/1g-ktQGifp3_fcXtEVn8gr0IeDxmrM5_-",
    "https://lh3.googleusercontent.com/d/1rrRZ13jmL4GLTXBDt4UnqUleHEQRpkWD",
    "https://lh3.googleusercontent.com/d/1H_BSJJQqzMwPIb6rPdnx2CbK6wEIDr5k",
    "https://lh3.googleusercontent.com/d/1B1pWQ_nkMLwMJGUfzTp7KnRVNjaeUmSH",
    "https://lh3.googleusercontent.com/d/1Cpk5xmHMMJkjItkbrenv6fE-YzrQi9Ax",
    "https://lh3.googleusercontent.com/d/1HhUPBIIPkAapAHotXrHVS6oNcBh0KWEO",
    "https://lh3.googleusercontent.com/d/1WwVv_KCksvBZVyyugCc0LWaKDOb5zegl",
    "https://lh3.googleusercontent.com/d/1HMY4Foq8onQJbTTZ-S1YlwWSvgyfOvD3",
    "https://lh3.googleusercontent.com/d/1oMs7qizlDQuaacqWMI2_eeK9klsILD38",
    "https://lh3.googleusercontent.com/d/1nagW4m1xGi4WSACn9OGlSxiKobOg6NL2",
    "https://lh3.googleusercontent.com/d/17v_5m2wDqGHeThg5Ba8gBqheh8z1SSz-",
    "https://lh3.googleusercontent.com/d/1kR_rf0EMOoooTP9LYRzhVzTxN5Bym21O",
    "https://lh3.googleusercontent.com/d/1ZTtCPrerpI_O1kNkYsl1-o6sauydzfcw",
    "https://lh3.googleusercontent.com/d/1plBN9RKgwSQHNdGd97uFOt8zibQ917DO",
    "https://lh3.googleusercontent.com/d/1v9E0atC8sJxTdTBTtYp-QKZospj9z4dU",
    "https://lh3.googleusercontent.com/d/16xpzfYrZSpEt7An5bJ-42o9DHc2Io6uz",
    "https://lh3.googleusercontent.com/d/1KAkkFGRQA_m7TeHnQwaUQKVIH029rQ6U",
    "https://lh3.googleusercontent.com/d/1WOXeu4naHk4NUlV_d-fN_A7pb14aAaH3"
  ]
};

interface Message {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt: any;
}

interface Donation {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: any;
  stripeSessionId?: string;
}

interface Member {
  id: string;
  name: string;
  fatherHusbandName: string;
  gender: string;
  maritalStatus: string;
  dob: string;
  education: string;
  profession: string;
  address: string;
  bloodGroup: string;
  mobile: string;
  altMobile: string;
  email: string;
  membershipOption: string;
  interests: string[];
  suggestions: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'donations' | 'gallery' | 'members'>('overview');
  const [messages, setMessages] = useState<Message[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const loadDashboardData = async () => {
    const sessionId = sessionStorage.getItem('adminSessionId');
    if (!sessionId) {
      window.location.href = '/admin/login';
      return;
    }

    try {
      setError(null);
      const [messagesRes, donationsRes, membersRes] = await Promise.all([
        window.fetch('/api/admin/messages', { headers: { 'x-admin-session': sessionId } }),
        window.fetch('/api/admin/donations', { headers: { 'x-admin-session': sessionId } }),
        window.fetch('/api/admin/members', { headers: { 'x-admin-session': sessionId } })
      ]);

      if (messagesRes.status === 403 || donationsRes.status === 403 || membersRes.status === 403) {
        sessionStorage.removeItem('isAdminAuthenticated');
        sessionStorage.removeItem('adminSessionId');
        window.location.href = '/admin/login';
        return;
      }

      if (!messagesRes.ok || !donationsRes.ok) {
        const errorRes = !messagesRes.ok ? messagesRes : donationsRes;
        const errorData = await errorRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to load data from server.');
      }

      const msgs = await messagesRes.json();
      const dons = await donationsRes.json();
      const mems = await membersRes.json();

      if (Array.isArray(msgs)) setMessages(msgs);
      if (Array.isArray(dons)) setDonations(dons);
      if (Array.isArray(mems)) setMembers(mems);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const totalDonations = donations
    .filter(d => d.status === 'succeeded')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { label: 'Total Funds', value: `₹${totalDonations.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-600' },
    { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'text-blue-600' },
    { label: 'Members', value: members.length, icon: Users, color: 'text-purple-600' },
    { label: 'Successful Payments', value: donations.filter(d => d.status === 'succeeded').length, icon: CheckCircle2, color: 'text-indigo-600' },
    { label: 'Pending Orders', value: donations.filter(d => d.status === 'pending').length, icon: Clock, color: 'text-orange-600' },
  ];

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const sessionId = sessionStorage.getItem('adminSessionId');
      try {
        const response = await window.fetch(`/api/admin/messages/${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-session': sessionId || '' }
        });
        if (response.ok) {
          setMessages(prev => prev.filter(m => m.id !== id));
        } else {
          alert("Failed to delete message.");
        }
      } catch (err) {
        console.error('Error deleting message:', err);
      }
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      const sessionId = sessionStorage.getItem('adminSessionId');
      try {
        const response = await window.fetch(`/api/admin/donations/${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-session': sessionId || '' }
        });
        if (response.ok) {
          setDonations(prev => prev.filter(d => d.id !== id));
        } else {
          alert("Failed to delete donation record.");
        }
      } catch (err) {
        console.error('Error deleting donation:', err);
      }
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member application?')) {
      const sessionId = sessionStorage.getItem('adminSessionId');
      try {
        const response = await window.fetch(`/api/admin/members/${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-session': sessionId || '' }
        });
        if (response.ok) {
          setMembers(prev => prev.filter(m => m.id !== id));
        } else {
          alert("Failed to delete member application.");
        }
      } catch (err) {
        console.error('Error deleting member:', err);
      }
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    // Handle Firestore Timestamp or ISO string
    if (dateValue._seconds) return new Date(dateValue._seconds * 1000).toLocaleDateString();
    return new Date(dateValue).toLocaleDateString();
  };

  const formatDateTime = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    if (dateValue._seconds) return new Date(dateValue._seconds * 1000).toLocaleString();
    return new Date(dateValue).toLocaleString();
  };

  const chartData = donations
    .filter(d => d.status === 'succeeded' && d.donorName)
    .slice(0, 10)
    .reverse()
    .map(d => ({
      name: (d.donorName || 'Anonymous').split(' ')[0],
      amount: d.amount
    }));

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDonations = donations.filter(d => 
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    m.mobile.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full shadow-lg shadow-orange-500/20"
        />
        <p className="text-slate-400 font-medium animate-pulse text-sm">Synchronizing dashboard data...</p>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden p-1 border border-slate-100">
            <img src={ADMIN_IMAGES.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">Admin<span className="text-orange-600">Panel</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Mangla Gauri</p>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'donations', label: 'Donations', icon: IndianRupee },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'gallery', label: 'Activity Photos', icon: ImageIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <button 
          onClick={() => {
            sessionStorage.removeItem('adminSessionId');
            sessionStorage.removeItem('isAdminAuthenticated');
            window.location.href = '/admin/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all font-semibold"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-slate-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[110] lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <LayoutDashboard className="text-orange-600" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">Control Center</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col gap-1 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-bold shadow-sm max-w-sm"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-500" />
                      <span>Sync Warning</span>
                      <button onClick={() => { setError(null); loadDashboardData(); }} className="ml-auto underline decoration-red-500/30 hover:text-red-900">Retry</button>
                    </div>
                    <p className="font-mono text-[9px] opacity-70 leading-tight line-clamp-2">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all w-full md:w-64 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                        <stat.icon size={24} className={stat.color} />
                      </div>
                      <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6">Recent Successful Donations</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="amount" fill="#ea580c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Latest Messages</h3>
                    <button onClick={() => setActiveTab('messages')} className="text-orange-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-4 flex-1">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-60">
                        <MessageSquare size={32} />
                        <p className="text-xs font-medium italic">No messages yet.</p>
                      </div>
                    ) : messages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black group-hover:bg-white group-hover:shadow-sm">
                          {msg.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate leading-tight">{msg.name}</p>
                          <p className="text-slate-500 text-xs truncate mt-1 leading-relaxed opacity-80">{msg.message}</p>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 whitespace-nowrap mt-1">
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Photos Section */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Recent Service Moments</h3>
                    <p className="text-slate-400 text-xs mt-1">Photos showcasing our ground activities in Lucknow</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('gallery')}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-all border border-slate-200 flex items-center gap-2"
                  >
                    View All Gallery <TrendingUp size={14} className="text-orange-500" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {ADMIN_IMAGES.gallery.slice(0, 6).map((img, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100"
                    >
                      <img src={img} alt="Activity" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

            {activeTab === 'donations' && (
              <motion.div
                key="donations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Donor</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stripe ID</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDonations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic font-medium">
                            No donations found.
                          </td>
                        </tr>
                      ) : filteredDonations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-orange-50/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 leading-none">{donation.donorName || 'Anonymous'}</span>
                              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-1.5">{donation.donorEmail || 'No Email'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">
                              ₹{donation.amount.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              donation.status === 'succeeded' ? 'bg-emerald-100 text-emerald-800' :
                              donation.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {donation.status === 'succeeded' ? <CheckCircle2 size={12} /> : 
                               donation.status === 'pending' ? <Clock size={12} /> : 
                               <AlertCircle size={12} />}
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs font-medium text-slate-500">{formatDate(donation.createdAt)}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 p-1 rounded group-hover:bg-white transition-colors">
                              {donation.stripeSessionId || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => handleDeleteDonation(donation.id)}
                              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
              {filteredMessages.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-400 italic">No messages found.</p>
                </div>
              ) : filteredMessages.map((msg) => (
                <div key={msg.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                        {msg.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{msg.name}</h4>
                        <p className="text-slate-500 text-xs italic font-serif">{msg.email || msg.phone}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 flex-1 mb-4">
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{msg.subject || 'No Subject'}</span>
                    <span>{formatDateTime(msg.createdAt)}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900">Activity Gallery</h3>
                  <p className="text-slate-500 mt-2">Visual records of our social impact initiatives</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {ADMIN_IMAGES.gallery.map((img, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-100 group relative"
                    >
                      <img src={img} alt="Activity" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p className="text-white text-xs font-bold uppercase tracking-widest">Moment of Service #{i + 1}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Info</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Option</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interests</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic font-medium">
                            No member applications found.
                          </td>
                        </tr>
                      ) : filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-purple-50/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{member.name}</span>
                              <span className="text-slate-500 text-xs">{member.mobile}</span>
                              {member.email && <span className="text-slate-400 text-[10px]">{member.email}</span>}
                              <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
                                <p>F/H Name: <span className="text-slate-600 font-bold">{member.fatherHusbandName}</span></p>
                                <p>Address: <span className="text-slate-600 font-bold">{member.address}</span></p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                              member.membershipOption === 'Basic Membership' 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {member.membershipOption}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {member.interests && member.interests.length > 0 ? (
                                member.interests.map((interest, idx) => (
                                  <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                    {interest}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-300 text-xs italic">No interests specified</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">{formatDate(member.createdAt)}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <button 
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  </div>
);
}
