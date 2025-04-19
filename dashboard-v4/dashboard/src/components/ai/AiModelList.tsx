import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { Button, Popover, Modal, message, Tag, Space } from "antd";
import { ActionType, ProList } from "@ant-design/pro-components";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

import { delete_, get } from "../../request";

import { IDeleteResponse } from "../../components/api/Article";
import { useRef, useState } from "react";

import { getSorterUrl } from "../../utils";
import { IAiModel, IAiModelListResponse } from "../api/ai";
import AiModelCreate from "./AiModelCreate";
import PublicityIcon from "../studio/PublicityIcon";
import ShareModal from "../share/ShareModal";
import { EResType } from "../share/Share";

interface IWidget {
  studioName?: string;
}
const AiModelList = ({ studioName }: IWidget) => {
  const intl = useIntl(); //i18n

  const [openCreate, setOpenCreate] = useState(false);

  const showDeleteConfirm = (id: string, title: string) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title:
        intl.formatMessage({
          id: "message.delete.confirm",
        }) +
        intl.formatMessage({
          id: "message.irrevocable",
        }),

      content: title,
      okText: intl.formatMessage({
        id: "buttons.delete",
      }),
      okType: "danger",
      cancelText: intl.formatMessage({
        id: "buttons.no",
      }),
      onOk() {
        console.log("delete", id);
        return delete_<IDeleteResponse>(`/v2/group/${id}`)
          .then((json) => {
            if (json.ok) {
              message.success("删除成功");
              ref.current?.reload();
            } else {
              message.error(json.message);
            }
          })
          .catch((e) => console.log("Oops errors!", e));
      },
    });
  };

  const ref = useRef<ActionType>();

  return (
    <>
      <ProList<IAiModel>
        actionRef={ref}
        onRow={(record) => ({
          onClick: () => {},
        })}
        metas={{
          title: {
            dataIndex: "name",
            render(dom, entity, index, action, schema) {
              return (
                <Link to={`/studio/${studioName}/ai/models/${entity.uid}/edit`}>
                  {entity.name}
                </Link>
              );
            },
          },
          description: {
            dataIndex: "url",
          },
          subTitle: {
            render(dom, entity, index, action, schema) {
              return <Tag>{entity.model}</Tag>;
            },
          },
          content: {
            render(dom, entity, index, action, schema) {
              return entity.description;
            },
          },
          avatar: {
            render(dom, entity, index, action, schema) {
              return <PublicityIcon value={entity.privacy} />;
            },
          },
          actions: {
            render(dom, entity, index, action, schema) {
              return (
                <Space>
                  <Link
                    to={`/studio/${studioName}/ai/models/${entity.uid}/logs`}
                  >
                    logs
                  </Link>
                  <ShareModal
                    trigger={
                      <Button type="link" size="small">
                        {intl.formatMessage({
                          id: "buttons.share",
                        })}
                      </Button>
                    }
                    resId={entity.uid}
                    resType={EResType.modal}
                  />
                </Space>
              );
            },
          },
        }}
        request={async (params = {}, sorter, filter) => {
          console.log(params, sorter, filter);
          let url = `/v2/ai-model?view=studio&name=${studioName}`;
          const offset = ((params.current ?? 1) - 1) * (params.pageSize ?? 20);
          url += `&limit=${params.pageSize}&offset=${offset}`;
          url += params.keyword ? "&search=" + params.keyword : "";
          url += getSorterUrl(sorter);

          console.info("api request", url);
          const res = await get<IAiModelListResponse>(url);
          console.info("api response", res);
          return {
            total: res.data.total,
            succcess: res.ok,
            data: res.data.rows,
          };
        }}
        rowKey="id"
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        search={false}
        options={{
          search: true,
        }}
        toolBarRender={() => [
          <Popover
            content={
              <AiModelCreate
                studioName={studioName}
                onCreate={() => {
                  setOpenCreate(false);
                  ref.current?.reload();
                }}
              />
            }
            placement="bottomRight"
            trigger="click"
            open={openCreate}
            onOpenChange={(open: boolean) => {
              setOpenCreate(open);
            }}
          >
            <Button key="button" icon={<PlusOutlined />} type="primary">
              {intl.formatMessage({ id: "buttons.create" })}
            </Button>
          </Popover>,
        ]}
      />
    </>
  );
};

export default AiModelList;
