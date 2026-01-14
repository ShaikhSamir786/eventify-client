import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  CalendarPlus,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

// Mock data for demo
const mockStats = [
  { label: 'Total Events', value: '12', icon: Calendar, color: 'primary' },
  { label: 'Upcoming', value: '5', icon: Clock, color: 'success' },
  { label: 'Participants', value: '48', icon: Users, color: 'accent' },
  { label: 'This Month', value: '+3', icon: TrendingUp, color: 'warning' },
];

const mockUpcomingEvents = [
  {
    id: '1',
    title: 'Team Standup',
    date: 'Today, 10:00 AM',
    participants: 4,
    isCreator: true,
  },
  {
    id: '2',
    title: 'Product Launch Meeting',
    date: 'Tomorrow, 2:00 PM',
    participants: 12,
    isCreator: true,
  },
  {
    id: '3',
    title: 'Design Review',
    date: 'Friday, 11:00 AM',
    participants: 6,
    isCreator: false,
  },
];

const Dashboard = () => {
  const { user } = useAuth();

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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {mockStats.map((stat, index) => (
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

            {mockUpcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {mockUpcomingEvents.map((event) => (
                  <EventRow key={event.id} event={event} />
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
}: {
  event: {
    id: string;
    title: string;
    date: string;
    participants: number;
    isCreator: boolean;
  };
}) => {
  return (
    <Link
      to={`/events/${event.id}`}
      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{event.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {event.participants}
        </div>
        {event.isCreator && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            Creator
          </span>
        )}
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
