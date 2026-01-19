import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword, getErrorMessage } from '@/hooks/api/useAuth';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({ email: z.string().email('Please enter a valid email') });
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { forgotPassword, loading, error } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      setSentEmail(data.email);
      setEmailSent(true);
    } else {
      toast({
        title: 'Failed to send reset email',
        description: result.error || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const apiErrorMessage = error ? getErrorMessage(error) : null;

  if (emailSent) {
    return (
      <AuthLayout title="Check your email" subtitle={`We've sent a password reset code to ${sentEmail}`}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-muted-foreground">Enter the code to reset your password.</p>
          <Button variant="gradient" className="w-full" onClick={() => navigate('/reset-password', { state: { email: sentEmail } })}>
            Enter Reset Code
          </Button>
          <Button variant="ghost" asChild><Link to="/login"><ArrowLeft className="w-4 h-4 mr-2" />Back to login</Link></Button>
        </div>
      </AuthLayout>
    );
  }

  return (
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
  );
};

export default ForgotPassword;
