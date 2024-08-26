import { Outlet, useParams } from "react-router-dom";
import { CreateMicroFrontend } from "./createMfe.component";
import { ListMfe } from "./listMfe.component";
import { useQueryClient } from 'react-query';

const capitalizeFirstLetter = (string: string) => {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1) ?? '';
}

export const MFEPage = () => {
    const { projectId, mfeId } = useParams<{ projectId: string; mfeId: string }>();
    const queryClient = useQueryClient();
    const projects: any = queryClient.getQueryData(['projects']);
    const data = projects?.projects!.find((project: any) => project.id === projectId);
    return (
        <div>
            <div>
                <div style={styles.box}>
                    <h2>{capitalizeFirstLetter(data?.name) ?? 'unknown'} &gt; Micro Frontends </h2>
                    <CreateMicroFrontend projectId={projectId!} />
                </div>
                <ListMfe projectId={projectId!} />
                <Outlet />
            </div>
        </div>
    )
}

const styles = {
    box: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};
