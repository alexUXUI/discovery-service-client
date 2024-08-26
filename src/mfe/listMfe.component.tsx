import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import { DeleteMicroFrontend } from "./deleteMfe.component";
import { useAuth } from "../auth/auth.context";

const fetchProjectMFEs = async (idToken: string, projectId: string) => {
    try {
        const response = await fetch(`https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects/${projectId}/microFrontends`, {
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

export const ListMfe = ({ projectId }: { projectId: string }) => {
    const { idToken } = useAuth();
    const navigate = useNavigate();

    const {
        data: projectMFEsData,
        error: projectMFEsError,
        isLoading: projectMFEsIsLoading,
        isError: projectMFEsIsError
    } = useQuery(['projectMFEs', projectId], () => fetchProjectMFEs(idToken, projectId!), {
        enabled: !!idToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    if (projectMFEsIsLoading) {
        return (
            <div>
                <div style={styles.skeletonContainer}>
                    <Skeleton count={3} height={30} style={styles.skeleton} />
                </div>
            </div>
        )
    }

    if (projectMFEsIsError) return <div>Error: {JSON.stringify(projectMFEsError)}</div>;
    if (!idToken) return <div>Not authenticated for project {projectId}</div>;
    if (!projectId) return <div>No project selected</div>;

    const handleVersion = (projectId: string, mfeId: string) => {
        console.log('Versioning MFE', mfeId, 'for project', projectId);
        navigate(`/admin/project/${projectId}/microFrontend/${mfeId}/version`);
    }

    return (
        <div style={{ margin: '0 0 40px 0' }}>
            {projectMFEsData && projectMFEsData.microFrontends ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={{ ...styles.th, ...styles.versionColumn }}>
                                Active Versions</th>
                            <th style={styles.th}>Version</th>
                            <th style={styles.th}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectMFEsData.microFrontends
                            .filter((mfe: any) => !mfe.deleted)
                            .map((mfe: any, index: any) => (
                                <tr key={index} style={styles.tr}>
                                    <td style={styles.td}>{mfe.name}</td>
                                    <td style={{ ...styles.td, ...styles.versionColumn }}>
                                        {mfe?.activeVersions?.length ? (
                                            <table style={miniTableStyles.table}>
                                                <thead style={miniTableStyles.thead}>
                                                    <tr>
                                                        <th style={miniTableStyles.th}>Version</th>
                                                        <th style={miniTableStyles.th}>Traffic</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {mfe.activeVersions.map((version: any, index: any) => (
                                                        <tr key={index} style={miniTableStyles.tr}>
                                                            <td style={miniTableStyles.td}>{version.version}</td>
                                                            <td style={miniTableStyles.td}>{version.traffic}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div>No active versions</div>
                                        )}
                                    </td>
                                    <td style={{ ...styles.td, ...styles.actionColumn }}>
                                        <button onClick={(event) => {
                                            event.preventDefault();
                                            handleVersion(projectId, mfe.id)
                                        }} style={styles.selectButton}>Version</button>
                                    </td>
                                    <td style={{ ...styles.td, ...styles.actionColumn }}>
                                        <DeleteMicroFrontend projectId={projectId} microFrontendId={mfe.id} />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            ) : (
                <h1>No MFEs</h1>
            )
            }
        </div >
    );
}

const miniTableStyles = {
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    } as React.CSSProperties,
    thead: {
        fontSize: '14px',
    },
    th: {
        border: '1px solid #D0D5DD',
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#333',
        padding: '2px 2px 2px 5px',
    } as React.CSSProperties,
    tr: {
        borderBottom: '1px solid #EAECF0',
    } as React.CSSProperties,
    td: {
        border: '1px solid #EAECF0',
        padding: '8px',
    } as React.CSSProperties,
};

const styles = {
    versionColumn: {
        minWidth: '150px',
    } as React.CSSProperties,
    skeletonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    } as React.CSSProperties,
    skeleton: {
        marginBottom: '10px',
    } as React.CSSProperties,
    actionColumn: {
        width: '100px',
        textAlign: 'center',
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
    button: {
        padding: '5px 10px',
        cursor: 'pointer',
    },
    box: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
