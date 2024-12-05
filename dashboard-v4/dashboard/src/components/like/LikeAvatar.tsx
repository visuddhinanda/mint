import { useEffect, useState } from "react";

import { ILikeData, ILikeListResponse, TLikeType } from "../api/like";
import { get } from "../../request";
import User from "../auth/User";
import { Popover, Space } from "antd";
import WatchList from "./WatchList";
import { WatchAddButton } from "./WatchAdd";

interface IWidget {
  resId?: string;
  resType?: string;
  type?: TLikeType;
}
const LikeAvatar = ({ resId, resType, type }: IWidget) => {
  const [data, setData] = useState<ILikeData[]>();
  useEffect(() => {
    if (!resId) {
      return;
    }
    const url = `/v2/like?view=target&target_id=${resId}&type=${type}`;
    console.info("api request", url);
    get<ILikeListResponse>(url).then((json) => {
      console.info("api response", json);
      if (json.ok) {
        setData(json.data.rows);
      }
    });
  }, [resId, type]);
  return (
    <Space>
      <Popover trigger={"click"} content={<WatchList data={data} />}>
        <div>
          {data?.map((item, id) => {
            return (
              <span
                key={id}
                style={{ display: "inline-block", marginRight: -8 }}
              >
                <User {...item.user} showName={false} hidePopover />
              </span>
            );
          })}
        </div>
      </Popover>
      <WatchAddButton
        resId={resId}
        resType={resType}
        data={data}
        onAdd={(user: ILikeData) => {
          setData((origin) => {
            if (origin) {
              return [...origin, user];
            } else {
              return [user];
            }
          });
        }}
      />
    </Space>
  );
};

export default LikeAvatar;
