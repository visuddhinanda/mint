import React, { useState } from "react";
import { IProjectData } from "../api/task";
import ProjectList from "./ProjectList";
import ProjectTask from "./ProjectTask";
import { Modal } from "antd";

interface IModal {
  tiger?: React.ReactNode;
  studioName?: string;
  onSelect?: (data: IProjectData) => void;
}
export const WorkflowModal = ({ tiger, studioName, onSelect }: IModal) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
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
        width={700}
        title={""}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Workflow />
      </Modal>
    </>
  );
};

interface IWidget {
  studioName?: string;
  onSelect?: (data: IProjectData) => void;
}

const Workflow = ({ studioName, onSelect }: IWidget) => {
  const [projectId, setProjectId] = useState<string>();
  return (
    <div style={{ display: "flex" }}>
      <div style={{ minWidth: 300, flex: 1 }}>
        <ProjectList
          studioName={studioName}
          type="workflow"
          onSelect={(data) => setProjectId(data.id)}
        />
      </div>
      <div style={{ flex: 3 }}>
        <ProjectTask studioName={studioName} projectId={projectId} />
      </div>
    </div>
  );
};

export default Workflow;
