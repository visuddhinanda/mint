import { DropdownButtonType } from "antd/lib/dropdown/dropdown-button";
import {
  Button,
  Dropdown,
  MenuProps,
  message,
  Popconfirm,
  PopconfirmProps,
} from "antd";
import { useIntl } from "react-intl";
import {
  CheckOutlined,
  LoadingOutlined,
  DownOutlined,
} from "@ant-design/icons";

import {
  ITaskData,
  ITaskListResponse,
  ITaskUpdateRequest,
  TTaskStatus,
} from "../api/task";
import { patch } from "../../request";
import TaskStatus from "./TaskStatus";
import { useState } from "react";

interface IStatusMenu {
  label: string;
  key: TTaskStatus;
  disabled?: boolean;
}

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
  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  const setStatus = (setting: ITaskUpdateRequest) => {
    const url = `/v2/task-status/${setting.id}`;
    console.info("api request", url, setting);
    setLoading(true);
    patch<ITaskUpdateRequest, ITaskListResponse>(url, setting)
      .then((json) => {
        console.info("api response", json);
        if (json.ok) {
          message.success("Success");
          onChange && onChange(json.data.rows);
        } else {
          message.error(json.message);
        }
      })
      .finally(() => setLoading(false));
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
    case "requested_restart":
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

  switch (task?.status) {
    case "pending":
      newStatus = "published";
      break;
    case "published":
      newStatus = "running";
      break;
    case "running":
      newStatus = "done";
      break;
    case "done":
      newStatus = "restarted";
      break;
    case "restarted":
      newStatus = "done";
      break;
    case "requested_restart":
      newStatus = "done";
      break;
    default:
      break;
  }

  let buttonText = intl.formatMessage({
    id: `buttons.task.status.change.to.${newStatus}`,
    defaultMessage: "unknown",
  });
  return type === "button" ? (
    <Popconfirm
      title={intl.formatMessage(
        { id: "message.task.status.change" },
        { status: newStatus }
      )}
      onConfirm={confirm}
      okText="Yes"
      cancelText="No"
    >
      <Dropdown.Button
        type={buttonType}
        trigger={["click"]}
        icon={<DownOutlined />}
        menu={menuProps}
        buttonsRender={([leftButton, rightButton]) => {
          return [
            <Button
              disabled={task?.type === "workflow"}
              icon={
                loading ? (
                  <LoadingOutlined />
                ) : newStatus === "done" ? (
                  <CheckOutlined />
                ) : (
                  <></>
                )
              }
            >
              {buttonText}
            </Button>,
            rightButton,
          ];
        }}
      />
    </Popconfirm>
  ) : (
    <Dropdown placement="bottomLeft" menu={menuProps}>
      <span>{loading ? <LoadingOutlined /> : <TaskStatus task={task} />}</span>
    </Dropdown>
  );
};

export default TaskStatusButton;
