import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, CheckCircle, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const masked = local.length <= 2 ? local[0] + '***' : local[0] + '***' + local.slice(-1);
  return `${masked}@${domain}`;
};

const CountdownRing = ({ seconds }: { seconds: number }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / 60) * circumference;
  return (
    <span className="relative inline-flex items-center justify-center w-9 h-9">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
        <circle cx="18" cy="18" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
      </svg>
      <span className="text-xs font-semibold text-foreground">{seconds}</span>
    </span>
  );
};

const Sparkles = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
        style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, -12, -20] }}
        transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity, repeatDelay: 2 }}
      />
    ))}
  </div>
);

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 20, label: 'Weak', color: 'bg-destructive' };
  if (score <= 2) return { score: 40, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score: 60, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { score: 80, label: 'Strong', color: 'bg-emerald-500' };
  return { score: 100, label: 'Very Strong', color: 'bg-success' };
};

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onResetPassword: (otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  onResendOTP: () => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
  onSuccess?: () => void;
}

export const ResetPasswordModal = ({
  open, onOpenChange, email, onResetPassword, onResendOTP, loading = false, onSuccess,
}: ResetPasswordModalProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [shake, setShake] = useState(false);

  const masked = useMemo(() => maskEmail(email), [email]);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const watchedPassword = watch('newPassword', '');
  const strength = useMemo(() => getPasswordStrength(watchedPassword), [watchedPassword]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (!open) { setOtp(''); setError(''); setResetComplete(false); reset(); }
  }, [open, reset]);

  const currentStep = otp.length === 6 ? 2 : 1;

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (otp.length !== 6) { setError('Please enter the 6-digit code'); return; }
    setError(''); setIsResetting(true);
    const result = await onResetPassword(otp, data.newPassword);
    setIsResetting(false);
    if (result.success) setResetComplete(true);
    else { setError(result.error || 'Reset failed. Please try again.'); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  const handleResend = async () => {
    setIsResending(true); setError('');
    const result = await onResendOTP();
    setIsResending(false);
    if (result.success) setResendCooldown(60);
    else setError(result.error || 'Failed to resend code. Please try again.');
  };

  const handleSuccess = () => { onOpenChange(false); onSuccess?.(); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {resetComplete ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center space-y-6 py-4 relative">
              <Sparkles />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-success" />
              </motion.div>
              <div className="space-y-2">
                <DialogTitle className="text-xl">Password reset!</DialogTitle>
                <DialogDescription>Your password has been successfully reset. You can now log in with your new password.</DialogDescription>
              </div>
              <Button variant="gradient" className="w-full" onClick={handleSuccess}>Go to Login</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <DialogHeader className="text-center space-y-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <KeyRound className="w-7 h-7 text-primary" />
                </motion.div>
                <div className="space-y-3">
                  <DialogTitle className="text-xl">Reset your password</DialogTitle>
                  <DialogDescription>Enter the code sent to</DialogDescription>
                  <Badge variant="secondary" className="text-sm font-mono px-3 py-1">{masked}</Badge>
                </div>
              </DialogHeader>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 justify-center py-4">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>{step}</div>
                    <span className={`text-xs font-medium hidden sm:inline ${currentStep >= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step === 1 ? 'Enter Code' : 'New Password'}
                    </span>
                    {step === 1 && <div className="w-8 h-px bg-border" />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <motion.div className="flex justify-center" animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}>
                    <InputOTP maxLength={6} value={otp} onChange={(v) => { setOtp(v); setError(''); }} disabled={isResetting || loading}>
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (<InputOTPSlot key={i} index={i} />))}
                      </InputOTPGroup>
                    </InputOTP>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {currentStep >= 2 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="newPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" disabled={isResetting || loading} {...register('newPassword')} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={isResetting || loading}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {watchedPassword && (
                          <div className="space-y-1">
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <motion.div className={`h-full rounded-full ${strength.color}`} initial={{ width: 0 }} animate={{ width: `${strength.score}%` }} transition={{ duration: 0.3 }} />
                            </div>
                            <p className={`text-xs ${strength.score <= 40 ? 'text-destructive' : 'text-muted-foreground'}`}>{strength.label}</p>
                          </div>
                        )}
                        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" disabled={isResetting || loading} {...register('confirmPassword')} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={isResetting || loading}>
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive text-center">{error}</motion.p>}

                <Button type="submit" variant="gradient" className="w-full" disabled={otp.length !== 6 || isResetting || loading}>
                  {isResetting || loading ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting...</>) : 'Reset Password'}
                </Button>

                <div className="relative pt-4">
                  <div className="absolute top-0 left-0 right-0 h-px bg-border" />
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                    {resendCooldown > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <CountdownRing seconds={resendCooldown} />
                        <span className="text-sm text-muted-foreground">Resend available soon</span>
                      </div>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" onClick={handleResend} disabled={isResending}>
                        {isResending ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</>) : 'Resend Code'}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
