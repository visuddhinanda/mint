import { message, Space, Typography } from "antd";
import { TeamOutlined } from "@ant-design/icons";

import { ITaskData, ITaskResponse, ITaskUpdateRequest } from "../api/task";
import { IUser } from "../auth/User";
import EditableAvatarGroup from "../like/EditableAvatarGroup";
import { useEffect, useState } from "react";
import { IDataType } from "../like/WatchAdd";
import { patch } from "../../request";
const { Text } = Typography;

interface IWidget {
  task?: ITaskData;
  showIcon?: boolean;
  readonly?: boolean;
  onChange?: (data: ITaskData[]) => void;
}
const Assignees = ({
  task,
  showIcon = false,
  readonly = false,
  onChange,
}: IWidget) => {
  const [data, setData] = useState<IUser[] | null>();
  useEffect(() => setData(task?.assignees), [task]);
  return (
    <Space>
      {showIcon ? (
        <Text>
          <TeamOutlined />
          指派给
        </Text>
      ) : (
        <></>
      )}
      <EditableAvatarGroup
        users={data ?? undefined}
        onFinish={async (values: IDataType) => {
          if (!task) {
            console.error("no task");
            return;
          }
          let users: string[] = [];
          if (task.assignees_id) {
            users = task.assignees_id;
          }
          if (values.user_id) {
            users = [...users, values.user_id];
          }
          let setting: ITaskUpdateRequest = {
            id: task.id,
            studio_name: "",
            assignees_id: users,
          };
          const url = `/v2/task/${setting.id}`;
          console.info("api request", url, setting);
          patch<ITaskUpdateRequest, ITaskResponse>(url, setting).then(
            (json) => {
              console.info("api response", json);
              if (json.ok) {
                message.success("Success");
                onChange && onChange([json.data]);
              } else {
                message.error(json.message);
              }
            }
          );
        }}
      />
    </Space>
  );
};

export default Assignees;
