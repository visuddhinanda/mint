import { ProFormSelect } from "@ant-design/pro-components";
import { Space } from "antd";
import { IApiResponseChannelList } from "../api/Channel";
import { get } from "../../request";
import { useState } from "react";

interface IWidget {
  channelsId?: string[];
  type?: string;
  onChange?: (channel?: string | null) => void;
}
const ChannelSelectWithToken = ({ channelsId, type, onChange }: IWidget) => {
  const [channel, setChannel] = useState<string>("");
  const [power, setPower] = useState<string>();
  return (
    <Space>
      <ProFormSelect
        options={[]}
        initialValue="translation"
        width="md"
        name="channel"
        allowClear={true}
        label={false}
        placeholder={"选择一个channel"}
        onChange={(value: string) => {
          console.debug(value);
          setChannel(value);
          let output = value;
          if (value) {
            if (power) {
              output += "@" + power;
            }
          }
          onChange && onChange(output);
        }}
        request={async ({ keyWords }) => {
          if (!channelsId) {
            return [];
          }

          const url = `/v2/channel?view=id&id=` + channelsId?.join(",");
          console.info("api request", url);
          const json = await get<IApiResponseChannelList>(url);
          console.info("api response", json, type);
          const textbookList = json.data.rows.map((item) => {
            return {
              value: item.uid,
              label: item.name,
            };
          });
          const current = json.data.rows.filter((value) => {
            if (type) {
              return value.type === type;
            } else {
              return true;
            }
          });
          console.log("json", textbookList);
          return textbookList;
        }}
      />
      <ProFormSelect
        options={[
          { value: "readonly", label: "readonly" },
          { value: "edit", label: "edit" },
        ]}
        initialValue="null"
        width="xs"
        name="power"
        allowClear={true}
        label={false}
        placeholder={"选择访问权限"}
        onChange={(value: string) => {
          console.debug(value);
          setPower(value);
          let output = channel;
          if (channel) {
            if (value) {
              output += "@" + value;
            }
          }
          onChange && onChange(output);
        }}
      />
    </Space>
  );
};

export default ChannelSelectWithToken;
