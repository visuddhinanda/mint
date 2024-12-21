import { Button, Dropdown, Popconfirm, Space, message } from "antd";
import {
  CheckOutlined,
  ArrowLeftOutlined,
  CodeSandboxOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  EditOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import type { MenuProps, PopconfirmProps } from "antd";

import {
  ITaskData,
  ITaskListResponse,
  ITaskResponse,
  ITaskUpdateRequest,
  TTaskStatus,
} from "../api/task";
import { patch } from "../../request";

export type TRelation = "pre" | "next";
interface IWidget {
  task?: ITaskData;
  studioName?: string;
  onChange?: (task: ITaskData[]) => void;
  onEdit?: () => void;
  onPreTask?: (type: TRelation) => void;
}
const TaskEditButton = ({ task, onChange, onEdit, onPreTask }: IWidget) => {
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

  const setStatus = (setting: ITaskUpdateRequest) => {
    const url = `/v2/task-status/${setting.id}`;

    patch<ITaskUpdateRequest, ITaskListResponse>(url, setting).then((json) => {
      if (json.ok) {
        message.success("Success");
        onChange && onChange(json.data.rows);
      } else {
        message.error(json.message);
      }
    });
  };

  let newStatus: TTaskStatus = "pending";
  let buttonText = "发布";
  switch (task?.status) {
    case "pending":
      newStatus = "published";
      buttonText = "发布";
      break;
    case "published":
      newStatus = "running";
      buttonText = "领取";

      break;
    case "running":
      newStatus = "done";
      buttonText = "完成任务";

      break;
    case "done":
      newStatus = "restarted";
      buttonText = "重做";
      break;
    case "restarted":
      newStatus = "done";
      buttonText = "完成任务";
      break;
    default:
      break;
  }

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
    if (task?.id) {
      setStatus({
        id: task.id,
        status: e.key,
        studio_name: "",
      });
    }
  };

  interface IStatusMenu {
    label: string;
    key: TTaskStatus;
    disabled?: boolean;
  }

  const requested_restart_enable =
    task?.type === "instance" &&
    task.status === "running" &&
    task.pre_task &&
    task.pre_task?.length > 0;
  const items: IStatusMenu[] = [
    {
      key: "pending",
      label: intl.formatMessage({
        id: "buttons.task.status.change.to.pending",
      }),
      disabled: task?.type === "instance",
    },
    {
      key: "published",
      label: intl.formatMessage({
        id: "buttons.task.status.change.to.published",
      }),
      disabled: task?.type === "instance",
    },
    {
      key: "running",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.running`,
      }),
    },
    {
      key: "done",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.done`,
      }),
    },
    {
      key: "restarted",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.restarted`,
      }),
    },
    {
      key: "requested_restart",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.requested_restart`,
      }),
      disabled: !requested_restart_enable,
    },
  ];

  const menuProps = {
    items: items,
    onClick: handleMenuClick,
  };

  const mainMenuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: intl.formatMessage({ id: "buttons.edit" }),
      icon: <EditOutlined />,
    },
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
      case "edit":
        onEdit && onEdit();
        break;
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

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    if (task?.id) {
      setStatus({
        id: task.id,
        status: newStatus,
        studio_name: "",
      });
    }
  };

  return (
    <Space>
      <Popconfirm
        title={intl.formatMessage(
          { id: "message.task.status.change" },
          { status: newStatus }
        )}
        onConfirm={confirm}
        okText="Yes"
        cancelText="No"
      >
        {task?.type === "workflow" || requested_restart_enable ? (
          <Dropdown.Button type="primary" trigger={["click"]} menu={menuProps}>
            <CheckOutlined />
            {buttonText}
          </Dropdown.Button>
        ) : (
          <Button type="primary" icon={<CheckOutlined />}>
            {buttonText}
          </Button>
        )}
      </Popconfirm>
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
