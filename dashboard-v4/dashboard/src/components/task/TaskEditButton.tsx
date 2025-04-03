import { Dropdown, Space, message } from "antd";
import {
  ArrowLeftOutlined,
  CodeSandboxOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import type { MenuProps } from "antd";

import { ITaskData, ITaskResponse, ITaskUpdateRequest } from "../api/task";
import { patch } from "../../request";
import TaskStatusButton from "./TaskStatusButton";

export type TRelation = "pre" | "next";
interface IWidget {
  task?: ITaskData;
  studioName?: string;
  onChange?: (task: ITaskData[]) => void;
  onPreTask?: (type: TRelation) => void;
}
const TaskEditButton = ({ task, onChange, onPreTask }: IWidget) => {
  const intl = useIntl();

  const setValue = (setting: ITaskUpdateRequest) => {
    const url = `/v2/task/${setting.id}`;

    patch<ITaskUpdateRequest, ITaskResponse>(url, setting).then((json) => {
      if (json.ok) {
        message.success("Success");
        onChange && onChange([json.data]);
      } else {
        message.error(json.message);
      }
    });
  };

  const mainMenuItems: MenuProps["items"] = [
    {
      key: "milestone",
      label: task?.is_milestone ? "取消里程碑" : "设为里程碑",
      icon: <CodeSandboxOutlined />,
    },
    {
      key: "pre-task",
      label: "设置前置任务",
      icon: <ArrowLeftOutlined />,
    },
    {
      key: "next-task",
      label: "设置后置任务",
      icon: <ArrowRightOutlined />,
    },
    {
      type: "divider",
    },
    {
      label: "历史记录",
      key: "timeline",
      icon: <FieldTimeOutlined />,
    },
    {
      label: "删除",
      key: "delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];
  const mainMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "milestone":
        if (task) {
          if (task.id) {
            setValue({
              id: task.id,
              is_milestone: !task.is_milestone,
              studio_name: task.owner?.realName ?? "",
            });
          }
        }
        break;
      case "pre-task":
        onPreTask && onPreTask("pre");
        break;
      case "next-task":
        onPreTask && onPreTask("next");
        break;
      default:
        break;
    }
  };

  return (
    <Space>
      <TaskStatusButton task={task} onChange={onChange} />
      <Dropdown.Button
        key={1}
        type="link"
        trigger={["click", "contextMenu"]}
        menu={{
          items: mainMenuItems,
          onClick: mainMenuClick,
        }}
      ></Dropdown.Button>
    </Space>
  );
};

export default TaskEditButton;
