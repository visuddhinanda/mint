import {
  Button,
  Divider,
  Input,
  message,
  Modal,
  Space,
  Steps,
  Typography,
} from "antd";

import { useState } from "react";
import Workflow from "./Workflow";
import {
  IProjectTreeInsertRequest,
  IProjectTreeResponse,
  ITaskData,
  ITaskGroupInsertData,
  ITaskGroupInsertRequest,
  ITaskGroupResponse,
} from "../api/task";
import ChapterToc from "../article/ChapterToc";
import { IChapterToc } from "../api/Corpus";
import { post } from "../../request";
import TaskBuilderProp, { IParam, IProp } from "./TaskBuilderProp";
import {
  IPayload,
  ITokenCreate,
  ITokenCreateResponse,
  ITokenData,
  TPower,
} from "../api/token";
const { Text, Paragraph } = Typography;

interface IModal {
  studioName?: string;
  channels?: string[];
  book?: number;
  para?: number;
  open?: boolean;
  onClose?: () => void;
}
export const TaskBuilderChapterModal = ({
  studioName,
  channels,
  book,
  para,
  open = false,
  onClose,
}: IModal) => {
  return (
    <>
      <Modal
        destroyOnClose={true}
        width={1400}
        style={{ top: 10 }}
        title={""}
        footer={false}
        open={open}
        onOk={onClose}
        onCancel={onClose}
      >
        <TaskBuilderChapter
          style={{ marginTop: 20 }}
          studioName={studioName}
          channels={channels}
          book={book}
          para={para}
        />
      </Modal>
    </>
  );
};

interface IWidget {
  studioName?: string;
  channels?: string[];
  book?: number;
  para?: number;
  style?: React.CSSProperties;
}
const TaskBuilderChapter = ({
  studioName,
  book,
  para,
  style,
  channels,
}: IWidget) => {
  const [current, setCurrent] = useState(0);
  const [workflow, setWorkflow] = useState<ITaskData[]>();
  const [chapter, setChapter] = useState<IChapterToc[]>();
  const [tokens, setTokens] = useState<ITokenData[]>();
  const [messages, setMessages] = useState<string[]>([]);
  const [prop, setProp] = useState<IProp[]>();
  const [title, setTitle] = useState<string>();
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "章节选择",
      content: (
        <div style={{ padding: 8 }}>
          <Space key={1}>
            <Text type="secondary">{"任务组标题"}</Text>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Space>
          <ChapterToc
            key={2}
            book={book}
            para={para}
            maxLevel={7}
            onData={(data: IChapterToc[]) => {
              setChapter(data);
              if (data.length > 0) {
                if (!title && data[0].text) {
                  setTitle(data[0].text);
                }
              }
              //获取channel token
              let payload: IPayload[] = [];
              channels?.forEach((channel) => {
                data.forEach((chapter) => {
                  const power: TPower[] = ["readonly", "edit"];
                  payload = payload.concat(
                    power.map((item) => {
                      return {
                        res_id: channel,
                        res_type: "channel",
                        book: chapter.book,
                        para_start: chapter.paragraph,
                        para_end: chapter.paragraph + chapter.chapter_len,
                        power: item,
                      };
                    })
                  );
                });
              });
              const url = "/v2/access-token";
              const values = { payload: payload };
              console.info("api request", url, values);
              post<ITokenCreate, ITokenCreateResponse>(url, values).then(
                (json) => {
                  console.info("api response", json);
                  setTokens(json.data.rows);
                }
              );
            }}
          />
        </div>
      ),
    },
    {
      title: "工作流",
      content: (
        <Workflow
          studioName={studioName}
          onData={(data) => setWorkflow(data)}
        />
      ),
    },
    {
      title: "参数设置",
      content: (
        <div>
          <TaskBuilderProp
            workflow={workflow}
            channelsId={channels}
            onChange={(data: IProp[] | undefined) => {
              console.info("prop value", data);
              setProp(data);
            }}
          />
        </div>
      ),
    },
    {
      title: "生成",
      content: (
        <div style={{ padding: 8 }}>
          <div>
            <Space>
              <Text type="secondary">title</Text>
              <Text>{title}</Text>
            </Space>
          </div>
          <div>
            <Space>
              <Text type="secondary">新增任务组</Text>
              <Text>{chapter?.length}</Text>
            </Space>
          </div>
          <div>
            <Space>
              <Text type="secondary">每个任务组任务数量</Text>
              <Text>{workflow?.length}</Text>
            </Space>
          </div>
          <div>
            <Paragraph>点击生成按钮生成</Paragraph>
          </div>
          <div>
            {messages?.map((item, id) => {
              return <div key={id}>{item}</div>;
            })}
          </div>
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div style={style}>
      <Steps current={current} items={items} />
      <div className="steps-content" style={{ minHeight: 400 }}>
        {steps[current].content}
      </div>
      <Divider></Divider>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          style={{ margin: "0 8px" }}
          disabled={current === 0}
          onClick={() => prev()}
        >
          Previous
        </Button>

        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            loading={loading}
            disabled={loading}
            type="primary"
            onClick={async () => {
              if (!studioName || !chapter) {
                console.error("缺少参数", studioName, chapter);
                return;
              }
              setLoading(true);
              //生成projects
              setMessages((origin) => [...origin, "正在生成任务组……"]);
              const url = "/v2/project-tree";
              const values: IProjectTreeInsertRequest = {
                studio_name: studioName,
                data: chapter.map((item, id) => {
                  return {
                    id: item.paragraph.toString(),
                    title: id === 0 && title ? title : item.text ?? "",
                    type: "instance",
                    weight: item.chapter_strlen,
                    parent_id: item.parent.toString(),
                    res_id: `${item.book}-${item.paragraph}`,
                  };
                }),
              };
              console.info("api request", url, values);
              const res = await post<
                IProjectTreeInsertRequest,
                IProjectTreeResponse
              >(url, values);
              console.info("api response", res);
              if (!res.ok) {
                setMessages((origin) => [...origin, "正在生成任务组失败"]);
                return;
              } else {
                setMessages((origin) => [...origin, "生成任务组成功"]);
              }
              //生成tasks
              setMessages((origin) => [...origin, "正在生成任务……"]);
              const taskUrl = "/v2/task-group";
              if (!workflow) {
                return;
              }

              let taskData: ITaskGroupInsertData[] = res.data.rows
                .filter((value) => value.isLeaf)
                .map((project, pId) => {
                  return {
                    project_id: project.id,
                    tasks: workflow.map((task, tId) => {
                      let newContent = task.description;
                      prop
                        ?.find((pValue) => pValue.taskId === task.id)
                        ?.param?.forEach((value: IParam) => {
                          //替换数字参数
                          if (value.type === "number") {
                            const searchValue = `${value.key}=${value.value}`;
                            const replaceValue =
                              `${value.key}=` +
                              (value.initValue + value.step * pId).toString();
                            newContent = newContent?.replace(
                              searchValue,
                              replaceValue
                            );
                          } else {
                            //替换book
                            if (project.resId) {
                              const [book, paragraph] =
                                project.resId.split("-");
                              newContent = newContent?.replace(
                                "book=#",
                                `book=${book}`
                              );
                              newContent = newContent?.replace(
                                "paragraphs=#",
                                `paragraphs=${paragraph}`
                              );
                              //替换channel
                              //查找toke

                              const [channel, power] = value.value.split("@");
                              const mToken = tokens?.find(
                                (token) =>
                                  token.payload.book?.toString() === book &&
                                  token.payload.para_start?.toString() ===
                                    paragraph &&
                                  token.payload.res_id === channel &&
                                  (power && power.length > 0
                                    ? token.payload.power === power
                                    : true)
                              );
                              newContent = newContent?.replace(
                                value.key,
                                channel + (mToken ? "@" + mToken?.token : "")
                              );
                            }
                          }
                        });

                      console.debug("description", newContent);
                      return {
                        ...task,
                        type: "instance",
                        description: newContent,
                      };
                    }),
                  };
                });

              console.info("api request", taskUrl, taskData);
              const taskRes = await post<
                ITaskGroupInsertRequest,
                ITaskGroupResponse
              >(taskUrl, { data: taskData });
              if (taskRes.ok) {
                message.success("ok");
                setMessages((origin) => [...origin, "生成任务成功"]);
                setMessages((origin) => [
                  ...origin,
                  "生成任务" + taskRes.data.taskCount,
                ]);
                setMessages((origin) => [
                  ...origin,
                  "生成任务关联" + taskRes.data.taskRelationCount,
                ]);
                setMessages((origin) => [
                  ...origin,
                  "打开译经楼-我的任务查看已经生成的任务",
                ]);
              }
              setLoading(false);
            }}
          >
            Done
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskBuilderChapter;
