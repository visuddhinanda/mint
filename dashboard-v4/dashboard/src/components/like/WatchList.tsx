import { Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import User from "../auth/User";
import { ILikeData } from "../api/like";

interface IWidget {
  data?: ILikeData[];
}
const WatchList = ({ data }: IWidget) => {
  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          extra={[<Button type="text" danger icon={<DeleteOutlined />} />]}
        >
          <User {...item.user} />
        </List.Item>
      )}
    />
  );
};

export default WatchList;
