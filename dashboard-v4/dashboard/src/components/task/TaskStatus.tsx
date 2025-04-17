import { Progress, Tag, Tooltip } from "antd";
import { ITaskData, ITaskResponse } from "../api/task";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { get } from "../../request";

interface IWidget {
  task?: ITaskData;
}
const TaskStatus = ({ task }: IWidget) => {
  const intl = useIntl();
  const [progress, setProgress] = useState(task?.progress);

  useEffect(() => {
    if (!task?.id) {
      return;
    }
    const query = () => {
      const url = `/v2/task/${task?.id}`;
      console.info("api request", url);
      get<ITaskResponse>(url).then((json) => {
        console.log("api response", json);
        if (json.ok) {
          setProgress(json.data.progress);
        }
      });
    };
    let timer = setInterval(query, 1000 * (60 + Math.random() * 10));
    return () => {
      clearInterval(timer);
    };
  }, [task?.id]);

  let color = "";
  switch (task?.status) {
    case "pending":
      color = "default";
      break;
    case "published":
      color = "orange";
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
    <>
      <Tag color={color}>
        {intl.formatMessage({
          id: `labels.task.status.${task?.status}`,
          defaultMessage: "unknown",
        })}
      </Tag>
      {task?.status === "running" ? (
        progress && progress > 0 ? (
          <div style={{ display: "inline-block", width: 80 }}>
            <Tooltip title={`${progress}%`}>
              <Progress percent={progress} size="small" showInfo={false} />
            </Tooltip>
          </div>
        ) : task?.executor?.roles?.includes("ai") ? (
          <>任务排队中</>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default TaskStatus;
