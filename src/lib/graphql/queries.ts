import { gql } from '@apollo/client';

// Auth Mutations
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      message
      email
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOTP($input: VerifyOTPInput!) {
    verifyOTP(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOTP($email: String!) {
    resendOTP(email: $email) {
      message
    }
  }
`;

// User Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      createdAt
    }
  }
`;

// Event Queries
export const GET_MY_EVENTS = gql`
  query GetMyEvents {
    myEvents {
      id
      title
      description
      startDate
      endDate
      createdBy {
        id
        name
        email
      }
      participants {
        id
        email
        name
      }
      createdAt
    }
  }
`;

export const GET_INVITED_EVENTS = gql`
  query GetInvitedEvents {
    invitedEvents {
      id
      title
      description
      startDate
      endDate
      createdBy {
        id
        name
        email
      }
      participants {
        id
        email
        name
      }
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      description
      startDate
      endDate
      createdBy {
        id
        name
        email
      }
      participants {
        id
        email
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Event Mutations
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      description
      startDate
      endDate
      participants {
        id
        email
      }
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      description
      startDate
      endDate
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      message
    }
  }
`;

export const INVITE_PARTICIPANTS = gql`
  mutation InviteParticipants($eventId: ID!, $emails: [String!]!) {
    inviteParticipants(eventId: $eventId, emails: $emails) {
      id
      participants {
        id
        email
        name
      }
    }
  }
`;

export const REMOVE_PARTICIPANT = gql`
  mutation RemoveParticipant($eventId: ID!, $userId: ID!) {
    removeParticipant(eventId: $eventId, userId: $userId) {
      id
      participants {
        id
        email
      }
    }
  }
`;
