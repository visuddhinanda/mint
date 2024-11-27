import { useIntl } from "react-intl";
import { message } from "antd";
import {
  ProForm,
  ProFormInstance,
  ProFormText,
} from "@ant-design/pro-components";

import { post } from "../../request";
import { useRef } from "react";
import { ITaskCreateRequest, ITaskResponse } from "../api/task";

interface IFormData {
  title: string;
  lang: string;
  studio: string;
}

interface IWidgetCourseCreate {
  studio?: string;
  onCreate?: Function;
}
const TaskCreate = ({ studio = "", onCreate }: IWidgetCourseCreate) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();

  return (
    <ProForm<IFormData>
      formRef={formRef}
      onFinish={async (values: IFormData) => {
        console.log(values);
        values.studio = studio;
        const url = `/v2/task`;
        console.info("task api request", url, values);
        const res = await post<ITaskCreateRequest, ITaskResponse>(url, values);
        console.debug("CourseCreateWidget api response", res);
        if (res.ok) {
          message.success(intl.formatMessage({ id: "flashes.success" }));
          formRef.current?.resetFields(["title"]);
          if (typeof onCreate !== "undefined") {
            onCreate();
          }
        } else {
          message.error(res.message);
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="title"
          required
          label={intl.formatMessage({ id: "channel.name" })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "channel.create.message.noname",
              }),
            },
          ]}
        />
      </ProForm.Group>
    </ProForm>
  );
};

export default TaskCreate;
