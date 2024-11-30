import { Avatar, Popover, Space, Typography } from "antd";

import { getAvatarColor } from "./Studio";
const { Text } = Typography;

export interface IUser {
  id: string;
  nickName: string;
  userName: string;
  avatar?: string;
}

interface IWidget {
  id?: string;
  nickName?: string;
  userName?: string;
  avatar?: string;
  showAvatar?: boolean;
  showName?: boolean;
  showUserName?: boolean;
}
const UserWidget = ({
  nickName,
  userName,
  avatar,
  showAvatar = true,
  showName = true,
  showUserName = false,
}: IWidget) => {
  return (
    <Popover
      content={
        <div>
          <div>
            <Avatar
              size="large"
              src={avatar}
              style={{ backgroundColor: getAvatarColor(nickName) }}
            >
              {nickName?.slice(0, 2)}
            </Avatar>
          </div>
          <Text>{`${nickName}@${userName}`}</Text>
        </div>
      }
    >
      <Space>
        {showAvatar ? (
          <Avatar
            size={"small"}
            src={avatar}
            style={{ backgroundColor: getAvatarColor(nickName) }}
          >
            {nickName?.slice(0, 2)}
          </Avatar>
        ) : undefined}
        {showName ? <Text>{nickName}</Text> : undefined}
        {showName && showUserName ? <Text>@</Text> : undefined}
        {showUserName ? <Text>{userName}</Text> : undefined}
      </Space>
    </Popover>
  );
};

export default UserWidget;
