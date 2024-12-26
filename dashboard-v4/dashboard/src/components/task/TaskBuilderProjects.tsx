import {
  Button,
  Divider,
  Input,
  message,
  Modal,
  Steps,
  Typography,
} from "antd";

import { useState } from "react";
import Workflow from "./Workflow";
import {
  IProjectTreeInsertRequest,
  IProjectTreeResponse,
  ITaskData,
  ITaskGroupInsertData,
  ITaskGroupInsertRequest,
  ITaskGroupResponse,
} from "../api/task";

import { post } from "../../request";

const { Paragraph } = Typography;

interface IBuildProjects {
  onChange?: (titles: string[]) => void;
}
const BuildProjects = ({ onChange }: IBuildProjects) => {
  const [projectsTitle, setProjectsTitle] = useState<string[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectTitlePerf, setProjectTitlePerf] = useState<string>("1");
  const [projectsCount, setProjectsCount] = useState<number>(0);

  const buildTitles = (base: string, perf: string, count: number): string[] => {
    return Array.from(Array(count).keys()).map((item) => {
      const sn = parseInt(perf) + item;
      return `${base}${sn}`;
    });
  };

  return (
    <div>
      <div>
        名称：
        <Input
          onChange={(e) => {
            setProjectTitle(e.target.value);
            const projects = buildTitles(
              e.target.value,
              projectTitlePerf,
              projectsCount
            );
            setProjectsTitle(projects);
            onChange && onChange(projects);
          }}
        />
      </div>
      <div>
        后缀：
        <Input
          onChange={(e) => {
            setProjectTitlePerf(e.target.value);
            const projects = buildTitles(
              projectTitle,
              e.target.value,
              projectsCount
            );
            setProjectsTitle(projects);
            onChange && onChange(projects);
          }}
        />
      </div>
      <div>
        数量：
        <Input
          onChange={(e) => {
            setProjectsCount(parseInt(e.target.value));
            const projects = buildTitles(
              projectTitle,
              projectTitlePerf,
              parseInt(e.target.value)
            );
            setProjectsTitle(projects);
            onChange && onChange(projects);
          }}
        />
      </div>
      <div>
        {projectsTitle.map((item, id) => {
          return <Paragraph key={id}>{item}</Paragraph>;
        })}
      </div>
    </div>
  );
};

interface IModal {
  tiger?: React.ReactNode;
  studioName?: string;
  parentId?: string;

  open?: boolean;
  onClose?: () => void;
}
export const TaskBuilderProjectsModal = ({
  tiger,
  studioName,
  parentId,
  open = false,
  onClose,
}: IModal) => {
  return (
    <>
      <Modal
        destroyOnClose={true}
        width={1400}
        style={{ top: 10 }}
        title={""}
        footer={false}
        open={open}
        onOk={onClose}
        onCancel={onClose}
      >
        <TaskBuilderProjects
          style={{ marginTop: 20 }}
          studioName={studioName}
          parentId={parentId}
        />
      </Modal>
    </>
  );
};

interface IWidget {
  studioName?: string;
  parentId?: string;
  style?: React.CSSProperties;
}
const TaskBuilderProjects = ({ studioName, parentId, style }: IWidget) => {
  const [current, setCurrent] = useState(0);
  const [workflow, setWorkflow] = useState<ITaskData[]>();
  const [projectsTitle, setProjectsTitle] = useState<string[]>();

  const [messages, setMessages] = useState<string[]>([]);
  const steps = [
    {
      title: "Projects",
      content: <BuildProjects onChange={setProjectsTitle} />,
    },
    {
      title: "工作流",
      content: (
        <Workflow
          studioName={studioName}
          onData={(data) => setWorkflow(data)}
        />
      ),
    },
    {
      title: "生成",
      content: (
        <div>
          {messages?.map((item, id) => {
            return <div key={id}>{item}</div>;
          })}
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div style={style}>
      <Steps current={current} items={items} />
      <div className="steps-content" style={{ minHeight: 400 }}>
        {steps[current].content}
      </div>
      <Divider></Divider>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          style={{ margin: "0 8px" }}
          disabled={current === 0}
          onClick={() => prev()}
        >
          Previous
        </Button>

        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={async () => {
              if (!studioName || !parentId || !projectsTitle) {
                return;
              }
              //生成projects
              setMessages((origin) => [...origin, "正在生成任务组……"]);
              const url = "/v2/project-tree";
              const values: IProjectTreeInsertRequest = {
                studio_name: studioName,
                data: projectsTitle.map((item, id) => {
                  return {
                    id: item,
                    title: item,
                    type: "instance",
                    parent_id: parentId,
                  };
                }),
              };
              console.info("api request", url, values);
              const res = await post<
                IProjectTreeInsertRequest,
                IProjectTreeResponse
              >(url, values);
              console.info("api response", res);
              if (!res.ok) {
                setMessages((origin) => [...origin, "正在生成任务组失败"]);
                return;
              } else {
                setMessages((origin) => [...origin, "生成任务组成功"]);
              }
              //生成tasks
              setMessages((origin) => [...origin, "正在生成任务……"]);
              const taskUrl = "/v2/task-group";
              if (!workflow) {
                return;
              }
              let taskData: ITaskGroupInsertData[] = res.data.leafs.map(
                (projectId) => {
                  return {
                    project_id: projectId,
                    tasks: workflow,
                  };
                }
              );

              console.info("api request", taskUrl, taskData);
              const taskRes = await post<
                ITaskGroupInsertRequest,
                ITaskGroupResponse
              >(taskUrl, { data: taskData });
              if (taskRes.ok) {
                message.success("ok");
                setMessages((origin) => [...origin, "生成任务成功"]);
              }
            }}
          >
            Done
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskBuilderProjects;
