import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, CheckCircle, Mail } from 'lucide-react';

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
  open,
  onOpenChange,
  email,
  onVerify,
  onResend,
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

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setOtp('');
      setError('');
      setVerified(false);
    }
  }, [open]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setError('');
    setIsVerifying(true);

    const result = await onVerify(otp);

    setIsVerifying(false);

    if (result.success) {
      setVerified(true);
    } else {
      setError(result.error || 'Verification failed. Please try again.');
      setOtp('');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    const result = await onResend();

    setIsResending(false);

    if (result.success) {
      setResendCooldown(60);
    } else {
      setError(result.error || 'Failed to resend code. Please try again.');
    }
  };

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  if (verified) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl">{successTitle}</DialogTitle>
              <DialogDescription>{successDescription}</DialogDescription>
            </div>
            <Button variant="gradient" className="w-full" onClick={handleSuccess}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>
              {description || `We've sent a 6-digit code to ${email}. Enter it below to continue.`}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError('');
              }}
              disabled={isVerifying || loading}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            variant="gradient"
            className="w-full"
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying || loading}
          >
            {isVerifying || loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
