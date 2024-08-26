import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { CreateVersion } from "./createVersion.comonent";
import { useAuth } from "../auth/auth.context";
import { ListVersions } from "./listVersion.component";

const getVersions = async (idToken: string, projectId: string, microFrontendId: string) => {
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

const capitalizeFirstLetter = (string: string) => {
    if (!string) {
        return '';
    }
    return string?.charAt(0)?.toUpperCase() + string?.slice(1) ?? '';
}

export const VersionPage = () => {
    const params = useParams<{ projectId: string; mfeId: string }>();
    const { projectId, mfeId } = params;
    const { idToken } = useAuth();

    useQuery(['versions', projectId, mfeId], () => getVersions(idToken, projectId!, mfeId!), {
        enabled: !!idToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    const queryClient = useQueryClient();
    const mfe: any = queryClient.getQueryData(['projectMFEs', projectId]);
    const mfeDetails = mfe?.microFrontends.find((mfe: any) => mfe.id === mfeId);

    return (
        <div>
            <h2>{capitalizeFirstLetter(mfeDetails?.name)} &gt; Version </h2>
            <CreateVersion projectId={projectId!} microFrontendId={mfeId!} />
            <ListVersions projectId={projectId!} microFrontendId={mfeId!} />
        </div>
    )
}