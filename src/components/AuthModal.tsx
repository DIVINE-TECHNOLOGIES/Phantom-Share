import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword } from '../lib/firebase';
import { PhantomLogo } from './PhantomLogo';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, openAuthModal } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(authMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Sync mode with context
  React.useEffect(() => {
    setMode(authMode);
    setError(null);
    setResetSuccess(false);
  }, [authMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResetSuccess(false);

    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password);
        closeAuthModal();
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email.trim(), password, fullName.trim());
        closeAuthModal();
      } else if (mode === 'forgot') {
        await resetPassword(email.trim());
        setResetSuccess(true);
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication error';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try logging in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 animate-in fade-in zoom-in duration-200 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <PhantomLogo size="md" showText={true} subtitle={true} separateWords={true} />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-slate-100 mt-2">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs">
            {mode === 'login' && 'Access your encrypted vault and processed documents.'}
            {mode === 'signup' && 'Enjoy private zero-retention conversions and cloud storage.'}
            {mode === 'forgot' && "Enter your email and we'll send a password recovery link."}
          </p>
        </div>

        {/* Tabs: Log In vs Sign Up */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Reset Success Alert */}
        {resetSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span className="leading-relaxed">
              Password reset link sent! Check your inbox to reset your password.
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Sign In with Google Button (Prominent) */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750 text-gray-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {/* Official Google 'G' Logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-gray-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                  or with email
                </span>
              </div>
            </>
          )}

          {/* Full Name field for Sign Up */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#E5322D] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/30 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#E5322D] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/30 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          {mode !== 'forgot' && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-xs font-semibold text-[#E5322D] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#E5322D] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-[#E5322D] hover:bg-[#c92823] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Log In to Phantom Share'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info & toggle links */}
        <div className="flex flex-col items-center text-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
          {mode === 'forgot' ? (
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className="font-bold text-[#E5322D] hover:underline"
            >
              ← Back to Log In
            </button>
          ) : mode === 'login' ? (
            <div>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setError(null); }}
                className="font-bold text-[#E5322D] hover:underline"
              >
                Sign up free
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError(null); }}
                className="font-bold text-[#E5322D] hover:underline"
              >
                Log in
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>End-to-end encrypted session • Zero server retention</span>
          </div>
        </div>

      </div>
    </div>
  );
};
