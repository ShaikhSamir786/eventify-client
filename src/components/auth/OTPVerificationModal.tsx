import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Mail } from 'lucide-react';

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
      <motion.div key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
        style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, -12, -20] }}
        transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity, repeatDelay: 2 }}
      />
    ))}
  </div>
);

interface OTPVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: (otp: string) => Promise<{ success: boolean; error?: string }>;
  onResend: () => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
  title?: string;
  description?: string;
  successTitle?: string;
  successDescription?: string;
  onSuccess?: () => void;
}

export const OTPVerificationModal = ({
  open, onOpenChange, email, onVerify, onResend,
  loading = false,
  title = 'Verify your email',
  description,
  successTitle = 'Verification successful!',
  successDescription = 'Your email has been verified.',
  onSuccess,
}: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [shake, setShake] = useState(false);

  const masked = useMemo(() => maskEmail(email), [email]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (!open) { setOtp(''); setError(''); setVerified(false); }
  }, [open]);

  const handleVerify = async () => {
    if (otp.length !== 6) { setError('Please enter the 6-digit code'); return; }
    setError(''); setIsVerifying(true);
    const result = await onVerify(otp);
    setIsVerifying(false);
    if (result.success) { setVerified(true); }
    else { setError(result.error || 'Verification failed. Please try again.'); setOtp(''); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  const handleResend = async () => {
    setIsResending(true); setError('');
    const result = await onResend();
    setIsResending(false);
    if (result.success) setResendCooldown(60);
    else setError(result.error || 'Failed to resend code. Please try again.');
  };

  const handleSuccess = () => { onOpenChange(false); onSuccess?.(); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {verified ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center space-y-6 py-4 relative">
              <Sparkles />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-success" />
              </motion.div>
              <div className="space-y-2">
                <DialogTitle className="text-xl">{successTitle}</DialogTitle>
                <DialogDescription>{successDescription}</DialogDescription>
              </div>
              <Button variant="gradient" className="w-full" onClick={handleSuccess}>Continue</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <DialogHeader className="text-center space-y-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7 text-primary" />
                </motion.div>
                <div className="space-y-3">
                  <DialogTitle className="text-xl">{title}</DialogTitle>
                  <DialogDescription>
                    {description || "We've sent a 6-digit code to"}
                  </DialogDescription>
                  {!description && (
                    <Badge variant="secondary" className="text-sm font-mono px-3 py-1">{masked}</Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6 py-5">
                <motion.div className="flex justify-center" animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}>
                  <InputOTP maxLength={6} value={otp} onChange={(v) => { setOtp(v); setError(''); }} disabled={isVerifying || loading}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (<InputOTPSlot key={i} index={i} />))}
                    </InputOTPGroup>
                  </InputOTP>
                </motion.div>

                {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive text-center">{error}</motion.p>}

                <Button variant="gradient" className="w-full" onClick={handleVerify} disabled={otp.length !== 6 || isVerifying || loading}>
                  {isVerifying || loading ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</>) : 'Verify Code'}
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
                      <Button variant="ghost" size="sm" onClick={handleResend} disabled={isResending}>
                        {isResending ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</>) : 'Resend Code'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
