import React, { useState } from "react";
import { IProjectData, ITaskData } from "../api/task";
import ProjectList, { TView } from "./ProjectList";
import ProjectTask from "./ProjectTask";
import { Button, Card, Modal, Tree } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Key } from "antd/es/table/interface";

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
  const [view, setView] = useState<TView>("studio");
  return (
    <div style={{ display: "flex" }}>
      <div style={{ minWidth: 200, flex: 1 }}>
        <Tree
          multiple={false}
          defaultSelectedKeys={["studio"]}
          treeData={[
            { title: "my", key: "studio" },
            { title: "shared", key: "shared" },
            { title: "community", key: "community" },
            { title: "authors", key: "authors" },
          ]}
          onSelect={(selectedKeys: Key[]) => {
            console.debug("selectedKeys", selectedKeys);
            if (selectedKeys.length > 0) {
              setProject(undefined);
              setView(selectedKeys[0].toString() as TView);
            }
          }}
        />
      </div>
      <div style={{ flex: 5 }}>
        <div style={{ display: project ? "block" : "none" }}>
          <Card
            title={
              project ? (
                <>
                  <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => setProject(undefined)}
                  />
                  {project.title}
                </>
              ) : (
                "请选择一个工作流"
              )
            }
          >
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
        <div style={{ display: project ? "none" : "block" }}>
          <ProjectList
            studioName={studioName}
            view={view}
            type="workflow"
            readonly
            onSelect={(data: IProjectData) => setProject(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Workflow;
