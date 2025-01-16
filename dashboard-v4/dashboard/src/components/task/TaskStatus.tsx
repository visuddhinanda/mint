import { Tag } from "antd";
import { ITaskData } from "../api/task";
import { useIntl } from "react-intl";

const TaskStatus = ({ task }: { task?: ITaskData }) => {
  const intl = useIntl();

  let color = "";
  switch (task?.status) {
    case "pending":
      color = "default";
      break;
    case "published":
      color = "default";
      break;
    case "running":
      color = "processing";
      break;
    case "done":
      color = "success";
      break;
    case "restarted":
      color = "error";
      break;
    case "requested_restart":
      color = "warning";
      break;
  }
  return (
    <Tag color={color}>
      {intl.formatMessage({
        id: `labels.task.status.${task?.status}`,
        defaultMessage: "unknown",
      })}
    </Tag>
  );
};

export default TaskStatus;
