import { DropdownButtonType } from "antd/lib/dropdown/dropdown-button";
import {
  Dropdown,
  MenuProps,
  message,
  Popconfirm,
  PopconfirmProps,
} from "antd";
import { useIntl } from "react-intl";
import { CheckOutlined } from "@ant-design/icons";

import {
  ITaskData,
  ITaskListResponse,
  ITaskUpdateRequest,
  TTaskStatus,
} from "../api/task";
import { patch } from "../../request";
import TaskStatus from "./TaskStatus";

interface IWidget {
  type?: "button" | "tag";
  task?: ITaskData;
  buttonType?: DropdownButtonType;
  onChange?: (task: ITaskData[]) => void;
}
const TaskStatusButton = ({
  type = "button",
  task,
  buttonType = "primary",
  onChange,
}: IWidget) => {
  interface IStatusMenu {
    label: string;
    key: TTaskStatus;
    disabled?: boolean;
  }
  const intl = useIntl();

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

  const requested_restart_enable =
    task?.type === "instance" &&
    task.status === "running" &&
    task.pre_task &&
    task.pre_task?.length > 0;
  let menuEnable: TTaskStatus[] = [];
  switch (task?.status) {
    case "pending":
      menuEnable = ["published"];
      break;
    case "published":
      menuEnable = ["pending", "running"];
      break;
    case "running":
      menuEnable = [
        "done",
        requested_restart_enable ? "requested_restart" : "done",
      ];
      break;
    case "done":
      menuEnable = ["restarted"];
      break;
    case "restarted":
      menuEnable = ["done"];
      break;
  }
  const items: IStatusMenu[] = [
    {
      key: "pending",
      label: intl.formatMessage({
        id: "buttons.task.status.change.to.pending",
      }),
      disabled: task?.type === "instance" && !menuEnable.includes("pending"),
    },
    {
      key: "published",
      label: intl.formatMessage({
        id: "buttons.task.status.change.to.published",
      }),
      disabled: task?.type === "instance" && !menuEnable.includes("published"),
    },
    {
      key: "running",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.running`,
      }),
      disabled: task?.type === "instance" && !menuEnable.includes("running"),
    },
    {
      key: "done",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.done`,
      }),
      disabled: task?.type === "instance" && !menuEnable.includes("done"),
    },
    {
      key: "restarted",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.restarted`,
      }),
      disabled: task?.type === "instance" && !menuEnable.includes("restarted"),
    },
    {
      key: "requested_restart",
      label: intl.formatMessage({
        id: `buttons.task.status.change.to.requested_restart`,
      }),
      disabled:
        task?.type === "instance" && !menuEnable.includes("requested_restart"),
    },
  ];
  const menuProps = {
    items: items,
    onClick: handleMenuClick,
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
  return (
    <Popconfirm
      title={intl.formatMessage(
        { id: "message.task.status.change" },
        { status: newStatus }
      )}
      onConfirm={confirm}
      okText="Yes"
      cancelText="No"
    >
      {type === "button" ? (
        <Dropdown.Button type={buttonType} trigger={["click"]} menu={menuProps}>
          <CheckOutlined />
          {buttonText}
        </Dropdown.Button>
      ) : (
        <Dropdown placement="bottomLeft" menu={menuProps}>
          <span>
            <TaskStatus task={task} />
          </span>
        </Dropdown>
      )}
    </Popconfirm>
  );
};

export default TaskStatusButton;
