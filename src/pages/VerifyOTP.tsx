import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useVerifyOTP, useResendOTP, getErrorMessage } from '@/hooks/api/useAuth';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email;
  
  const { verifyOTP, loading: verifying } = useVerifyOTP();
  const { resendOTP, loading: resending } = useResendOTP();

  useEffect(() => { if (!email) navigate('/register'); }, [email, navigate]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else setCanResend(true);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length === 6) {
      const result = await verifyOTP({ email, otp });
      if (result.success) {
        toast({ title: 'Email verified!', description: 'Your account has been verified. Please log in.' });
        navigate('/login');
      } else {
        toast({
          title: 'Verification failed',
          description: result.error || 'Invalid or expired code',
          variant: 'destructive',
        });
      }
    }
  };

  const handleResend = async () => {
    const result = await resendOTP(email);
    if (result.success) {
      toast({ title: 'Code resent!', description: 'A new verification code has been sent to your email.' });
      setCountdown(60);
      setCanResend(false);
    } else {
      toast({
        title: 'Failed to resend',
        description: result.error || 'Could not resend the code',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`Enter the 6-digit code sent to ${email}`}>
      <div className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button variant="gradient" className="w-full" onClick={handleVerify} disabled={otp.length !== 6 || verifying}>
          {verifying ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify email'}
        </Button>
        <div className="text-center">
          {canResend ? (
            <Button variant="ghost" onClick={handleResend} disabled={resending}>
              {resending ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />Resending...</> : <><RefreshCw className="w-4 h-4 mr-2" />Resend code</>}
            </Button>
          ) : <p className="text-sm text-muted-foreground">Resend code in <span className="text-primary font-medium">{countdown}s</span></p>}
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
