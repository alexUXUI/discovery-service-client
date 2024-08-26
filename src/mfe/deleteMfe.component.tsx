import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../auth/auth.context';
import { toast } from 'react-toastify';

const deleteMicroFrontend = async (idToken: string, projectId: string, microFrontendId: string) => {
    try {
        const response = await fetch(`https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects/${projectId}/microFrontends/${microFrontendId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return microFrontendId;
    } catch (error: any) {
        console.error('There was an error!', error);
        return Promise.reject(error);
    }
};

export const DeleteMicroFrontend = ({ projectId, microFrontendId }: { projectId: string, microFrontendId: string }) => {
    const { idToken, logout } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation(
        () => deleteMicroFrontend(idToken, projectId, microFrontendId),
        {
            onSuccess: (deletedId) => {
                console.log('Microfrontend deleted successfully:', deletedId);
                queryClient.setQueryData(['projectMFEs', projectId], (oldData: any) => {
                    if (!oldData || !oldData.microFrontends) {
                        return oldData; // or return an empty state if appropriate
                    }
                    return {
                        ...oldData,
                        microFrontends: oldData.microFrontends.filter((mfe: any) => mfe.id !== deletedId),
                    };
                });
                toast.success('Microfrontend deleted successfully!');
            },
            onError: (error) => {
                console.log('Error deleting microfrontend:', error);
                toast.error('Error deleting microfrontend');
            },
        }
    );

    return (
        <button style={styles.deleteButton} onClick={() => mutation.mutate()} disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Deleting...' : 'Delete'}
        </button>
    );
};

const styles = {
    deleteButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#FFFBFA',
        color: '#7A271A',
        border: '1px solid #FECDCA',
        borderRadius: '16px',
        cursor: 'pointer',
    },
};