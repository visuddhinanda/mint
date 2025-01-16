import { useState } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IArticleDataResponse } from "../api/Article";
import { ArticleMode, ArticleType } from "./Article";
import TypeArticleReader from "./TypeArticleReader";
import ArticleEdit from "./ArticleEdit";
import TaskEdit from "../task/TaskEdit";
import { ITaskData } from "../api/task";
import TaskReader from "../task/TaskReader";
import Task from "../task/Task";

interface IWidget {
  type?: ArticleType;
  articleId?: string;
  mode?: ArticleMode | null;
  channelId?: string | null;
  onArticleChange?: (data: ITaskData) => void;
  onArticleEdit?: Function;
  onLoad?: (data: ITaskData) => void;
}
const TypeTask = ({
  type,
  channelId,
  articleId,
  mode = "read",
  onArticleChange,
  onLoad,
  onArticleEdit,
}: IWidget) => {
  return (
    <div>
      <Task taskId={articleId} />
    </div>
  );
};

export default TypeTask;
