import { Button, Dropdown, Space, message } from "antd";
import {
  CheckOutlined,
  ArrowLeftOutlined,
  CodeSandboxOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  EditOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import {
  ITaskData,
  ITaskResponse,
  ITaskUpdateRequest,
  TTaskStatus,
} from "../api/task";
import { patch } from "../../request";
import { useIntl } from "react-intl";

export type TRelation = "pre" | "next";
interface IWidget {
  task?: ITaskData;
  studioName?: string;
  onChange?: (task: ITaskData) => void;
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
        onChange && onChange(json.data);
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

  return (
    <Space>
      <Dropdown.Button
        key={1}
        type="link"
        trigger={["click", "contextMenu"]}
        menu={{
          items: [
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
          ],
          onClick: (e) => {
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
          },
        }}
      >
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => {
            if (task?.id) {
              setValue({
                id: task.id,
                status: newStatus,
                studio_name: "",
              });
            }
          }}
        >
          {buttonText}
        </Button>
      </Dropdown.Button>
    </Space>
  );
};

export default TaskEditButton;
