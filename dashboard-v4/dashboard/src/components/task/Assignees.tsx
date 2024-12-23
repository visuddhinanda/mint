import { Avatar, Space, Typography } from "antd";
import { TeamOutlined } from "@ant-design/icons";

import { ITaskData } from "../api/task";
import User from "../auth/User";
const { Text } = Typography;

interface IWidget {
  task?: ITaskData;
  showIcon?: boolean;
  readonly?: boolean;
}
const Assignees = ({ task, showIcon = false, readonly = false }: IWidget) => {
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
      <Avatar.Group>
        {task?.assignees?.map((item, id) => {
          return <User {...item} key={id} showName={false} />;
        })}
      </Avatar.Group>
    </Space>
  );
};

export default Assignees;
