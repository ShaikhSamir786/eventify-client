import { useMutation, useQuery, ApolloError } from '@apollo/client';
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
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyOTPInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

interface RegisterResponse {
  register: {
    message: string;
    email: string;
  };
}

interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

interface VerifyOTPResponse {
  verifyOTP: {
    token: string;
    user: User;
  };
}

interface ForgotPasswordResponse {
  forgotPassword: {
    message: string;
  };
}

interface ResetPasswordResponse {
  resetPassword: {
    message: string;
  };
}

interface ResendOTPResponse {
  resendOTP: {
    message: string;
  };
}

interface GetMeResponse {
  me: User;
}

// Auth Mutations
export const useRegister = () => {
  const [register, { loading, error }] = useMutation<RegisterResponse, { input: RegisterInput }>(
    REGISTER_USER,
    {
      errorPolicy: 'all',
    }
  );

  const handleRegister = async (input: RegisterInput) => {
    try {
      const result = await register({ variables: { input } });
      if (result.data?.register) {
        return { success: true, data: result.data.register };
      }
      throw new Error('Registration failed');
    } catch (err) {
      const errorMessage = err instanceof ApolloError ? err.message : 'Registration failed';
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
      const errorMessage = err instanceof ApolloError ? err.message : 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  return { login: handleLogin, loading, error };
};

export const useVerifyOTP = () => {
  const [verifyOTP, { loading, error }] = useMutation<VerifyOTPResponse, { input: VerifyOTPInput }>(
    VERIFY_OTP,
    {
      errorPolicy: 'all',
    }
  );

  const handleVerifyOTP = async (input: VerifyOTPInput) => {
    try {
      const result = await verifyOTP({ variables: { input } });
      if (result.data?.verifyOTP) {
        return { success: true, data: result.data.verifyOTP };
      }
      throw new Error('OTP verification failed');
    } catch (err) {
      const errorMessage = err instanceof ApolloError ? err.message : 'OTP verification failed';
      return { success: false, error: errorMessage };
    }
  };

  return { verifyOTP: handleVerifyOTP, loading, error };
};

export const useForgotPassword = () => {
  const [forgotPassword, { loading, error }] = useMutation<ForgotPasswordResponse, { email: string }>(
    FORGOT_PASSWORD,
    {
      errorPolicy: 'all',
    }
  );

  const handleForgotPassword = async (email: string) => {
    try {
      const result = await forgotPassword({ variables: { email } });
      if (result.data?.forgotPassword) {
        return { success: true, data: result.data.forgotPassword };
      }
      throw new Error('Failed to send reset email');
    } catch (err) {
      const errorMessage = err instanceof ApolloError ? err.message : 'Failed to send reset email';
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
      const errorMessage = err instanceof ApolloError ? err.message : 'Password reset failed';
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
      const errorMessage = err instanceof ApolloError ? err.message : 'Failed to resend OTP';
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
export const getErrorMessage = (error: ApolloError | undefined): string => {
  if (!error) return 'An unknown error occurred';
  
  // Check for GraphQL errors
  if (error.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message;
  }
  
  // Check for network errors
  if (error.networkError) {
    return `Network error: ${error.networkError.message}`;
  }
  
  return error.message || 'An unknown error occurred';
};
