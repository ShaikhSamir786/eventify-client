import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword, useResetPassword, getErrorMessage } from '@/hooks/api/useAuth';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';

const forgotPasswordSchema = z.object({ email: z.string().email('Please enter a valid email') });
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { forgotPassword, loading, error } = useForgotPassword();
  const { resetPassword, loading: resetLoading } = useResetPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      setSentEmail(data.email);
      setShowResetModal(true);
      toast({
        title: 'Code sent!',
        description: 'Check your email for the reset code.',
      });
    } else {
      toast({
        title: 'Failed to send reset email',
        description: result.error || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (otp: string, newPassword: string) => {
    const result = await resetPassword({ email: sentEmail, otp, newPassword });
    return { success: result.success, error: result.error };
  };

  const handleResendOTP = async () => {
    const result = await forgotPassword(sentEmail);
    return { success: result.success, error: result.error };
  };

  const handleResetSuccess = () => {
    navigate('/login');
  };

  const apiErrorMessage = error ? getErrorMessage(error) : null;

  return (
    <>
      <AuthLayout title="Forgot password?" subtitle="No worries, we'll send you reset instructions">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="john@example.com" className="pl-10" disabled={loading} {...register('email')} />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          {apiErrorMessage && <p className="text-sm text-destructive">{apiErrorMessage}</p>}
          <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</> : 'Send reset code'}
          </Button>
        </form>
        <div className="text-center mt-6">
          <Button variant="ghost" asChild><Link to="/login"><ArrowLeft className="w-4 h-4 mr-2" />Back to login</Link></Button>
        </div>
      </AuthLayout>

      <ResetPasswordModal
        open={showResetModal}
        onOpenChange={setShowResetModal}
        email={sentEmail}
        onResetPassword={handleResetPassword}
        onResendOTP={handleResendOTP}
        loading={resetLoading}
        onSuccess={handleResetSuccess}
      />
    </>
  );
};

export default ForgotPassword;
