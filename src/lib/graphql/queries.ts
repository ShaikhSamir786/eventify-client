import { gql } from '@apollo/client';

// Auth Mutations
export const REGISTER_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      message
      success
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      message
      success
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      message
      token
      success
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      message
      success
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
      success
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOTP($email: String!) {
    resendOTP(email: $email) {
      message
      success
    }
  }
`;

// User Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
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
      date
      location
      createdBy {
        id
        firstName
        lastName
        email
      }
      invitedEmails
      createdAt
      updatedAt
    }
  }
`;

export const GET_INVITED_EVENTS = gql`
  query GetInvitedEvents {
    invitedEvents {
      id
      title
      description
      date
      location
      createdBy {
        id
        firstName
        lastName
        email
      }
      invitedEmails
      createdAt
      updatedAt
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      description
      date
      location
      createdBy {
        id
        firstName
        lastName
        email
      }
      invitedEmails
      createdAt
      updatedAt
    }
  }
`;

// Event Mutations
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      message
      success
      event {
        id
        title
        description
        date
        location
        createdBy {
          id
          firstName
          lastName
          email
        }
        invitedEmails
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      message
      success
      event {
        id
        title
        description
        date
        location
        createdBy {
          id
          firstName
          lastName
          email
        }
        invitedEmails
        updatedAt
      }
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      message
      success
      event {
        id
        title
      }
    }
  }
`;

export const INVITE_PARTICIPANTS = gql`
  mutation InviteParticipants($input: InviteParticipantsInput!) {
    inviteParticipants(input: $input) {
      message
      success
      event {
        id
        title
        invitedEmails
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
