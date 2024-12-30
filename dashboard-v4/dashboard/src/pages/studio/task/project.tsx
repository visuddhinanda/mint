import { useNavigate, useParams } from "react-router-dom";

import Project from "../../../components/task/Project";
import ProjectTask from "../../../components/task/ProjectTask";

const Widget = () => {
  const { studioname } = useParams();
  const { projectId } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <Project
        studioName={studioname}
        projectId={projectId}
        onSelect={(id: string) => {
          navigate(`/studio/${studioname}/task/project/${id}`);
        }}
      />
      <ProjectTask studioName={studioname} projectId={projectId} />
    </>
  );
};

export default Widget;
