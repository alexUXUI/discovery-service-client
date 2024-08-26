import React from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { useAuth } from '../auth/auth.context';
import { toast } from 'react-toastify';

const deleteProject = async (idToken: string, projectId: string, logout: any) => {
    try {
        const response = await fetch(`https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response
        return data;
    } catch (error: any) {
        console.error('There was an error!', error);
        return Promise.reject(error);
    }
};

interface DeleteProjectProps {
    projectId: string;
    projectName: string;
}

export const DeleteProject: React.FC<DeleteProjectProps> = ({ projectId, projectName }) => {
    const { idToken, logout } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation(
        () => deleteProject(idToken, projectId, logout),
        {
            onSuccess: (data) => {
                console.log('Project deleted successfully:', projectId);
                queryClient.setQueryData('projects', (oldData: any) => {
                    return {
                        ...oldData,
                        projects: oldData.projects.filter((project: any) => project.id !== projectId),
                    };
                });
                toast.success(`Project ${projectName} deleted successfully!`);
            },
            onError: (error) => {
                console.log('Error deleting project:', error);
                toast.error(`Error deleting project`);
            },
        }
    );

    const handleDelete = () => {
        mutation.mutate();
    };

    return (
        <button style={styles.deleteButton} onClick={handleDelete} disabled={mutation.isLoading}>
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