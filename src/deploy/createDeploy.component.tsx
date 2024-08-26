import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../auth/auth.context';
import { toast } from 'react-toastify';

const createDeploy = async (idToken: string, projectId: string, microFrontendId: string, newDeploy: { targetVersion: string, deploymentStrategy: string }) => {
    try {
        const response = await fetch(`https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects/${projectId}/microFrontends/${microFrontendId}/deployment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(newDeploy),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('There was an error!', error);
        return Promise.reject(error);
    }
};

export const CreateDeployment = ({ projectId, microFrontendId, versionId }: { projectId: string, microFrontendId: string, versionId: string }) => {
    const { idToken, logout } = useAuth();
    const queryClient = useQueryClient();

    const [targetVersion, setTargetVersion] = useState(versionId);
    const [deploymentStrategy, setDeploymentStrategy] = useState('');
    const [createdDeploy, setCreatedDeploy] = useState<{ targetVersion: string, deploymentStrategy: string } | null>(null);

    const mutation = useMutation(
        (newDeploy: { targetVersion: string, deploymentStrategy: string }) => createDeploy(idToken, projectId, microFrontendId, newDeploy, logout),
        {
            onSuccess: (data) => {
                console.log('Deploy created successfully:', data);
                setTargetVersion('');
                setDeploymentStrategy('');
                queryClient.setQueryData(['projectDeploys', projectId, microFrontendId], (oldData: any) => {
                    return {
                        ...oldData,
                        deploys: oldData?.deploys ? [...oldData.deploys, data] : [data],
                    };
                });
                toast.success(`Deploy created successfully!`);
            },
            onError: (error) => {
                console.log('Error creating deploy:', error);
                toast.error(`Error creating deploy`);
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetVersion || !deploymentStrategy) {
            toast.error('All fields are required');
            return;
        }
        mutation.mutate({ targetVersion, deploymentStrategy });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <input
                        key={versionId}
                        type="text"
                        id="targetVersion"
                        defaultValue={versionId}
                        style={styles.input}
                        contentEditable={false}
                    />
                </div>
                <div style={styles.formGroup}>
                    <select
                        id="deploymentStrategy"
                        value={deploymentStrategy}
                        onChange={(e) => setDeploymentStrategy(e.target.value)}
                        required
                        style={styles.selectBox}
                    >
                        <option value="" disabled>Select Deployment Strategy</option>
                        <option value="Linear10PercentEvery10Minutes">Linear10PercentEvery10Minutes</option>
                        <option value="Linear10PercentEvery1Minute">Linear10PercentEvery1Minute</option>
                        <option value="Linear10PercentEvery2Minutes">Linear10PercentEvery2Minutes</option>
                        <option value="Linear10PercentEvery3Minutes">Linear10PercentEvery3Minutes</option>
                        <option value="Canary10Percent30Minutes">Canary10Percent30Minutes</option>
                        <option value="Canary10Percent5Minutes">Canary10Percent5Minutes</option>
                        <option value="Canary10Percent10Minutes">Canary10Percent10Minutes</option>
                        <option value="Canary10Percent15Minutes">Canary10Percent15Minutes</option>
                        <option value="AllAtOnce">AllAtOnce</option>
                    </select>
                </div>
                <button type="submit" disabled={mutation.isLoading} style={styles.createButton}>
                    {mutation.isLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
            {mutation.isError && <div>Error: {JSON.stringify(mutation.error)}</div>}
        </div>
    );
};

const styles = {
    selectBox: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        height: '32px',
        padding: '5px',
    },
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