import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Avatar, Button, Form, Space, Typography } from "antd";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { EditableProTable, useRefFunction } from "@ant-design/pro-components";

import {
  IProject,
  ITaskData,
  ITaskListResponse,
  ITaskResponse,
  ITaskUpdateRequest,
  TTaskStatus,
} from "../api/task";
import { get, post } from "../../request";
import TaskEditDrawer from "./TaskEditDrawer";
import User, { IUser } from "../auth/User";
import { GroupIcon } from "../../assets/icon";
import Options, { IMenu } from "./Options";
import Filter from "./Filter";
import { Milestone, Status } from "./TaskReader";

const { Text } = Typography;
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const Executors = ({
  data,
  all,
}: {
  data: ITaskData;
  all: readonly ITaskData[];
}) => {
  const children = all.filter((value) => value.parent_id === data.id);
  let executors: IUser[] = data.executor ? [data.executor] : [];
  children.forEach((task) => {
    executors = executors.concat(task.executor ?? []);
  });
  return (
    <Avatar.Group>
      {executors.map((item, id) => {
        return <User {...item} key={id} showName={executors.length === 1} />;
      })}
    </Avatar.Group>
  );
};
export const Assignees = ({ data }: { data: ITaskData }) => {
  return (
    <Avatar.Group>
      {data.assignees?.map((item, id) => {
        return <User {...item} key={id} showName={false} />;
      })}
    </Avatar.Group>
  );
};
export interface IFilter {
  field:
    | "executor_id"
    | "owner_id"
    | "finished_at"
    | "assignees_id"
    | "participants_id"
    | "sign_up";
  operator:
    | "includes"
    | "not-includes"
    | "equals"
    | "not-equals"
    | ">="
    | "<="
    | ">"
    | "<"
    | null;
  value: string | string[] | null;
}

interface IParams {
  status?: string;
  orderby?: string;
  direction?: string;
}
interface IWidget {
  studioName?: string;
  projectId?: string;
  editable?: boolean;
  filters?: IFilter[];
  status?: TTaskStatus[];
  sortBy?: "order" | "created_at" | "updated_at" | "started_at" | "finished_at";
  groupBy?: "executor_id" | "owner_id" | "status" | "project_id";
  onLoad?: (data: ITaskData[]) => void;
  onChange?: (data: ITaskData) => void;
}
const TaskList = ({
  studioName,
  projectId,
  editable = false,
  status,
  sortBy = "order",
  groupBy,
  filters,
  onLoad,
  onChange,
}: IWidget) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<React.ReactNode>();

  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly ITaskData[]>([]);
  const [rawData, setRawData] = useState<readonly ITaskData[]>([]);
  const [form] = Form.useForm();
  const [selectedTask, setSelectedTask] = useState<string>();

  const [currFilter, setCurrFilter] = useState(filters);
  const loopDataSourceFilter = (
    data: readonly ITaskData[],
    id: React.Key | undefined
  ): ITaskData[] => {
    return data
      .map((item) => {
        if (item.id !== id) {
          if (item.children) {
            const newChildren = loopDataSourceFilter(item.children, id);
            return {
              ...item,
              children: newChildren.length > 0 ? newChildren : undefined,
            };
          }
          return item;
        }
        return null;
      })
      .filter(Boolean) as ITaskData[];
  };
  const removeRow = useRefFunction((record: ITaskData) => {
    setDataSource(loopDataSourceFilter(dataSource, record.id));
  });

  const columns: ProColumns<ITaskData>[] = [
    {
      title: intl.formatMessage({
        id: "forms.fields.title.label",
      }),
      dataIndex: "title",
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      width: "30%",
      render(dom, entity, index, action, schema) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                setSelectedTask(entity.id);
                setOpen(true);
              }}
            >
              {entity.title}
            </Button>
            {entity.type === "group" ? (
              <Text type="secondary">{entity.order}</Text>
            ) : (
              <></>
            )}
            <Status task={entity} />
            <Milestone task={entity} />
            {entity.project ? (
              <Text type="secondary">
                {"< "}
                {entity.project?.title}
              </Text>
            ) : (
              <></>
            )}
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "forms.fields.executor.label",
      }),
      key: "executor",
      dataIndex: "executor",
      search: false,
      readonly: true,
      render(dom, entity, index, action, schema) {
        return <Executors data={entity} all={rawData} />;
      },
    },
    {
      title: intl.formatMessage({
        id: "forms.fields.assignees.label",
      }),
      key: "assignees",
      dataIndex: "assignees",
      search: false,
      readonly: true,
      render(dom, entity, index, action, schema) {
        return <Assignees data={entity} />;
      },
    },
    {
      title: intl.formatMessage({
        id: "forms.fields.started-at.label",
      }),
      key: "state",
      dataIndex: "started_at",
      readonly: true,
      valueType: "date",
      sorter: true,
      search: false,
    },
    {
      title: intl.formatMessage({
        id: "forms.fields.finished-at.label",
      }),
      key: "state",
      dataIndex: "finished_at",
      readonly: true,
      valueType: "date",
      search: false,
    },
    {
      title: "状态",
      hideInTable: true,
      dataIndex: "status",
      valueType: "select",
      initialValue: status ? status.join("_") : "all",
      valueEnum: {
        all: { text: "全部任务" },
        done: { text: "已完成" },
        running_restarted: { text: "未完成" },
        running_restarted_published: { text: "待办" },
        published: { text: "未开始" },
        pending: { text: "未发布" },
      },
    },
    {
      title: "排序",
      hideInTable: true,
      dataIndex: "orderby",
      valueType: "select",
      initialValue: sortBy,
      valueEnum: {
        order: { text: "拖拽排序" },
        started_at: { text: "开始时间" },
        created_at: { text: "创建时间" },
        updated_at: { text: "更新时间" },
        finished_at: { text: "完成时间" },
      },
    },
    {
      title: "顺序",
      hideInTable: true,
      dataIndex: "direction",
      valueType: "select",
      initialValue: "asc",
      valueEnum: {
        desc: { text: "降序" },
        asc: { text: "升序" },
      },
    },
    editable
      ? {
          title: "操作",
          valueType: "option",
          width: 250,
          search: false,
          render: (text, record, _, action) => [
            <EditableProTable.RecordCreator
              key="copy"
              parentKey={record.id}
              record={{
                id: generateUUID(),
                parent_id: record.id,
              }}
            >
              <Button size="small" type="link">
                插入子节点
              </Button>
            </EditableProTable.RecordCreator>,
            <Button
              type="link"
              danger
              size="small"
              key="delete"
              onClick={() => {
                removeRow(record);
              }}
            >
              删除
            </Button>,
          ],
        }
      : { search: false },
  ];

  const getChildren = (
    record: ITaskData,
    findIn: ITaskData[]
  ): ITaskData[] | undefined => {
    const children = findIn
      .filter((item) => item.parent_id === record.id)
      .map((item) => {
        return { ...item, children: getChildren(item, findIn) };
      });
    console.debug("children", findIn, record, children);
    if (children.length > 0) {
      return children;
    }
    return undefined;
  };

  useEffect(() => {
    actionRef.current?.reload();
  }, [projectId]);

  const groupItems: IMenu[] = [
    {
      key: "none",
      label: "无分组",
    },
    {
      key: "project",
      label: "任务组",
    },
    {
      key: "title",
      label: "任务名称",
    },
    {
      key: "status",
      label: "状态",
    },
    {
      key: "creator",
      label: "创建人",
    },
    {
      key: "executor",
      label: "执行人",
    },
    {
      key: "started_at",
      label: "开始时间",
    },
  ];

  return (
    <>
      <EditableProTable<ITaskData, IParams>
        rowKey="id"
        scroll={{
          x: 960,
        }}
        search={{
          filterType: "light",
        }}
        options={{
          search: true,
        }}
        actionRef={actionRef}
        headerTitle={title}
        // 关闭默认的新建按钮
        recordCreatorProps={
          editable
            ? {
                record: () => ({
                  id: generateUUID(),
                  title: "新建任务",
                  is_milestone: false,
                }),
              }
            : false
        }
        columns={columns}
        request={async (params = {}, sorter, filter) => {
          let url = `/v2/task?a=a`;
          if (projectId) {
            url += `&view=project&project_id=${projectId}`;
          } else {
            url += `&view=all`;
          }
          if (currFilter) {
            url += `&`;
            url += currFilter
              .map((item) => {
                return item.field + "_" + item.operator + "=" + item.value;
              })
              .join("&");
          }

          url += params.status
            ? `&status=${params.status.replaceAll("_", ",")}`
            : "";
          url += params.orderby ? `&order=${params.orderby}` : "";
          url += params.direction ? `&dir=${params.direction}` : "";

          console.info("api request", url);
          const res = await get<ITaskListResponse>(url);
          console.info("project api response", res);
          setRawData(res.data.rows);
          onLoad && onLoad(res.data.rows);
          const root = res.data.rows
            .filter((item) => item.parent_id === null)
            .map((item) => {
              return { ...item, children: getChildren(item, res.data.rows) };
            });
          return {
            data: root,
            total: res.data.count,
            success: res.ok,
          };
        }}
        value={dataSource}
        onChange={(value: readonly ITaskData[]) => {
          const root = value.find((item) => item.id === projectId);
          setDataSource(value);
        }}
        editable={{
          form,
          editableKeys,
          onSave: async (key, values) => {
            const data: ITaskUpdateRequest = {
              ...values,
              studio_name: studioName ?? "",
              project_id: projectId,
            };
            const url = `/v2/task`;
            console.info("task save api request", url, values);
            const res = await post<ITaskUpdateRequest, ITaskResponse>(
              url,
              data
            );
            onChange && onChange(res.data);
            console.info("task save api response", res);
          },

          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
        toolBarRender={() => [
          <Options
            items={groupItems}
            initKey="none"
            icon={<GroupIcon />}
            onChange={(key: string) => {
              switch (key) {
                case "status":
                  let statuses = new Map<string, number>();
                  rawData.forEach((task) => {
                    if (task.status) {
                      if (statuses.has(task.status)) {
                        statuses.set(
                          task.status,
                          statuses.get(task.status)! + 1
                        );
                      } else {
                        statuses.set(task.status, 1);
                      }
                    }
                  });
                  let group: ITaskData[] = [];
                  statuses.forEach((value, key) => {
                    group.push({
                      id: key,
                      title: intl.formatMessage({
                        id: `labels.task.status.${key}`,
                      }),
                      order: value,
                      type: "group",
                      is_milestone: false,
                    });
                  });
                  const newGroup = group.map((item, id) => {
                    return {
                      ...item,
                      children: rawData.filter(
                        (task) => task.status === item.id
                      ),
                    };
                  });
                  setDataSource(newGroup);
                  break;
                case "project":
                  let projectsId = new Map<string, number>();
                  let projects = new Map<string, IProject>();
                  rawData.forEach((task) => {
                    if (task.project_id && task.project) {
                      if (projectsId.has(task.project_id)) {
                        projectsId.set(
                          task.project_id,
                          projectsId.get(task.project_id)! + 1
                        );
                      } else {
                        projectsId.set(task.project_id, 1);
                        projects.set(task.project_id, task.project);
                      }
                    }
                  });
                  let projectList: ITaskData[] = [];
                  projectsId.forEach((value, key) => {
                    const project = projects.get(key)!;
                    projectList.push({
                      id: project.id,
                      title: `${project.title}`,
                      type: "group",
                      order: value,
                      is_milestone: false,
                    });
                  });
                  const newProject = projectList.map((item, id) => {
                    return {
                      ...item,
                      children: rawData.filter(
                        (task) => task.project_id === item.id
                      ),
                    };
                  });
                  setDataSource(newProject);
                  break;
                case "title":
                  let titles = new Map<string, number>();
                  rawData.forEach((task) => {
                    if (task.title) {
                      if (titles.has(task.title)) {
                        titles.set(task.title, titles.get(task.title)! + 1);
                      } else {
                        titles.set(task.title, 1);
                      }
                    }
                  });
                  let titleGroups: ITaskData[] = [];
                  titles.forEach((value, key) => {
                    titleGroups.push({
                      id: key,
                      title: key,
                      order: value,
                      type: "group",
                      is_milestone: false,
                    });
                  });
                  const newTitleGroup = titleGroups.map((item, id) => {
                    return {
                      ...item,
                      children: rawData.filter(
                        (task) => task.title === item.title
                      ),
                    };
                  });
                  setDataSource(newTitleGroup);
                  break;
                default:
                  break;
              }
            }}
          />,
          <Filter
            initValue={filters}
            onChange={(data) => {
              setCurrFilter(data);
              actionRef.current?.reload();
            }}
          />,
        ]}
      />
      <TaskEditDrawer
        taskId={selectedTask}
        openDrawer={open}
        onClose={() => setOpen(false)}
        onChange={(data: ITaskData) => {
          console.debug("task change", data);
          setDataSource((origin) => {
            const update = (item: ITaskData): ITaskData => {
              item.children = item.children?.map(update);
              if (item.id === data.id) {
                return { ...data, children: item.children };
              }
              return item;
            };
            return origin.map(update);
          });
          onChange && onChange(data);
        }}
      />
    </>
  );
};

export default TaskList;