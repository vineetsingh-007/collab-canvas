import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [resending, setResending] = useState(false);
  const { signup, resendVerification } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      setSignupComplete(true);
      toast.success('Account created! Check your email for a verification link.');
    } catch (err: any) {
      toast.error(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(email);
      toast.success('Verification email resent! Check your inbox.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  if (signupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-6">
              We sent a verification link to <strong className="text-foreground">{email}</strong>. Click the link to activate your account.
            </p>
            <Button onClick={handleResend} disabled={resending} variant="outline" className="w-full h-11 rounded-xl mb-3">
              <RefreshCw className={`w-4 h-4 mr-2 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Resending...' : 'Resend verification email'}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Already verified? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold text-primary">CollabCore</Link>
            <p className="text-muted-foreground mt-2">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="pl-10 h-11 rounded-xl" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 h-11 rounded-xl" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Confirm password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 h-11 rounded-xl" />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary text-primary-foreground">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
