import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChangePassword } from '@/hooks/api/useChangePassword';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UPDATE_PROFILE } from '@/lib/graphql/mutations/profile';
import {
  User, Mail, Shield, Lock, LogOut, Calendar, CheckCircle, Eye, EyeOff, Loader2, Pencil, X as XIcon,
} from 'lucide-react';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { changePassword, loading: changingPassword } = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState(user?.firstName || '');
  const [editLastName, setEditLastName] = useState(user?.lastName || '');

  const [updateProfile, { loading: updatingProfile }] = useMutation(UPDATE_PROFILE, { errorPolicy: 'all' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePassword = async (data: ChangePasswordFormData) => {
    const result = await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
    if (result.success) {
      toast({ title: 'Password changed', description: 'Your password has been updated successfully.' });
      reset();
    } else {
      toast({ title: 'Failed to change password', description: result.error, variant: 'destructive' });
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ variables: { input: { firstName: editFirstName, lastName: editLastName } } });
      toast({ title: 'Profile updated', description: 'Your profile has been updated.' });
      setIsEditingProfile(false);
    } catch {
      toast({ title: 'Update failed', description: 'Could not update profile. The backend may not support this yet.', variant: 'destructive' });
    }
  };

  const handleCancelEdit = () => {
    setEditFirstName(user?.firstName || '');
    setEditLastName(user?.lastName || '');
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
            {!isEditingProfile ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                <Pencil className="w-4 h-4 mr-1" />Edit
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                <XIcon className="w-4 h-4 mr-1" />Cancel
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                {user?.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />{user?.email}
                </div>
              </div>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">First Name</Label>
                    <Input id="editFirstName" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} disabled={updatingProfile} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Last Name</Label>
                    <Input id="editLastName" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} disabled={updatingProfile} />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={updatingProfile} className="w-full sm:w-auto">
                  {updatingProfile ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">First Name</Label>
                    <p className="font-medium">{user?.firstName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Last Name</Label>
                    <p className="font-medium">{user?.lastName}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user?.email}</p>
                    <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />Verified
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Member Since</Label>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{memberSince}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Lock className="w-5 h-5 text-primary" /></div>
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} placeholder="Enter current password" disabled={changingPassword} {...register('currentPassword')} />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input id="newPassword" type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password" disabled={changingPassword} {...register('newPassword')} />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm new password" disabled={changingPassword} {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={changingPassword} className="w-full sm:w-auto">
              {changingPassword ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Changing...</> : 'Update Password'}
            </Button>
          </form>
        </motion.div>

        {/* Account Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
            <h2 className="text-lg font-semibold">Account Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div><p className="font-medium text-sm">Email Verification</p><p className="text-xs text-muted-foreground">Your email address is verified</p></div>
              </div>
              <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" />Active</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div><p className="font-medium text-sm">Password Protection</p><p className="text-xs text-muted-foreground">Your account is protected with a password</p></div>
              </div>
              <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" />Active</span>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Separator className="mb-6" />
          <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <div><p className="font-medium text-sm">Log out of your account</p><p className="text-xs text-muted-foreground">You will be redirected to the home page</p></div>
            <Button variant="destructive" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Log out</Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
