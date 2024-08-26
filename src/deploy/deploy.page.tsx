import { useParams } from "react-router-dom";
import { CreateDeployment } from "./createDeploy.component";

export const DeployPage = () => {
    const params = useParams();
    const { projectId, mfeId, versionId } = params as any;
    return (
        <div>
            <h2>{versionId} &gt; Deploy</h2>
            <CreateDeployment
                projectId={projectId}
                microFrontendId={mfeId}
                versionId={versionId}
            />
        </div>
    )
}