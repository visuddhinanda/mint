import { useRef, useState } from "react";
import { ActionType, ProList } from "@ant-design/pro-components";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { Button, message, Modal, Popover } from "antd";
import { Dropdown } from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { delete_, get } from "../../request";
import { PublicityValueEnum } from "../studio/table";
import { IDeleteResponse } from "../api/Article";
import { getSorterUrl } from "../../utils";
import { TransferOutLinedIcon } from "../../assets/icon";
import { IProjectData, IProjectListResponse, TProjectType } from "../api/task";
import ProjectCreate from "./ProjectCreate";

export const channelTypeFilter = {
  all: {
    text: <FormattedMessage id="channel.type.all.title" />,
    status: "Default",
  },
  translation: {
    text: <FormattedMessage id="channel.type.translation.label" />,
    status: "Success",
  },
  nissaya: {
    text: <FormattedMessage id="channel.type.nissaya.label" />,
    status: "Processing",
  },
  commentary: {
    text: <FormattedMessage id="channel.type.commentary.label" />,
    status: "Default",
  },
  original: {
    text: <FormattedMessage id="channel.type.original.label" />,
    status: "Default",
  },
};

export interface IResNumberResponse {
  ok: boolean;
  message: string;
  data: {
    my: number;
    collaboration: number;
  };
}

interface IWidget {
  studioName?: string;
  type?: TProjectType;
  readonly?: boolean;
  onSelect?: (data: IProjectData) => void;
}

const ProjectListWidget = ({
  studioName,
  type = "normal",
  readonly = false,
  onSelect,
}: IWidget) => {
  const intl = useIntl();
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
        const url = `/v2/channel/${id}`;
        console.log("delete api request", url);
        return delete_<IDeleteResponse>(url)
          .then((json) => {
            console.info("api response", json);
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
      <ProList<IProjectData>
        actionRef={ref}
        metas={{
          title: {
            render: (text, row, index, action) => {
              return readonly ? (
                <>{row.title}</>
              ) : (
                <Link to={`/studio/${studioName}/task/project/${row.id}`}>
                  {row.title}
                </Link>
              );
            },
          },
          description: {
            dataIndex: "summary",
          },
          subTitle: {
            render: (text, row, index, action) => {
              return <></>;
            },
          },
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              console.info(`点击了行：${record.title}`);
              onSelect?.(record);
            },
          };
        }}
        columns={[
          {
            title: intl.formatMessage({
              id: "forms.fields.title.label",
            }),
            dataIndex: "title",
            width: 250,
            key: "title",
            tooltip: "过长会自动收缩",
            ellipsis: true,
            render(dom, entity, index, action, schema) {
              return (
                <Link to={`/studio/${studioName}/task/project/${entity.id}`}>
                  {entity.title}
                </Link>
              );
            },
          },
          {
            title: intl.formatMessage({
              id: "forms.fields.executors.label",
            }),
            dataIndex: "executors",
            key: "executors",
          },
          {
            title: intl.formatMessage({
              id: "forms.fields.milestone.label",
            }),
            dataIndex: "milestone",
            key: "milestone",
            width: 80,
            search: false,
          },
          {
            title: intl.formatMessage({
              id: "forms.fields.status.label",
            }),
            dataIndex: "status",
            key: "status",
            width: 80,
            search: false,
            filters: true,
            onFilter: true,
            valueEnum: PublicityValueEnum(),
          },
          {
            title: intl.formatMessage({
              id: "forms.fields.updated-at.label",
            }),
            key: "updated_at",
            width: 100,
            search: false,
            dataIndex: "updated_at",
            valueType: "date",
            sorter: true,
          },
          {
            title: intl.formatMessage({ id: "buttons.option" }),
            key: "option",
            width: 100,
            valueType: "option",
            render: (text, row, index, action) => {
              return [
                <Dropdown.Button
                  key={index}
                  type="link"
                  trigger={["click", "contextMenu"]}
                  menu={{
                    items: [
                      {
                        key: "transfer",
                        label: intl.formatMessage({
                          id: "columns.studio.transfer.title",
                        }),
                        icon: <TransferOutLinedIcon />,
                      },
                      {
                        key: "remove",
                        label: intl.formatMessage({
                          id: "buttons.delete",
                        }),
                        icon: <DeleteOutlined />,
                        danger: true,
                      },
                    ],
                    onClick: (e) => {
                      switch (e.key) {
                        case "remove":
                          showDeleteConfirm(row.id, row.title);
                          break;
                        default:
                          break;
                      }
                    },
                  }}
                >
                  <Link to={`/studio/${studioName}/channel/${row.id}/setting`}>
                    {intl.formatMessage({
                      id: "buttons.setting",
                    })}
                  </Link>
                </Dropdown.Button>,
              ];
            },
          },
        ]}
        request={async (params = {}, sorter, filter) => {
          console.log(params, sorter, filter);
          let url = `/v2/project?view=studio&type=${type}`;
          const offset =
            ((params.current ? params.current : 1) - 1) *
            (params.pageSize ? params.pageSize : 20);
          url += `&limit=${params.pageSize}&offset=${offset}`;

          url += params.keyword ? "&keyword=" + params.keyword : "";
          url += getSorterUrl(sorter);
          console.log("project list api request", url);
          const res = await get<IProjectListResponse>(url);
          console.info("project list api response", res);
          return {
            total: res.data.count,
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
          readonly ? (
            <></>
          ) : (
            <Popover
              content={
                <ProjectCreate
                  studio={studioName}
                  type={type}
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
            </Popover>
          ),
        ]}
      />
    </>
  );
};

export default ProjectListWidget;
