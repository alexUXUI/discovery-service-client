// CreateProject.tsx
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../auth/auth.context';
import { toast } from 'react-toastify';

const createProject = async (idToken: string, newProject: { name: string }, logout: any) => {
    try {
        const response = await fetch('https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(newProject),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('There was an error!', error);
        logout();
        return Promise.reject(error);
    }
};

export const CreateProject = () => {
    const { idToken, logout } = useAuth();
    const queryClient = useQueryClient();

    const [projectName, setProjectName] = useState('');
    const [createdProjectName, setCreatedProjectName] = useState('');

    const mutation = useMutation(
        (newProject: { name: string }) => createProject(idToken, newProject, logout),
        {
            onSuccess: (data) => {
                console.log('Project created successfully:', data);
                setProjectName('');
                queryClient.setQueryData('projects', (oldData: any) => {
                    return {
                        ...oldData,
                        projects: [...(oldData?.projects || []), data],
                    };
                });
                toast.success(`${projectName} created successfully!`);
            },
            onError: (error) => {
                console.log('Error creating project:', error);
                toast.error(`Error creating ${projectName}`);
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ name: projectName });
    };

    useEffect(() => {
        if (mutation.isSuccess) {
            console.log('mutation.isSuccess');
            const timer = setTimeout(() => {
                setCreatedProjectName('');
            }, 10000); // Hide message after 10 seconds
            return () => clearTimeout(timer);
        }
    }, [mutation.isSuccess]);

    return (
        <div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        id="projectName"
                        placeholder='Project name'
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" disabled={mutation.isLoading} style={styles.createButton}>
                    {mutation.isLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
            {mutation.isError && <div>Error: {JSON.stringify(mutation.error)}</div>}
            {mutation.isSuccess && createdProjectName && (
                <div>Project "{createdProjectName}" created successfully!</div>
            )}
        </div>
    );
};
const styles = {
    heading: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '0 20px 0 0',
        color: '#333',
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
    },
    formGroup: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px',
    },
    label: {
        marginRight: '10px',
    },
    input: {
        border: '1px solid #D0D5DD',
        borderRadius: '5px',
        height: '20px',
        padding: '5px',
    },
    button: {
        border: 'none',
        height: '30px',
        minWidth: '120px',
    },
    createButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#F6FEF9',
        color: '#074D31',
        border: '1px solid #ABEFC6',
        borderRadius: '16px',
        minWidth: '120px',
    },
};
