import { useEffect, useState } from "react";

import { Divider, Space, Tag, Typography, message } from "antd";
import { CodeSandboxOutlined } from "@ant-design/icons";

import { ITaskData, ITaskResponse, ITaskUpdateRequest } from "../api/task";
import { get, patch } from "../../request";
import MdView from "../template/MdView";
import User from "../auth/User";
import TimeShow from "../general/TimeShow";
import TaskEditButton, { TRelation } from "./TaskEditButton";
import PreTask from "./PreTask";
import Like from "../like/Like";

const { Title } = Typography;

export const Milestone = ({ task }: { task?: ITaskData }) => {
  return task?.is_milestone ? (
    <Tag icon={<CodeSandboxOutlined />} color="error">
      里程碑
    </Tag>
  ) : null;
};

export const Status = ({ task }: { task?: ITaskData }) => {
  return task?.status === "pending" ? (
    <Tag color="default">未发布</Tag>
  ) : task?.status === "published" ? (
    <Tag color="warning">待领取</Tag>
  ) : task?.status === "running" ? (
    <Tag color="processing">进行中</Tag>
  ) : task?.status === "done" ? (
    <Tag color="success">已完成</Tag>
  ) : task?.status === "restarted" ? (
    <Tag color="error">已重启</Tag>
  ) : null;
};

interface IWidget {
  taskId?: string;
  task?: ITaskData;
  onLoad?: (data: ITaskData) => void;
  onChange?: (data: ITaskData) => void;
  onEdit?: () => void;
}
const TaskReader = ({ taskId, task, onLoad, onChange, onEdit }: IWidget) => {
  const [openPreTask, setOpenPreTask] = useState(false);
  const [openNextTask, setOpenNextTask] = useState(false);
  useEffect(() => {
    const url = `/v2/task/${taskId}`;
    console.info("api request", url);
    get<ITaskResponse>(url).then((json) => {
      if (json.ok) {
        onLoad && onLoad(json.data);
      }
    });
  }, [taskId]);

  const updatePreTask = (type: TRelation, data?: ITaskData | null) => {
    if (!taskId || !data) {
      return;
    }
    let setting: ITaskUpdateRequest = {
      id: taskId,
      studio_name: "",
    };
    if (type === "pre") {
      const hasPre = task?.pre_task?.find((value) => value.id === data.id);
      if (hasPre) {
        setting.pre_task_id = task?.pre_task
          ?.filter((value) => value.id !== data.id)
          .map((item) => item.id)
          .join();
      } else {
        const newRelation = task?.pre_task
          ? [...task.pre_task.map((item) => item.id), data.id]
          : [data.id];
        setting.pre_task_id = newRelation.join();
      }
    } else if (type === "next") {
      const hasPre = task?.next_task?.find((value) => value.id === data.id);
      if (hasPre) {
        setting.next_task_id = task?.next_task
          ?.filter((value) => value.id !== data.id)
          .map((item) => item.id)
          .join();
      } else {
        const newRelation = task?.next_task
          ? [...task.next_task.map((item) => item.id), data.id]
          : [data.id];
        setting.next_task_id = newRelation.join();
      }
    }

    const url = `/v2/task/${setting.id}`;
    console.info("api request", url, setting);
    patch<ITaskUpdateRequest, ITaskResponse>(url, setting).then((json) => {
      console.info("api response", json);
      if (json.ok) {
        message.success("Success");
        onChange && onChange(json.data);
      } else {
        message.error(json.message);
      }
    });
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Space>
          <Status task={task} />
          <Milestone task={task} />
          <PreTask
            task={task}
            open={openPreTask}
            type="pre"
            onClick={(data) => {
              updatePreTask("pre", data);
              setOpenPreTask(false);
            }}
            onTagClick={() => setOpenPreTask(true)}
            onClose={() => setOpenPreTask(false)}
          />
          <PreTask
            task={task}
            open={openNextTask}
            type="next"
            onClick={(data) => {
              updatePreTask("next", data);
              setOpenNextTask(false);
            }}
            onClose={() => setOpenNextTask(false)}
            onTagClick={() => setOpenNextTask(true)}
          />
        </Space>
        <div>
          <TaskEditButton
            task={task}
            onChange={(task: ITaskData) => {
              onChange && onChange(task);
            }}
            onEdit={onEdit}
            onPreTask={(type: TRelation) => {
              if (type === "pre") {
                setOpenPreTask(true);
              } else if (type === "next") {
                setOpenNextTask(true);
              }
            }}
          />
        </div>
      </div>
      <Title>{task?.title}</Title>
      <div>
        <Space>
          <User {...task?.editor} />
          <TimeShow updatedAt={task?.updated_at} />
          <Like resId={task?.id} resType="task" />
        </Space>
      </div>
      <Divider />
      <MdView html={task?.html} />
    </div>
  );
};
export default TaskReader;
