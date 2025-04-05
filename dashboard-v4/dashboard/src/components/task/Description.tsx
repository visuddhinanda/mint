import { useEffect, useState } from "react";
import { Button, message, Space } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";

import { ITaskData, ITaskResponse, ITaskUpdateRequest } from "../api/task";
import MdView from "../template/MdView";
import MDEditor from "@uiw/react-md-editor";
import "../article/article.css";
import { patch } from "../../request";
import DiscussionDrawer from "../discussion/DiscussionDrawer";

interface IWidget {
  task?: ITaskData;
  onChange?: (data: ITaskData[]) => void;
  onDiscussion?: () => void;
}
const Description = ({ task, onChange, onDiscussion }: IWidget) => {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [content, setContent] = useState(task?.description);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setContent(task?.description), [task]);
  return (
    <div>
      <DiscussionDrawer
        open={open}
        onClose={() => setOpen(false)}
        resId={task?.id}
        resType="task"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 8,
        }}
      >
        <span></span>
        <span>
          {mode === "read" ? (
            <Space>
              <Button
                key={1}
                onClick={() => {
                  if (typeof onDiscussion === "undefined") {
                    setOpen(true);
                  } else {
                    onDiscussion();
                  }
                }}
              >
                讨论
              </Button>
              <Button
                key={2}
                ghost
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setMode("edit")}
              >
                编辑
              </Button>
            </Space>
          ) : (
            <Button
              ghost
              type="primary"
              icon={<CheckOutlined />}
              loading={loading}
              onClick={() => {
                if (!task) {
                  return;
                }
                let setting: ITaskUpdateRequest = {
                  id: task.id,
                  studio_name: "",
                  description: content,
                };
                const url = `/v2/task/${setting.id}`;
                console.info("api request", url, setting);
                setLoading(true);
                patch<ITaskUpdateRequest, ITaskResponse>(url, setting)
                  .then((json) => {
                    console.info("api response", json);
                    if (json.ok) {
                      message.success("Success");
                      setMode("read");
                      onChange && onChange([json.data]);
                    } else {
                      message.error(json.message);
                    }
                  })
                  .finally(() => setLoading(false));
              }}
            >
              完成
            </Button>
          )}
        </span>
      </div>
      {mode === "read" ? (
        <MdView html={task?.html} />
      ) : (
        <MDEditor
          className="pcd_md_editor"
          value={content ?? undefined}
          onChange={(value) => setContent(value)}
          height={450}
          minHeight={200}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
};

export default Description;
