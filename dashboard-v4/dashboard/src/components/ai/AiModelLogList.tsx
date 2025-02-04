import { ProList } from "@ant-design/pro-components";
import { Button, Space, Tabs, Tag, Typography } from "antd";
import type { Key } from "react";
import { useState } from "react";

import { CheckOutlined, WarningOutlined } from "@ant-design/icons";

import { IAiModelLogData, IAiModelLogListResponse } from "../api/ai";
import { get } from "../../request";
import moment from "moment";

const { Text } = Typography;

interface IWidget {
  modelId?: string;
}
const AiModelLogList = ({ modelId }: IWidget) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);

  return (
    <ProList<IAiModelLogData>
      rowKey="title"
      headerTitle="logs"
      toolBarRender={() => {
        return [
          <Button key="3" type="primary">
            新建
          </Button>,
        ];
      }}
      expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
      metas={{
        title: {},
        subTitle: {
          render: (dom, entity, index, action, schema) => {
            return (
              <Space size={0}>
                <Tag color="blue">{entity.status}</Tag>
              </Space>
            );
          },
        },
        description: {
          render: (dom, entity, index, action, schema) => {
            return (
              <>
                <Tabs
                  items={[
                    {
                      label: "request",
                      key: "request",
                      children: <div>{entity.request_data}</div>,
                    },
                    {
                      label: "response",
                      key: "response",
                      children: <div>{entity.response_data}</div>,
                    },
                  ]}
                />
              </>
            );
          },
        },
        avatar: {
          render(dom, entity, index, action, schema) {
            return (
              <>
                {entity.success ? (
                  <CheckOutlined style={{ color: "green" }} />
                ) : (
                  <WarningOutlined color="error" />
                )}
              </>
            );
          },
        },
        actions: {
          render: (dom, entity, index, action, schema) => {
            const date = moment(entity.created_at).toLocaleString();
            return <Text type="secondary">{date}</Text>;
          },
        },
      }}
      bordered
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      search={false}
      options={{
        search: true,
      }}
      request={async (params = {}, sorter, filter) => {
        console.log(params, sorter, filter);
        let url = `/v2/model-log?view=model&id=${modelId}`;
        const offset = ((params.current ?? 1) - 1) * (params.pageSize ?? 20);
        url += `&limit=${params.pageSize}&offset=${offset}`;
        url += params.keyword ? "&search=" + params.keyword : "";

        console.info("ai model log api request", url);
        const res = await get<IAiModelLogListResponse>(url);
        console.info("ai model log api response", res);
        return {
          total: res.data.total,
          succcess: res.ok,
          data: res.data.rows,
        };
      }}
    />
  );
};

export default AiModelLogList;
