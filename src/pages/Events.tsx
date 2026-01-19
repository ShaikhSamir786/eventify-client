import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  CalendarPlus,
  Users,
  Search,
  Filter,
  MoreVertical,
  Clock,
  Trash2,
  Edit,
  AlertCircle,
  MapPin,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyEvents, useGetInvitedEvents, useDeleteEvent, getErrorMessage, Event } from '@/hooks/api/useEvents';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Events = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const defaultTab = searchParams.get('filter') === 'invited' ? 'invited' : 'all';
  const { toast } = useToast();

  const { events: myEvents, loading: myLoading, error: myError } = useGetMyEvents();
  const { events: invitedEvents, loading: invitedLoading, error: invitedError } = useGetInvitedEvents();
  const { deleteEvent, loading: deleteLoading } = useDeleteEvent();

  const allEvents = [...myEvents, ...invitedEvents];
  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMyEvents = filteredEvents.filter(e => myEvents.some(me => me.id === e.id));
  const filteredInvitedEvents = filteredEvents.filter(e => invitedEvents.some(ie => ie.id === e.id));

  const loading = myLoading || invitedLoading;
  const error = myError || invitedError;

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    setDeletingEventId(eventToDelete.id);
    const result = await deleteEvent(eventToDelete.id);
    setDeletingEventId(null);
    setEventToDelete(null);

    if (result.success) {
      toast({
        title: 'Event deleted',
        description: 'Your event has been deleted successfully.',
      });
    } else {
      toast({
        title: 'Delete failed',
        description: result.error || 'Could not delete the event',
        variant: 'destructive',
      });
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-bold">Events</h1>
            <p className="text-muted-foreground">Manage and organize your events</p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/events/create">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" disabled>
            <Filter className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Events ({filteredEvents.length})</TabsTrigger>
              <TabsTrigger value="created">Created ({filteredMyEvents.length})</TabsTrigger>
              <TabsTrigger value="invited">Invited ({filteredInvitedEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={(e) => setEventToDelete(e)}
                    isDeleting={deletingEventId === event.id}
                    isCreator={myEvents.some(e => e.id === event.id)}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="created" className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : filteredMyEvents.length > 0 ? (
                filteredMyEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={(e) => setEventToDelete(e)}
                    isDeleting={deletingEventId === event.id}
                    isCreator={true}
                  />
                ))
              ) : (
                <EmptyState message="You haven't created any events yet" />
              )}
            </TabsContent>

            <TabsContent value="invited" className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : filteredInvitedEvents.length > 0 ? (
                filteredInvitedEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={(e) => setEventToDelete(e)}
                    isDeleting={deletingEventId === event.id}
                    isCreator={false}
                  />
                ))
              ) : (
                <EmptyState message="No event invitations yet" />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

const EventCard = ({
  event,
  onDelete,
  isDeleting,
  isCreator,
}: {
  event: Event;
  onDelete: (event: Event) => void;
  isDeleting: boolean;
  isCreator: boolean;
}) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              {isCreator && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  Creator
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {event.description || 'No description provided'}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formattedDate} at {formattedTime}
              </div>
              {event.location && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4" />
                {event.invitedEmails?.length || 0} invited
              </div>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0" disabled={isDeleting}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/events/${event.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            {isCreator && (
              <>
                <DropdownMenuItem asChild>
                  <Link to={`/events/${event.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete(event)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ message = "No events found" }: { message?: string }) => (
  <div className="text-center py-16 bg-card rounded-2xl border border-border">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <Calendar className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="font-medium mb-2">{message}</h3>
    <p className="text-sm text-muted-foreground mb-6">
      Create your first event to get started
    </p>
    <Button variant="gradient" asChild>
      <Link to="/events/create">
        <CalendarPlus className="w-4 h-4 mr-2" />
        Create Event
      </Link>
    </Button>
  </div>
);

export default Events;
