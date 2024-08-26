import { useState } from "react";
import { useQuery } from "react-query";
import { Outlet, useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';

import { CreateProject } from "./createProject.component";
import { DeleteProject } from "./deleteProject.component";
import { useAuth } from "../auth/auth.context";

const fetchProjects = async (idToken: string) => {
    try {
        const response = await fetch('https://ez4fmpt082.execute-api.us-east-1.amazonaws.com/Stage/projects', {
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
};

interface Project {
    id: string,
    name: string
    deleted: boolean
}

export const ListProject = () => {
    const { idToken } = useAuth();
    const navigate = useNavigate();

    const {
        data: projectsData,
        error: projectsError,
        isLoading: projectsIsLoading,
        isError: projectsIsError
    } = useQuery('projects', () => fetchProjects(idToken), {
        enabled: !!idToken,
        onError: (error) => {
            if (error instanceof Error) {
                console.log(error.message);
            }
        },
    });

    const handleSelect = (project: Project) => {
        console.log('Selecting project:', project);
        navigate(`/admin/project/${project.id}`, { state: { project } });
        setSelectedProject(project!);
    }

    const handleDeselect = () => {
        setSelectedProject(null);
        navigate('/admin/project');
    };

    const [selectedProject, setSelectedProject] = useState<any>(null);

    if (!idToken) return <div>Not authenticated</div>;

    if (projectsIsLoading) {
        return (
            <div>
                <div style={styles.box}>
                    <h1>Projects</h1>
                    <CreateProject />
                </div>
                <div style={styles.skeletonContainer}>
                    <Skeleton count={2} height={30} style={styles.skeleton} />
                </div>
            </div>
        )
    }

    if (projectsIsError) return <div>Error: {JSON.stringify(projectsError)}</div>;

    if (projectsData && projectsData?.projects) {
        return (
            <div>
                <div style={styles.box}>
                    <h1>Projects</h1>
                    <CreateProject />
                </div>
                <div style={{ margin: '0 0 40px 0' }}>
                    {projectsData?.projects?.length ? (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Select</th>
                                    <th style={styles.th}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectsData?.projects
                                    .filter((project: Project) => !project.deleted)
                                    .map((project: Project, index: number) => (
                                        <tr key={index} style={styles.tr}>
                                            <td style={styles.td}>{project.name}</td>
                                            <td style={{ ...styles.td, ...styles.actionColumn }}>
                                                {selectedProject === project ? (
                                                    <button onClick={handleDeselect} style={styles.deselectButton}>Unselect</button>
                                                ) : (
                                                    <button onClick={() => handleSelect(project)} style={styles.selectButton}>Select</button>
                                                )}
                                            </td>
                                            <td style={{ ...styles.td, ...styles.actionColumn }}>
                                                <DeleteProject projectId={project.id} projectName={project.name} />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <h1>No projects!</h1>
                    )}
                </div>
                <Outlet />
            </div>
        );
    }
}

const styles = {
    deselectButton: {
        padding: '0.5rem 1rem',
        border: '1px solid #84ADFF',
        backgroundColor: '#002266',
        color: '#F5F8FF',
        borderRadius: '16px',
        cursor: 'pointer',
    },
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
