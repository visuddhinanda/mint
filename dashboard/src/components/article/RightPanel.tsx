import { Affix, Button, Space, Tabs } from "antd";
import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

import { IChannel } from "../channel/Channel";
import ChannelPickerTable from "../channel/ChannelPickerTable";
import DictComponent from "../dict/DictComponent";
import { ArticleType } from "./Article";
import { useAppSelector } from "../../hooks";
import { openPanel, rightPanel } from "../../reducers/right-panel";
import store from "../../store";
import DiscussionBox from "../discussion/DiscussionBox";
import { show } from "../../reducers/discussion";
import { useIntl } from "react-intl";

export type TPanelName = "dict" | "channel" | "discussion" | "close" | "open";
interface IWidget {
  curr?: TPanelName;
  type: ArticleType;
  articleId: string;
  selectedChannelsId?: string[];
  onChannelSelect?: Function;
  onClose?: Function;
  onTabChange?: Function;
}
const RightPanelWidget = ({
  curr = "close",
  type,
  articleId,
  onChannelSelect,
  selectedChannelsId,
  onClose,
  onTabChange,
}: IWidget) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dict");
  const _openPanel = useAppSelector(rightPanel);
  const intl = useIntl();

  const divMinWidth = 400;
  const divMaxWidth = 700;
  const [divWidth, setDivWidth] = useState(divMinWidth);

  useEffect(() => {
    console.log("panel", _openPanel);
    if (typeof _openPanel !== "undefined") {
      if (typeof onTabChange !== "undefined") {
        onTabChange(_openPanel);
      }
      store.dispatch(openPanel(undefined));
    }
  }, [_openPanel]);

  useEffect(() => {
    switch (curr) {
      case "open":
        setOpen(true);
        break;
      case "dict":
        setOpen(true);
        setActiveTab(curr);
        break;
      case "channel":
        setOpen(true);
        setActiveTab(curr);
        break;
      case "discussion":
        setOpen(true);
        setActiveTab(curr);
        break;
      case "close":
        setOpen(false);
        break;
      default:
        setOpen(false);
        break;
    }
  }, [curr]);
  return (
    <Affix offsetTop={44}>
      <div
        key="panel"
        style={{
          width: divWidth,
          height: `calc(100vh - 44px)`,
          overflowY: "scroll",
          display: open ? "block" : "none",
          paddingLeft: 8,
        }}
      >
        <Tabs
          type="card"
          size="small"
          defaultActiveKey={curr}
          activeKey={activeTab}
          onChange={(activeKey: string) => setActiveTab(activeKey)}
          tabBarExtraContent={{
            right: (
              <Space>
                {divWidth === divMinWidth ? (
                  <Button
                    type="link"
                    icon={<FullscreenOutlined />}
                    onClick={() => setDivWidth(divMaxWidth)}
                  />
                ) : (
                  <Button
                    type="link"
                    icon={<FullscreenExitOutlined />}
                    onClick={() => setDivWidth(divMinWidth)}
                  />
                )}
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => {
                    store.dispatch(
                      show({
                        type: "discussion",
                        resType: "sentence",
                      })
                    );
                    if (typeof onClose !== "undefined") {
                      onClose();
                    }
                  }}
                />
              </Space>
            ),
          }}
          items={[
            {
              label: intl.formatMessage({
                id: "columns.library.dict.title",
              }),
              key: "dict",
              children: <DictComponent />,
            },
            {
              label: intl.formatMessage({
                id: "columns.studio.channel.title",
              }),
              key: "channel",
              children: (
                <ChannelPickerTable
                  type={type}
                  articleId={articleId}
                  selectedKeys={selectedChannelsId}
                  onSelect={(e: IChannel[]) => {
                    console.log(e);
                    if (typeof onChannelSelect !== "undefined") {
                      onChannelSelect(e);
                    }
                  }}
                />
              ),
            },
            {
              label: intl.formatMessage({
                id: "buttons.discussion",
              }),
              key: "discussion",
              children: <DiscussionBox />,
            },
          ]}
        />
      </div>
    </Affix>
  );
};

export default RightPanelWidget;