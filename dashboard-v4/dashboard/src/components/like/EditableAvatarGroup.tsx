import User, { IUser } from "../auth/User";
import { Popover, Space } from "antd";
import WatchList from "./WatchList";
import { IDataType, WatchAddButton } from "./WatchAdd";

interface IWidget {
  users?: IUser[];
  onFinish?: ((formData: IDataType) => Promise<boolean | void>) | undefined;
}
const EditableAvatarGroup = ({ users, onFinish }: IWidget) => {
  return (
    <Space>
      <Popover trigger={"click"} content={<WatchList data={users} />}>
        <div>
          {users?.map((item, id) => {
            return (
              <span
                key={id}
                style={{ display: "inline-block", marginRight: -8 }}
              >
                <User {...item} showName={false} hidePopover />
              </span>
            );
          })}
        </div>
      </Popover>
      <WatchAddButton data={users} onFinish={onFinish} />
    </Space>
  );
};

export default EditableAvatarGroup;
