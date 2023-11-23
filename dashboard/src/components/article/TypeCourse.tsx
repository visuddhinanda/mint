import { useEffect, useState } from "react";
import { Divider, message, Result, Space, Tag } from "antd";

import { get } from "../../request";
import store from "../../store";
import { IArticleDataResponse, IArticleResponse } from "../api/Article";
import ArticleView from "./ArticleView";
import { ICourseCurrUserResponse } from "../api/Course";
import { ICourseUser, signIn } from "../../reducers/course-user";
import { ITextbook, refresh } from "../../reducers/current-course";
import ExerciseList from "./ExerciseList";
import ExerciseAnswer from "../course/ExerciseAnswer";
import "./article.css";
import TocTree from "./TocTree";
import PaliText from "../template/Wbw/PaliText";
import { ITocPathNode } from "../corpus/TocPath";
import { ArticleMode, ArticleType } from "./Article";

/**
 * 每种article type 对应的路由参数
 * article/id?anthology=id&channel=id1,id2&mode=ArticleMode
 * chapter/book-para?channel=id1,id2&mode=ArticleMode
 * para/book?par=para1,para2&channel=id1,id2&mode=ArticleMode
 * cs-para/book-para?channel=id1,id2&mode=ArticleMode
 * sent/id?channel=id1,id2&mode=ArticleMode
 * sim/id?channel=id1,id2&mode=ArticleMode
 * textbook/articleId?course=id&mode=ArticleMode
 * exercise/articleId?course=id&exercise=id&username=name&mode=ArticleMode
 * exercise-list/articleId?course=id&exercise=id&mode=ArticleMode
 * sent-original/id
 */
interface IWidget {
  type?: ArticleType;
  articleId?: string;
  mode?: ArticleMode | null;
  channelId?: string | null;
  book?: string | null;
  para?: string | null;
  courseId?: string;
  exerciseId?: string;
  userName?: string;
  active?: boolean;
  onArticleChange?: Function;
  onFinal?: Function;
  onLoad?: Function;
  onLoading?: Function;
  onError?: Function;
}
const TypeCourseWidget = ({
  type,
  book,
  para,
  channelId,
  articleId,
  courseId,
  exerciseId,
  userName,
  mode = "read",
  active = false,
  onArticleChange,
  onFinal,
  onLoad,
  onLoading,
  onError,
}: IWidget) => {
  const [articleData, setArticleData] = useState<IArticleDataResponse>();
  const [articleHtml, setArticleHtml] = useState<string[]>(["<span />"]);
  const [extra, setExtra] = useState(<></>);

  const channels = channelId?.split("_");

  useEffect(() => {
    /**
     * 由课本进入查询当前用户的权限和channel
     */
    if (
      type === "textbook" ||
      type === "exercise" ||
      type === "exercise-list"
    ) {
      if (typeof articleId !== "undefined") {
        const id = articleId.split("_");
        get<ICourseCurrUserResponse>(`/v2/course-curr?course_id=${id[0]}`).then(
          (response) => {
            console.log("course user", response);
            if (response.ok) {
              const it: ICourseUser = {
                channelId: response.data.channel_id,
                role: response.data.role,
              };
              store.dispatch(signIn(it));
              /**
               * redux发布课程信息
               */
              const ic: ITextbook = {
                courseId: id[0],
                articleId: id[1],
              };
              store.dispatch(refresh(ic));
            }
          }
        );
      }
    }
  }, [articleId, type]);

  const srcDataMode = mode === "edit" || mode === "wbw" ? "edit" : "read";
  useEffect(() => {
    console.log("srcDataMode", srcDataMode);
    if (!active) {
      return;
    }

    if (typeof type !== "undefined") {
      let url = "";
      switch (type) {
        case "textbook":
          if (typeof articleId !== "undefined") {
            url = `/v2/article/${articleId}?view=textbook&course=${courseId}&mode=${srcDataMode}`;
          }
          break;
        case "exercise":
          if (typeof articleId !== "undefined") {
            url = `/v2/article/${articleId}?mode=${srcDataMode}&course=${courseId}&exercise=${exerciseId}&user=${userName}`;
            setExtra(
              <ExerciseAnswer
                courseId={courseId}
                articleId={articleId}
                exerciseId={exerciseId}
              />
            );
          }
          break;
        case "exercise-list":
          if (typeof articleId !== "undefined") {
            url = `/v2/article/${articleId}?mode=${srcDataMode}&course=${courseId}&exercise=${exerciseId}`;

            setExtra(
              <ExerciseList
                courseId={courseId}
                articleId={articleId}
                exerciseId={exerciseId}
              />
            );
          }
          break;
      }

      console.log("url", url);
      if (typeof onLoading !== "undefined") {
        onLoading(true);
      }

      console.log("url", url);

      get<IArticleResponse>(url)
        .then((json) => {
          console.log("article", json);
          if (json.ok) {
            setArticleData(json.data);
            if (json.data.html) {
              setArticleHtml([json.data.html]);
            } else if (json.data.content) {
              setArticleHtml([json.data.content]);
            }
            setExtra(
              <TocTree
                treeData={json.data.toc?.map((item) => {
                  const strTitle = item.title ? item.title : item.pali_title;
                  const key = item.key
                    ? item.key
                    : `${item.book}-${item.paragraph}`;
                  const progress = item.progress?.map((item, id) => (
                    <Tag key={id}>{Math.round(item * 100) + "%"}</Tag>
                  ));
                  return {
                    key: key,
                    title: (
                      <Space>
                        <PaliText
                          text={strTitle === "" ? "[unnamed]" : strTitle}
                        />
                        {progress}
                      </Space>
                    ),
                    level: item.level,
                  };
                })}
                onSelect={(keys: string[]) => {
                  console.log(keys);
                  if (
                    typeof onArticleChange !== "undefined" &&
                    keys.length > 0
                  ) {
                    onArticleChange(keys[0]);
                  }
                }}
              />
            );

            if (typeof onLoad !== "undefined") {
              onLoad(json.data);
            }
          } else {
            if (typeof onError !== "undefined") {
              onError(json.data, json.message);
            }
            message.error(json.message);
          }
        })
        .finally(() => {
          if (typeof onLoading !== "undefined") {
            onLoading(false);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [
    active,
    type,
    articleId,
    srcDataMode,
    channelId,
    courseId,
    exerciseId,
    userName,
  ]);

  return (
    <div>
      <ArticleView
        id={articleData?.uid}
        title={
          articleData?.title_text ? articleData?.title_text : articleData?.title
        }
        subTitle={articleData?.subtitle}
        summary={articleData?.summary}
        content={articleData ? articleData.content : ""}
        html={articleHtml}
        path={articleData?.path}
        created_at={articleData?.created_at}
        updated_at={articleData?.updated_at}
        channels={channels}
        type={type}
        articleId={articleId}
        onPathChange={(
          node: ITocPathNode,
          e: React.MouseEvent<HTMLSpanElement | HTMLAnchorElement, MouseEvent>
        ) => {
          let newType = type;
          if (typeof onArticleChange !== "undefined") {
            const newArticleId = node.key
              ? node.key
              : `${node.book}-${node.paragraph}`;
            const target = e.ctrlKey || e.metaKey ? "_blank" : "self";
            onArticleChange(newType, newArticleId, target);
          }
        }}
      />
      <Divider />
      {extra}
      <Divider />
    </div>
  );
};

export default TypeCourseWidget;