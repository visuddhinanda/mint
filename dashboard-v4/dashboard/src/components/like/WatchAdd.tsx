import { useRef } from "react";
import { ProForm, ProFormInstance } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";

import UserSelect from "../template/UserSelect";
import { Button, Divider, Popover } from "antd";
import WatchList from "./WatchList";
import { IUser } from "../auth/User";

export interface IDataType {
  user_id?: string;
}

interface IWidget {
  data?: IUser[];
  onFinish?: ((formData: IDataType) => Promise<boolean | void>) | undefined;
}

export const WatchAddButton = ({ data, onFinish }: IWidget) => {
  return (
    <Popover
      trigger={"click"}
      content={<WatchAdd data={data} onFinish={onFinish} />}
    >
      <Button type="text" icon={<PlusOutlined />} />
    </Popover>
  );
};
const WatchAdd = ({ data, onFinish }: IWidget) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <div>
      <ProForm<IDataType> formRef={formRef} onFinish={onFinish}>
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
