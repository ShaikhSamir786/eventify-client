import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useCreateEvent, useUpdateEvent, useGetEvent, getErrorMessage } from '@/hooks/api/useEvents';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Mail, Plus, X, ArrowLeft, AlertCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(1000).optional(),
  date: z.date({ required_error: 'Date is required' }),
  location: z.string().max(200).optional(),
  emails: z.array(z.object({ value: z.string().email() })).optional(),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

const CreateEvent = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState('');

  const { createEvent, loading: createLoading, error: createError } = useCreateEvent();
  const { updateEvent, loading: updateLoading, error: updateError } = useUpdateEvent();
  const { event, loading: fetchLoading } = useGetEvent(id);

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { emails: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'emails' });
  const date = watch('date');

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditMode && event) {
      reset({
        title: event.title,
        description: event.description || '',
        date: new Date(event.date),
        location: event.location || '',
        emails: event.invitedEmails?.map(e => ({ value: e })) || [],
      });
    }
  }, [isEditMode, event, reset]);

  const onSubmit = async (data: CreateEventFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      date: data.date.toISOString(),
      location: data.location,
      invitedEmails: data.emails?.map(e => e.value),
    };

    if (isEditMode && id) {
      const result = await updateEvent(id, payload);
      if (result.success) {
        toast({ title: 'Event updated!', description: 'Your event has been updated successfully.' });
        navigate(`/events/${id}`);
      } else {
        toast({ title: 'Update failed', description: result.error || 'Could not update the event', variant: 'destructive' });
      }
    } else {
      const result = await createEvent(payload);
      if (result.success) {
        toast({ title: 'Event created!', description: 'Your event has been created successfully.' });
        navigate('/events');
      } else {
        toast({ title: 'Creation failed', description: result.error || 'Could not create the event', variant: 'destructive' });
      }
    }
  };

  const addEmail = () => {
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      append({ value: emailInput.trim() });
      setEmailInput('');
    }
  };

  const apiErrorMessage = getErrorMessage(error);

  if (isEditMode && fetchLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-48" />
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <h1 className="text-3xl font-display font-bold">{isEditMode ? 'Edit Event' : 'Create Event'}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update your event details' : 'Fill in the details to create your new event'}
          </p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiErrorMessage}</AlertDescription>
          </Alert>
        )}

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card rounded-2xl border border-border p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input id="title" placeholder="e.g., Team Weekly Standup" disabled={loading} {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe what this event is about..." rows={4} disabled={loading} {...register('description')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left', !date && 'text-muted-foreground')} disabled={loading}>
                    <CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setValue('date', d)} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="location" placeholder="e.g., Conference Room A" className="pl-10" disabled={loading} {...register('location')} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Invite Participants</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Enter email address" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())} className="pl-10" disabled={loading} />
              </div>
              <Button type="button" variant="outline" onClick={addEmail} disabled={loading}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {fields.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    <span>{field.value}</span>
                    <button type="button" onClick={() => remove(index)} disabled={loading}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />{isEditMode ? 'Saving...' : 'Creating...'}</>
              ) : (
                isEditMode ? 'Save Changes' : 'Create Event'
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;
