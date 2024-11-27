import { Button, List, Popover, Tag, Typography } from "antd";
import { ITaskData, ITaskListResponse } from "../api/task";
import { get } from "../../request";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { type } from "os";
import { TRelation } from "./TaskEditButton";

const { Text } = Typography;

interface IProTaskListProps {
  task?: ITaskData;
  type: TRelation;
  onClick?: (data?: ITaskData | null) => void;
  onClose?: () => void;
}
const ProTaskList = ({ task, type, onClick, onClose }: IProTaskListProps) => {
  const [res, setRes] = useState<ITaskData[]>();
  useEffect(() => {
    const url = `/v2/task?view=project&project_id=${task?.project_id}`;

    console.info("api request", url);
    get<ITaskListResponse>(url).then((json) => {
      console.info("project api response", json);
      const res = json.data.rows;
      setRes(res);
    });
  }, [task?.project_id]);

  return (
    <List
      header={
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text strong>{type === "pre" ? "前置任务" : "后置任务"}</Text>
            <div>
              <Button type="link" onClick={onClose}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      }
      footer={false}
      dataSource={res}
      renderItem={(item) => (
        <List.Item
          onClick={() => {
            onClick && onClick(item);
          }}
        >
          {item.title}
        </List.Item>
      )}
    />
  );
};

interface IWidget {
  task?: ITaskData;
  open?: boolean;
  type: TRelation;
  onClick?: (data?: ITaskData | null) => void;
  onClose?: () => void;
}
const PreTask = ({ task, type, open = false, onClick, onClose }: IWidget) => {
  const preTaskShow = open || task?.pre_task;
  const nextTaskShow = open || task?.next_task;
  let tag = <></>;
  if (preTaskShow && type === "pre") {
    tag = (
      <Tag color="warning" icon={<ArrowLeftOutlined />}>
        {task?.pre_task?.title}
      </Tag>
    );
  } else if (nextTaskShow && type === "next") {
    tag = (
      <Tag color="warning" icon={<ArrowRightOutlined />}>
        {task?.next_task?.title}
      </Tag>
    );
  }
  return (
    <Popover
      trigger="click"
      open={open}
      content={
        <div style={{ width: 500 }}>
          <ProTaskList
            type={type}
            task={task}
            onClick={onClick}
            onClose={onClose}
          />
        </div>
      }
    >
      {tag}
    </Popover>
  );
};
export default PreTask;
