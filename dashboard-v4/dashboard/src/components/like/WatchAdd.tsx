import { useRef } from "react";
import { ProForm, ProFormInstance } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";

import { ILikeData, ILikeRequest, ILikeResponse } from "../api/like";
import UserSelect from "../template/UserSelect";
import { post } from "../../request";
import { Button, Divider, Popover } from "antd";
import WatchList from "./WatchList";

interface IWidget {
  resId?: string;
  resType?: string;
  data?: ILikeData[];
  onAdd?: (user: ILikeData) => void;
}

export const WatchAddButton = ({ resId, resType, data, onAdd }: IWidget) => {
  return (
    <Popover
      trigger={"click"}
      content={
        <WatchAdd resId={resId} resType={resType} data={data} onAdd={onAdd} />
      }
    >
      <Button type="text" icon={<PlusOutlined />} />
    </Popover>
  );
};
const WatchAdd = ({ resId, resType, data, onAdd }: IWidget) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <div>
      <ProForm<ILikeRequest>
        formRef={formRef}
        onFinish={async (values: ILikeRequest) => {
          if (!resId || !resType) {
            console.error("no resId or resType", resId, resType);
            return;
          }
          values.type = "watch";
          values.target_id = resId;
          values.target_type = resType;
          const url = `/v2/like`;
          console.info("watch add api request", url, values);
          const add = await post<ILikeRequest, ILikeResponse>(url, values);
          console.debug("watch add api response", add);
          if (add.ok) {
            onAdd && onAdd(add.data);
          }
        }}
      >
        <ProForm.Group>
          <UserSelect name="user_id" multiple={false} />
        </ProForm.Group>
      </ProForm>
      <Divider />
      <WatchList data={data} />
    </div>
  );
};

export default WatchAdd;
