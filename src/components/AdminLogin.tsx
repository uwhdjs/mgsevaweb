import React, { useState } from 'react';
import { ShieldAlert, LogIn, User, Lock, Info, Loader2, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../App';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const isAuth = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    const hasSession = !!sessionStorage.getItem('adminSessionId');
    if (isAuth && hasSession) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Core admin credentials as requested by user
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'sansthan@2024';
    
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setError('Invalid username or password. Access denied.');
      setLoading(false);
      return;
    }

    try {
      const response = await window.fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('adminSessionId', data.sessionId);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      setError(`Login failed: ${err.message || 'Server connection error.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if it's the specific admin email
      if (user.email === 'uwhdjs152@gmail.com') {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        // We'll also tell the backend to create a session for us
        const response = await window.fetch('/api/admin/login-firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, email: user.email })
        });
        const data = await response.json();
        if (data.success) {
          sessionStorage.setItem('adminSessionId', data.sessionId);
          navigate('/admin');
        } else {
          setError(data.error || 'Backend session creation failed.');
        }
      } else {
        await auth.signOut();
        setError('Access denied. This Google account is not authorized as an administrator.');
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError(`Google Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-600/20">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username" 
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-sans"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password" 
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-sans"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-orange-600/20"
          >
            {loading ? <LogIn className="animate-pulse" size={20} /> : <LogIn size={20} />}
            Login to Admin Panel
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs leading-relaxed"
            >
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500 font-bold">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Admin Google Login
          </button>
        </form>

        <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-widest font-bold">
          System Secure & Encrypted
        </p>
      </motion.div>
    </div>
  );
}

