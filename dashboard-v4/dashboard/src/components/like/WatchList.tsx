import { Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import User, { IUser } from "../auth/User";

interface IWidget {
  data?: IUser[];
}
const WatchList = ({ data }: IWidget) => {
  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          extra={[<Button type="text" danger icon={<DeleteOutlined />} />]}
        >
          <User {...item} />
        </List.Item>
      )}
    />
  );
};

export default WatchList;
