import { useIntl } from "react-intl";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Menu, Typography } from "antd";
import { Avatar } from "antd";
import { Popover } from "antd";

import {
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { useAppSelector } from "../../hooks";
import { currentUser as _currentUser } from "../../reducers/current-user";
import { TooltipPlacement } from "antd/lib/tooltip";
import SettingModal from "./setting/SettingModal";
import { AdminIcon } from "../../assets/icon";
import User from "./User";
import { fullUrl } from "../../utils";

const { Title, Paragraph } = Typography;

interface IWidget {
  placement?: TooltipPlacement;
  style?: React.CSSProperties;
}

const SignInAvatarWidget = ({ style, placement = "bottomRight" }: IWidget) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [settingOpen, setSettingOpen] = useState(false);

  const user = useAppSelector(_currentUser);

  console.debug("user", user);

  const canManage =
    user?.roles?.includes("root") || user?.roles?.includes("administrator");

  if (typeof user === "undefined") {
    return (
      <Link to="/anonymous/users/sign-in">
        {intl.formatMessage({
          id: "nut.users.sign-in-up.title",
        })}
      </Link>
    );
  } else {
    const welcome = (
      <Paragraph>
        <Title level={3} style={{ fontSize: 22 }}>
          {user.nickName}@{user.realName}
        </Title>
        <Paragraph style={{ textAlign: "right", paddingTop: 30 }}>
          {intl.formatMessage({
            id: "buttons.welcome",
          })}
        </Paragraph>
      </Paragraph>
    );

    return (
      <>
        <Popover
          content={
            <div>
              <>{welcome}</>
              <Divider></Divider>
              <Menu
                style={{ width: 256 }}
                mode={"inline"}
                selectable={false}
                items={[
                  {
                    key: "account",
                    label: "选择账户",
                    icon: <UserOutlined />,
                    children: [
                      {
                        key: user.realName,
                        label: <User {...user} />,
                      },
                    ],
                  },
                  {
                    key: "setting",
                    label: "设置",
                    icon: <SettingOutlined />,
                  },
                  {
                    key: "admin",
                    label: intl.formatMessage({
                      id: "buttons.admin",
                    }),
                    icon: <AdminIcon />,
                    disabled: !canManage,
                  },
                  {
                    key: "blog",
                    label: intl.formatMessage({
                      id: "columns.library.blog.label",
                    }),
                    icon: <HomeOutlined key="home" />,
                  },
                  {
                    key: "logout",
                    label: intl.formatMessage({
                      id: "buttons.sign-out",
                    }),
                    icon: <LogoutOutlined />,
                  },
                ].filter((value) => !value.disabled)}
                onClick={(info) => {
                  switch (info.key) {
                    case "setting":
                      setSettingOpen(true);
                      break;
                    case "admin":
                      window.open(fullUrl(`/admin`), "_blank");
                      break;
                    case "blog":
                      const blog = `/blog/${user.realName}/overview`;
                      window.open(fullUrl(blog), "_blank");
                      break;
                    case "logout":
                      sessionStorage.removeItem("token");
                      localStorage.removeItem("token");
                      navigate("/anonymous/users/sign-in");
                      break;
                  }
                }}
              />
            </div>
          }
          placement={placement}
        >
          <span style={style}>
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
              src={user?.avatar}
              size="small"
            >
              {user.nickName?.slice(0, 2)}
            </Avatar>
          </span>
        </Popover>
        <SettingModal
          open={settingOpen}
          onClose={() => setSettingOpen(false)}
        />
      </>
    );
  }
};

export default SignInAvatarWidget;
