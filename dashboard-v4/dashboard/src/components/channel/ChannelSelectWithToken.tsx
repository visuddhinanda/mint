import { useState } from "react";
import { Button, Input, Space, Typography } from "antd";
import {
  FolderOpenOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import { TChannelType } from "../api/Channel";
import { post } from "../../request";
import ChannelTableModal from "./ChannelTableModal";
import { IChannel } from "./Channel";
import {
  IPayload,
  ITokenCreate,
  ITokenCreateResponse,
  TPower,
} from "../api/token";

const { Text } = Typography;

interface IData {
  value: string;
  label: string;
}

interface IWidget {
  channelsId?: string[];
  type?: TChannelType;
  power?: TPower;
  onChange?: (channel?: string | null) => void;
}
const ChannelSelectWithToken = ({
  channelsId,
  type,
  power,
  onChange,
}: IWidget) => {
  const [curr, setCurr] = useState<IData>();
  const [access, setAccess] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  return (
    <Space>
      <Input
        allowClear
        value={curr?.label}
        placeholder="选择一个版本"
        onChange={(event) => {
          if (event.target.value.trim().length === 0) {
            setCurr(undefined);
            setAccess(undefined);
            onChange && onChange(undefined);
          }
        }}
      />
      <ChannelTableModal
        channelType={type}
        trigger={<Button icon={<FolderOpenOutlined />} type="text" />}
        onSelect={(channel: IChannel) => {
          setCurr({ value: channel.id, label: channel.name });
          //验证权限
          if (power) {
            setLoading(true);
            let payload: IPayload[] = [];
            payload.push({
              res_id: channel.id,
              res_type: "channel",
              power: power,
            });
            const url = "/v2/access-token";
            const values = { payload: payload };
            console.info("token api request", url, values);
            post<ITokenCreate, ITokenCreateResponse>(url, values)
              .then((json) => {
                console.info("token api response", json);
                if (json.ok) {
                  if (json.data.count > 0) {
                    setAccess(true);
                  }
                }
              })
              .finally(() => setLoading(false));
          }

          onChange && onChange(channel.id + (power ? "@" + power : ""));
        }}
      />
      <Text type="secondary">{power}</Text>
      {loading ? (
        <LoadingOutlined />
      ) : access ? (
        <CheckOutlined style={{ color: "green" }} />
      ) : (
        <></>
      )}
    </Space>
  );
};

export default ChannelSelectWithToken;
