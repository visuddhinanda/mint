import {
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Col, Row, Space, message } from "antd";
import { useState } from "react";
import { IProjectData, IProjectResponse } from "../api/task";
import { get } from "../../request";
import { useIntl } from "react-intl";

type LayoutType = Parameters<typeof ProForm>[0]["layout"];
const LAYOUT_TYPE_HORIZONTAL = "horizontal";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

interface IWidget {
  projectId?: string;
  studioName?: string;
}
const ProjectEdit = ({ projectId }: IWidget) => {
  const intl = useIntl();

  return (
    <ProForm<IProjectData>
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success("提交成功");
      }}
      params={{}}
      request={async () => {
        const url = `/v2/project/${projectId}`;
        console.info("api request", url);
        const res = await get<IProjectResponse>(url);
        console.log("api response", res);
        return res.data;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="title"
          label={intl.formatMessage({
            id: "forms.fields.title.label",
          })}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="type"
          label={intl.formatMessage({
            id: "forms.fields.type.label",
          })}
          readonly
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="md"
          name="description"
          label={intl.formatMessage({
            id: "forms.fields.description.label",
          })}
        />
      </ProForm.Group>
    </ProForm>
  );
};

export default ProjectEdit;
