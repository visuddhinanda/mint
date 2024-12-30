import { useState } from "react";
import { Button } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";

import { ITaskData } from "../api/task";
import MdView from "../template/MdView";
import MDEditor from "@uiw/react-md-editor";
import "../article/article.css";

interface IWidget {
  task?: ITaskData;
}
const Description = ({ task }: IWidget) => {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [content, setContent] = useState(task?.description);
  return (
    <div>
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
            <Button
              ghost
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setMode("edit")}
            >
              编辑
            </Button>
          ) : (
            <Button
              ghost
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => setMode("read")}
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
