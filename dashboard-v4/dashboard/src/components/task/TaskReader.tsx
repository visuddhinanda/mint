import { useEffect, useState } from "react";

import { Button, Divider, Space, Tag, Typography, message } from "antd";
import { CodeSandboxOutlined, EditOutlined } from "@ant-design/icons";

import { ITaskData, ITaskResponse, ITaskUpdateRequest } from "../api/task";
import { get, patch } from "../../request";
import MdView from "../template/MdView";
import User from "../auth/User";
import TimeShow from "../general/TimeShow";
import TaskEditButton, { TRelation } from "./TaskEditButton";
import PreTask from "./PreTask";
import Like from "../like/Like";
import Assignees from "./Assignees";
import PlanDate from "./PlanDate";
import TaskTitle from "./TaskTitle";
import TaskStatus from "./TaskStatus";

const { Text } = Typography;

export const Milestone = ({ task }: { task?: ITaskData }) => {
  return task?.is_milestone ? (
    <Tag icon={<CodeSandboxOutlined />} color="error">
      里程碑
    </Tag>
  ) : null;
};

interface IWidget {
  taskId?: string;

  onChange?: (data: ITaskData[]) => void;
  onEdit?: () => void;
}
const TaskReader = ({ taskId, onChange, onEdit }: IWidget) => {
  const [openPreTask, setOpenPreTask] = useState(false);
  const [openNextTask, setOpenNextTask] = useState(false);
  const [task, setTask] = useState<ITaskData>();
  useEffect(() => {
    const url = `/v2/task/${taskId}`;
    console.info("task api request", url);
    get<ITaskResponse>(url).then((json) => {
      console.info("task api response", json);
      if (json.ok) {
        setTask(json.data);
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
        setTask(json.data);
        onChange && onChange([json.data]);
      } else {
        message.error(json.message);
      }
    });
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Space>
          <TaskStatus task={task} />
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
            onChange={(tasks: ITaskData[]) => {
              setTask(tasks.find((value) => value.id === taskId));
              onChange && onChange(tasks);
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
      <TaskTitle
        task={task}
        onChange={(data) => {
          setTask(data[0]);
          onChange && onChange(data);
        }}
      />
      <div>
        <div>
          <Space>
            <User {...task?.editor} />
            <TimeShow updatedAt={task?.updated_at} />
            <Like resId={task?.id} resType="task" />
          </Space>
        </div>
        <div>
          <Space>
            <Text key={"1"}>指派给</Text>
            <Assignees
              key={"assignees"}
              task={task}
              onChange={(data) => {
                setTask(data[0]);
                onChange && onChange(data);
              }}
            />
            <Text>|</Text>
            <Text key={"2"}>执行人</Text>
            <User key={"executor"} {...task?.executor} />
          </Space>
        </div>
        <div>
          <PlanDate />
        </div>
      </div>
      <Divider />
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 8,
          }}
        >
          <span></span>
          <span>
            <Button icon={<EditOutlined />}>编辑</Button>
          </span>
        </div>
        <MdView html={task?.html} />
      </div>
    </div>
  );
};
export default TaskReader;
