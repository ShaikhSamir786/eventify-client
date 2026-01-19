import { useMutation, useQuery } from '@apollo/client/react';
import {
  CombinedGraphQLErrors,
  ServerError,
  ServerParseError,
  UnconventionalError,
} from '@apollo/client';
import { 
  REGISTER_USER, 
  LOGIN, 
  VERIFY_OTP, 
  FORGOT_PASSWORD, 
  RESET_PASSWORD,
  RESEND_OTP,
  GET_ME 
} from '@/lib/graphql/queries';
import { apolloClient } from '@/lib/graphql/client';

// Types
export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

interface CreateUserResponse {
  createUser: {
    message: string;
    success: boolean;
    user: User | null;
  };
}

interface LoginResponse {
  login: {
    message: string;
    token: string;
    user: User;
    success: boolean;
  };
}

interface VerifyEmailResponse {
  verifyEmail: {
    message: string;
    success: boolean;
  };
}

interface ForgotPasswordResponse {
  forgotPassword: {
    message: string;
    success: boolean;
  };
}

interface ResetPasswordResponse {
  resetPassword: {
    message: string;
    success: boolean;
  };
}

interface ResendOTPResponse {
  resendOTP: {
    message: string;
    success: boolean;
  };
}

interface GetMeResponse {
  me: User;
}

// Auth Mutations
export const useRegister = () => {
  const [register, { loading, error }] = useMutation<CreateUserResponse, { input: CreateUserInput }>(
    REGISTER_USER,
    {
      errorPolicy: 'all',
    }
  );

  const handleRegister = async (input: CreateUserInput) => {
    try {
      const result = await register({ variables: { input } });
      if (result.data?.register) {
        return { success: true, data: result.data.register };
      }
      throw new Error('Registration failed');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { register: handleRegister, loading, error };
};

export const useLogin = () => {
  const [login, { loading, error }] = useMutation<LoginResponse, { input: LoginInput }>(
    LOGIN,
    {
      errorPolicy: 'all',
    }
  );

  const handleLogin = async (input: LoginInput) => {
    try {
      const result = await login({ variables: { input } });
      if (result.data?.login) {
        return { success: true, data: result.data.login };
      }
      throw new Error('Login failed');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { login: handleLogin, loading, error };
};

export const useVerifyOTP = () => {
  const [verifyOTP, { loading, error }] = useMutation<VerifyEmailResponse, { input: VerifyEmailInput }>(
    VERIFY_OTP,
    {
      errorPolicy: 'all',
    }
  );

  const handleVerifyOTP = async (input: VerifyEmailInput) => {
    try {
      const result = await verifyOTP({ variables: { input } });
      if (result.data?.verifyOTP) {
        return { success: true, data: result.data.verifyOTP };
      }
      throw new Error('OTP verification failed');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { verifyOTP: handleVerifyOTP, loading, error };
};

export const useForgotPassword = () => {
  const [forgotPassword, { loading, error }] = useMutation<ForgotPasswordResponse, { input: ForgotPasswordInput }>(
    FORGOT_PASSWORD,
    {
      errorPolicy: 'all',
    }
  );

  const handleForgotPassword = async (email: string) => {
    try {
      const result = await forgotPassword({ variables: { input: { email } } });
      if (result.data?.forgotPassword) {
        return { success: true, data: result.data.forgotPassword };
      }
      throw new Error('Failed to send reset email');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { forgotPassword: handleForgotPassword, loading, error };
};

export const useResetPassword = () => {
  const [resetPassword, { loading, error }] = useMutation<ResetPasswordResponse, { input: ResetPasswordInput }>(
    RESET_PASSWORD,
    {
      errorPolicy: 'all',
    }
  );

  const handleResetPassword = async (input: ResetPasswordInput) => {
    try {
      const result = await resetPassword({ variables: { input } });
      if (result.data?.resetPassword) {
        return { success: true, data: result.data.resetPassword };
      }
      throw new Error('Password reset failed');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { resetPassword: handleResetPassword, loading, error };
};

export const useResendOTP = () => {
  const [resendOTP, { loading, error }] = useMutation<ResendOTPResponse, { email: string }>(
    RESEND_OTP,
    {
      errorPolicy: 'all',
    }
  );

  const handleResendOTP = async (email: string) => {
    try {
      const result = await resendOTP({ variables: { email } });
      if (result.data?.resendOTP) {
        return { success: true, data: result.data.resendOTP };
      }
      throw new Error('Failed to resend OTP');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { resendOTP: handleResendOTP, loading, error };
};

// User Queries
export const useGetMe = (skip?: boolean) => {
  const { data, loading, error, refetch } = useQuery<GetMeResponse>(
    GET_ME,
    {
      skip,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    user: data?.me || null,
    loading,
    error,
    refetch,
  };
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
