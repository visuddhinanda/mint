import React, { useState } from "react";
import { IProjectData, ITaskData } from "../api/task";
import ProjectList from "./ProjectList";
import ProjectTask from "./ProjectTask";
import { Card, Modal } from "antd";

interface IModal {
  tiger?: React.ReactNode;
  studioName?: string;
  onSelect?: (data: IProjectData) => void;
  onData?: (data: ITaskData[]) => void;
}
export const WorkflowModal = ({
  tiger,
  studioName,
  onSelect,
  onData,
}: IModal) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ITaskData[]>();
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    onData && data && onData(data);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <div onClick={() => showModal()}>{tiger}</div>
      <Modal
        destroyOnClose={true}
        width={1200}
        style={{ top: 10 }}
        title={""}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Workflow studioName={studioName} onData={(data) => setData(data)} />
      </Modal>
    </>
  );
};

interface IWidget {
  studioName?: string;
  onSelect?: (data: IProjectData) => void;
  onData?: (data: ITaskData[]) => void;
}

const Workflow = ({ studioName, onSelect, onData }: IWidget) => {
  const [project, setProject] = useState<IProjectData>();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ minWidth: 300, flex: 1 }}>
        <ProjectList
          studioName={studioName}
          type="workflow"
          readonly
          onSelect={(data: IProjectData) => setProject(data)}
        />
      </div>
      <div style={{ flex: 3 }}>
        <Card title={project ? project.title : "请选择一个工作流"}>
          {project ? (
            <ProjectTask
              studioName={studioName}
              projectId={project.id}
              readonly
              onChange={onData}
            />
          ) : (
            <></>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Workflow;
