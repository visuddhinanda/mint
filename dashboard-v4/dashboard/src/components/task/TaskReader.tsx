import { useEffect, useState } from "react";

import { Divider, Skeleton, Space, Tag, Typography, message } from "antd";
import { CodeSandboxOutlined } from "@ant-design/icons";

import { ITaskData, ITaskResponse, ITaskUpdateRequest } from "../api/task";
import { get, patch } from "../../request";
import User from "../auth/User";
import TimeShow from "../general/TimeShow";
import TaskEditButton, { TRelation } from "./TaskEditButton";
import PreTask from "./PreTask";
import Like from "../like/Like";
import Assignees from "./Assignees";
import PlanDate from "./PlanDate";
import TaskTitle from "./TaskTitle";
import TaskStatus from "./TaskStatus";
import Description from "./Description";
import Category from "./Category";
import { useIntl } from "react-intl";

const { Text } = Typography;

export const Milestone = ({ task }: { task?: ITaskData }) => {
  const intl = useIntl();

  return task?.is_milestone ? (
    <Tag icon={<CodeSandboxOutlined />} color="error">
      {intl.formatMessage({ id: "labels.milestone" })}
    </Tag>
  ) : null;
};

interface IWidget {
  taskId?: string;
  onChange?: (data: ITaskData[]) => void;
  onDiscussion?: () => void;
}
const TaskReader = ({ taskId, onChange, onDiscussion }: IWidget) => {
  const [openPreTask, setOpenPreTask] = useState(false);
  const [openNextTask, setOpenNextTask] = useState(false);
  const [task, setTask] = useState<ITaskData>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const url = `/v2/task/${taskId}`;
    console.info("task api request", url);
    setLoading(true);
    get<ITaskResponse>(url)
      .then((json) => {
        console.info("task api response", json);
        if (json.ok) {
          setTask(json.data);
        }
      })
      .finally(() => setLoading(false));
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
  return loading ? (
    <Skeleton active />
  ) : (
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Space>
          <User {...task?.editor} />
          <TimeShow updatedAt={task?.updated_at} />
          <Like resId={task?.id} resType="task" />
        </Space>
        <Space
          style={{ display: task?.type === "workflow" ? "none" : "unset" }}
        >
          <Text type="secondary" key={"2"}>
            执行人
          </Text>
          <User key={"executor"} {...task?.executor} />
        </Space>
        <Space>
          <Text type="secondary" key={"1"}>
            指派给
          </Text>
          <Assignees
            key={"assignees"}
            task={task}
            onChange={(data) => {
              setTask(data[0]);
              onChange && onChange(data);
            }}
          />
        </Space>
        <Space>
          <Text type="secondary">起止日期</Text>
          <div style={{ width: 400 }}>
            <PlanDate />
          </div>
        </Space>
        <Space>
          <Text type="secondary">类别</Text>
          <Category
            task={task}
            onChange={(data) => {
              setTask(data[0]);
              onChange && onChange(data);
            }}
          />
        </Space>
      </div>
      <Divider />
      <Description
        task={task}
        onChange={(data) => {
          setTask(data[0]);
          onChange && onChange(data);
        }}
        onDiscussion={onDiscussion}
      />
    </div>
  );
};
export default TaskReader;
