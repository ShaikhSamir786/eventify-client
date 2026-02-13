import { useMutation } from '@apollo/client/react';
import { CHANGE_PASSWORD } from '@/lib/graphql/queries';
import { getErrorMessage } from '@/hooks/api/useAuth';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  changePassword: {
    message: string;
    success: boolean;
  };
}

export const useChangePassword = () => {
  const [changePassword, { loading, error }] = useMutation<ChangePasswordResponse, { input: ChangePasswordInput }>(
    CHANGE_PASSWORD,
    { errorPolicy: 'all' }
  );

  const handleChangePassword = async (input: ChangePasswordInput) => {
    try {
      const result = await changePassword({ variables: { input } });
      if (result.data?.changePassword) {
        return { success: true, data: result.data.changePassword };
      }
      throw new Error('Failed to change password');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      return { success: false, error: errorMessage };
    }
  };

  return { changePassword: handleChangePassword, loading, error };
};
