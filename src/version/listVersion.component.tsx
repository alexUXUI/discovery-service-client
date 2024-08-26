import { useQuery } from "react-query";
import Skeleton from "react-loading-skeleton";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../auth/auth.context";

const fetchVersions = async (idToken: string, projectId: string, microFrontendId: string) => {
    try {
        const response = await fetch(`https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects/${projectId}/microFrontends/${microFrontendId}/versions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            }
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
}

export const ListVersions = ({ projectId, microFrontendId }: { projectId: string, microFrontendId: string }) => {
    const { idToken } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const { mfeId } = params as any;

    const {
        data: versionsData,
        error: versionsError,
        isLoading: versionsIsLoading,
        isError: versionsIsError
    } = useQuery(['mfeVersions', `${projectId}-${microFrontendId}`], () => fetchVersions(idToken, projectId, microFrontendId), {
        enabled: !!idToken,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const handleDeploy = (projectId: string, mfeId: string, versionId: string) => {
        console.log('Deploying MFE', mfeId, 'for project', projectId);
        navigate(`/admin/project/${projectId}/microFrontend/${mfeId}/version/${versionId}/deploy`);
    }

    if (versionsIsLoading) {
        return (
            <div>
                <div style={styles.skeletonContainer}>
                    <Skeleton count={3} height={30} style={styles.skeleton} />
                </div>
            </div>
        )
    }

    if (versionsIsError) return <div>Error: {JSON.stringify(versionsError)}</div>;
    if (!idToken) return <div>Not authenticated for project {projectId}</div>;
    if (!projectId || !microFrontendId) return <div>No project or micro frontend selected</div>;

    return (
        <div style={{ margin: '0 0 40px 0' }}>
            {versionsData && versionsData.versions ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Version</th>
                            <th style={styles.th}>Integrity</th>
                            <th style={styles.th}>URL</th>
                            <th style={styles.th}>Deploy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versionsData?.versions ? versionsData?.versions?.map((version: any, index: any) => (
                            <tr key={index} style={styles.tr}>
                                <td style={styles.td}>{version?.metadata?.version}</td>
                                <td style={styles.td}>{version?.metadata?.integrity}</td>
                                <td style={styles.td}><a href={version?.url} target="_blank" rel="noopener noreferrer">{version.url}</a></td>
                                <td style={{ ...styles.td, ...styles.actionColumn }}>
                                    <button onClick={(event) => {
                                        event.preventDefault();
                                        handleDeploy(projectId, mfeId, version?.metadata?.version)
                                    }} style={styles.selectButton}>Deploy</button>
                                </td>
                            </tr>
                        )) : 'loading....'}
                    </tbody>
                </table>
            ) : (
                <h1>No Versions!</h1>
            )}
            <Outlet />
        </div>
    );
}

const styles = {
    actionColumn: {
        width: '100px',
        textAlign: 'center',
    } as React.CSSProperties,
    skeletonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    } as React.CSSProperties,
    skeleton: {
        marginBottom: '10px',
    } as React.CSSProperties,
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    } as React.CSSProperties,
    th: {
        border: '1px solid #D0D5DD',
        padding: '8px',
        textAlign: 'left',
    } as React.CSSProperties,
    tr: {
        borderBottom: '1px solid #EAECF0',
    },
    td: {
        border: '1px solid #EAECF0',
        padding: '8px',
    },
    selectButton: {
        padding: '0.5rem 1rem',
        border: '1px solid #84ADFF',
        backgroundColor: '#F5F8FF',
        color: '#002266',
        borderRadius: '16px',
        cursor: 'pointer',
    },
};