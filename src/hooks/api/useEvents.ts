import { useMutation, useQuery } from '@apollo/client/react';
import {
  CombinedGraphQLErrors,
  ServerError,
  ServerParseError,
  UnconventionalError,
} from '@apollo/client';
import {
  GET_MY_EVENTS,
  GET_INVITED_EVENTS,
  GET_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  INVITE_PARTICIPANTS,
  REMOVE_PARTICIPANT,
} from '@/lib/graphql/queries';

// Types
export interface Participant {
  id: string;
  email: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  invitedEmails?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  date: string;
  location?: string;
  invitedEmails?: string[];
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  invitedEmails?: string[];
}

interface GetMyEventsResponse {
  myEvents: Event[];
}

interface GetInvitedEventsResponse {
  invitedEvents: Event[];
}

interface GetEventResponse {
  event: Event;
}

interface CreateEventResponse {
  createEvent: {
    message: string;
    success: boolean;
    event: Event;
  };
}

interface UpdateEventResponse {
  updateEvent: {
    message: string;
    success: boolean;
    event: Event;
  };
}

interface DeleteEventResponse {
  deleteEvent: {
    message: string;
    success: boolean;
    event: Event;
  };
}

interface InviteParticipantsResponse {
  inviteParticipants: {
    message: string;
    success: boolean;
    event: Event;
  };
}

interface RemoveParticipantResponse {
  removeParticipant: Event;
}

// Event Queries
export const useGetMyEvents = (skip?: boolean) => {
  const { data, loading, error, refetch } = useQuery<GetMyEventsResponse>(
    GET_MY_EVENTS,
    {
      skip,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    events: data?.myEvents || [],
    loading,
    error,
    refetch,
  };
};

export const useGetInvitedEvents = (skip?: boolean) => {
  const { data, loading, error, refetch } = useQuery<GetInvitedEventsResponse>(
    GET_INVITED_EVENTS,
    {
      skip,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    events: data?.invitedEvents || [],
    loading,
    error,
    refetch,
  };
};

export const useGetEvent = (id?: string) => {
  const { data, loading, error, refetch } = useQuery<GetEventResponse>(
    GET_EVENT,
    {
      variables: { id: id || '' },
      skip: !id,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    event: data?.event || null,
    loading,
    error,
    refetch,
  };
};

// Event Mutations
export const useCreateEvent = () => {
  const [createEvent, { loading, error }] = useMutation<CreateEventResponse, { input: CreateEventInput }>(
    CREATE_EVENT,
    {
      errorPolicy: 'all',
      refetchQueries: [{ query: GET_MY_EVENTS }],
    }
  );

  const handleCreateEvent = async (input: CreateEventInput) => {
    try {
      const result = await createEvent({ variables: { input } });
      if (result.data?.createEvent) {
        return { success: true, data: result.data.createEvent };
      }
      throw new Error('Failed to create event');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { createEvent: handleCreateEvent, loading, error };
};

export const useUpdateEvent = () => {
  const [updateEvent, { loading, error }] = useMutation<UpdateEventResponse, { id: string; input: UpdateEventInput }>(
    UPDATE_EVENT,
    {
      errorPolicy: 'all',
      refetchQueries: [{ query: GET_MY_EVENTS }],
    }
  );

  const handleUpdateEvent = async (id: string, input: UpdateEventInput) => {
    try {
      const result = await updateEvent({ variables: { id, input } });
      if (result.data?.updateEvent) {
        return { success: true, data: result.data.updateEvent };
      }
      throw new Error('Failed to update event');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { updateEvent: handleUpdateEvent, loading, error };
};

export const useDeleteEvent = () => {
  const [deleteEvent, { loading, error }] = useMutation<DeleteEventResponse, { id: string }>(
    DELETE_EVENT,
    {
      errorPolicy: 'all',
      refetchQueries: [{ query: GET_MY_EVENTS }],
    }
  );

  const handleDeleteEvent = async (id: string) => {
    try {
      const result = await deleteEvent({ variables: { id } });
      if (result.data?.deleteEvent) {
        return { success: true, data: result.data.deleteEvent };
      }
      throw new Error('Failed to delete event');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { deleteEvent: handleDeleteEvent, loading, error };
};

export const useInviteParticipants = () => {
  const [inviteParticipants, { loading, error }] = useMutation<InviteParticipantsResponse, { eventId: string; emails: string[] }>(
    INVITE_PARTICIPANTS,
    {
      errorPolicy: 'all',
      refetchQueries: [{ query: GET_MY_EVENTS }],
    }
  );

  const handleInviteParticipants = async (eventId: string, emails: string[]) => {
    try {
      const result = await inviteParticipants({ variables: { eventId, emails } });
      if (result.data?.inviteParticipants) {
        return { success: true, data: result.data.inviteParticipants };
      }
      throw new Error('Failed to invite participants');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { inviteParticipants: handleInviteParticipants, loading, error };
};

export const useRemoveParticipant = () => {
  const [removeParticipant, { loading, error }] = useMutation<RemoveParticipantResponse, { eventId: string; userId: string }>(
    REMOVE_PARTICIPANT,
    {
      errorPolicy: 'all',
      refetchQueries: [{ query: GET_MY_EVENTS }],
    }
  );

  const handleRemoveParticipant = async (eventId: string, userId: string) => {
    try {
      const result = await removeParticipant({ variables: { eventId, userId } });
      if (result.data?.removeParticipant) {
        return { success: true, data: result.data.removeParticipant };
      }
      throw new Error('Failed to remove participant');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { removeParticipant: handleRemoveParticipant, loading, error };
};

// Error handling helper
export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';
  
  // Check for GraphQL errors using the latest error type detection
  if (CombinedGraphQLErrors.is(error)) {
    if (error.errors?.length > 0) {
      return error.errors[0].message;
    }
  }
  
  // Check for server errors
  if (ServerError.is(error)) {
    return `Server error: ${error.message}`;
  }
  
  // Check for parse errors
  if (ServerParseError.is(error)) {
    return 'Failed to parse server response';
  }
  
  // Check for unconventional errors
  if (UnconventionalError.is(error)) {
    return `Unexpected error: ${error.message}`;
  }
  
  // Fallback for Error instances
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};
