import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../auth/auth.context';
import { toast } from 'react-toastify';

interface Version {
    version: {
        url: string;
        metadata: {
            version: string;
            integrity: string;
        };
        fallbackUrl: string;
    };
}

const createVersion = async (idToken: string, projectId: string, microFrontendId: string, newVersion: Version) => {
    console.log('Creating version:', newVersion);
    try {
        const response = await fetch(`https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects/${projectId}/microFrontends/${microFrontendId}/versions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newVersion),
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

export const CreateVersion = ({ projectId, microFrontendId }: { projectId: string, microFrontendId: string }) => {
    const { idToken, logout } = useAuth();
    const queryClient = useQueryClient();

    const [version, setVersion] = useState({
        version: {
            url: '',
            metadata: {
                version: '',
                integrity: '',
            },
            fallbackUrl: '',
        },
    });
    const [deploymentStrategy, setDeploymentStrategy] = useState('');

    const mutation = useMutation(
        (newVersion: Version) => createVersion(idToken, projectId, microFrontendId, version),
        {
            onSuccess: (data) => {
                console.log('Version created successfully:', data);
                setVersion({
                    version: {
                        url: '',
                        metadata: {
                            version: '',
                            integrity: '',
                        },
                        fallbackUrl: '',
                    },
                });
                setDeploymentStrategy('');
                queryClient.setQueryData(['mfeVersions', `${projectId}-${microFrontendId}`], (oldData: any) => {
                    return {
                        ...oldData,
                        versions: oldData?.versions ? [...oldData.versions, data] : [data],
                    };
                });
                toast.success(`Version created successfully!`);
            },
            onError: (error) => {
                console.log('Error creating version:', error);
                toast.error(`Error creating version`);
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!version.version.url || !version.version.metadata.version || !version.version.metadata.integrity) {
            toast.error('All fields are required');
            return;
        }
        mutation.mutate({
            version: {
                url: version.version.url,
                metadata: {
                    version: version.version.metadata.version,
                    integrity: version.version.metadata.integrity,
                },
                fallbackUrl: version.version.fallbackUrl,
            },
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        id="url"
                        value={version.version.url}
                        onChange={(e) => setVersion({
                            ...version,
                            version: {
                                ...version.version,
                                url: e.target.value
                            }
                        })}
                        required
                        style={styles.input}
                        placeholder='URL'
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        id="metadataVersion"
                        value={version.version.metadata.version}
                        onChange={(e) => setVersion({
                            ...version,
                            version: {
                                ...version.version,
                                metadata: {
                                    ...version.version.metadata,
                                    version: e.target.value
                                }
                            }
                        })}
                        required
                        style={styles.input}
                        placeholder='Metadata Version'
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        id="integrity"
                        value={version.version.metadata.integrity}
                        onChange={(e) => setVersion({
                            ...version,
                            version: {
                                ...version.version,
                                metadata: {
                                    ...version.version.metadata,
                                    integrity: e.target.value
                                }
                            }
                        })}
                        required
                        style={styles.input}
                        placeholder='Integrity'
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        id="fallbackUrl"
                        value={version.version.fallbackUrl}
                        onChange={(e) => setVersion({
                            ...version,
                            version: {
                                ...version.version,
                                fallbackUrl: e.target.value
                            }
                        })}
                        required
                        style={styles.input}
                        placeholder='Fallback URL'
                    />
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
    form: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '0 0 20px 0',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
    } as React.CSSProperties,
    formGroup: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    label: {
        marginRight: '10px',
    },
    input: {
        marginRight: '10px',
        border: '1px solid #D0D5DD',
        borderRadius: '5px',
        height: '20px',
        padding: '5px',
        width: '100%'
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