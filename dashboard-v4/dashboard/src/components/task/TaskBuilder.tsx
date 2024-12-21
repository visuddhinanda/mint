import { Button, Divider, message, Modal, Steps } from "antd";

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
import ChapterToc from "../article/ChapterToc";
import { IChapterToc } from "../api/Corpus";
import { post } from "../../request";

interface IModal {
  tiger?: React.ReactNode;
  studioName?: string;
  book?: number;
  para?: number;
  open?: boolean;
  onClose?: () => void;
}
export const TaskBuilderModal = ({
  tiger,
  studioName,
  book,
  para,
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
        <TaskBuilder
          style={{ marginTop: 20 }}
          studioName={studioName}
          book={book}
          para={para}
        />
      </Modal>
    </>
  );
};

interface IWidget {
  studioName?: string;
  book?: number;
  para?: number;
  style?: React.CSSProperties;
}
const TaskBuilder = ({ studioName, book, para, style }: IWidget) => {
  const [current, setCurrent] = useState(0);
  const [workflow, setWorkflow] = useState<ITaskData[]>();
  const [chapter, setChapter] = useState<IChapterToc[]>();
  const [messages, setMessages] = useState<string[]>([]);
  const steps = [
    {
      title: "章节选择",
      content: (
        <ChapterToc
          book={book}
          para={para}
          onData={(data) => setChapter(data)}
        />
      ),
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
              if (!studioName || !chapter) {
                return;
              }
              //生成projects
              setMessages((origin) => [...origin, "正在生成任务组……"]);
              const url = "/v2/project-tree";
              const values: IProjectTreeInsertRequest = {
                studio_name: studioName,
                data: chapter.map((item, id) => {
                  return {
                    id: item.paragraph.toString(),
                    title: item.text,
                    type: "instance",
                    parent_id: item.parent.toString(),
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

export default TaskBuilder;
