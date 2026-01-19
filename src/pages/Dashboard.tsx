import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useGetMyEvents, getErrorMessage } from '@/hooks/api/useEvents';
import {
  Calendar,
  CalendarPlus,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const { user } = useAuth();
  const { events, loading, error } = useGetMyEvents();

  // Calculate stats from real data
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date()).length;
  const totalParticipants = new Set(events.flatMap(e => e.participants.map(p => p.id))).size;
  
  const stats = [
    { label: 'Total Events', value: totalEvents.toString(), icon: Calendar, color: 'primary' },
    { label: 'Upcoming', value: upcomingEvents.toString(), icon: Clock, color: 'success' },
    { label: 'Participants', value: totalParticipants.toString(), icon: Users, color: 'accent' },
    { label: 'This Month', value: events.filter(e => {
      const eventDate = new Date(e.startDate);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length.toString(), icon: TrendingUp, color: 'warning' },
  ];

  const upcomingEventsList = events
    .filter(e => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const errorMessage = getErrorMessage(error);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your events today.
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/events">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : upcomingEventsList.length > 0 ? (
              <div className="space-y-4">
                {upcomingEventsList.map((event) => (
                  <EventRow key={event.id} event={event} formatDate={formatDate} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="gradient" className="w-full justify-start" asChild>
                <Link to="/events/create">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Create New Event
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Events
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/events?filter=invited">
                  <Users className="w-4 h-4 mr-2" />
                  View Invitations
                </Link>
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm font-medium text-primary mb-1">Pro Tip 💡</p>
              <p className="text-sm text-muted-foreground">
                Invite participants via email and they'll receive instant notifications.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: typeof Calendar;
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

const EventRow = ({
  event,
  formatDate,
}: {
  event: any;
  formatDate: (date: string) => string;
}) => {
  return (
    <Link
      to={`/events/${event.id}`}
      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(event.startDate)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {event.participants.length}
        </div>
      </div>
    </Link>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <Calendar className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="font-medium mb-2">No upcoming events</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Create your first event to get started
    </p>
    <Button variant="gradient" size="sm" asChild>
      <Link to="/events/create">
        <CalendarPlus className="w-4 h-4 mr-2" />
        Create Event
      </Link>
    </Button>
  </div>
);

export default Dashboard;
