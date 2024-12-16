import { Key } from "antd/lib/table/interface";
import { useState, useEffect } from "react";

import { get } from "../../request";
import { IChapterToc, IChapterTocListResponse } from "../api/Corpus";
import { ListNodeData } from "./EditableTree";
import TocTree from "./TocTree";
import { Skeleton } from "antd";

interface IWidget {
  book?: number;
  para?: number;
  onSelect?: (selectedKeys: Key[]) => void;
  onData?: (data: IChapterToc[]) => void;
}
const ChapterTocWidget = ({ book, para, onSelect, onData }: IWidget) => {
  const [tocList, setTocList] = useState<ListNodeData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let url = `/v2/chapter?view=toc&book=${book}&para=${para}`;

    setLoading(true);
    console.info("api request", url);
    get<IChapterTocListResponse>(url)
      .then((json) => {
        console.info("api response", json);
        onData && onData(json.data.rows);
        const toc = json.data.rows.map((item, id) => {
          return {
            key: `${item.book}-${item.paragraph}`,
            title: item.text,
            level: parseInt(item.level),
          };
        });
        setTocList(toc);
        if (json.data.rows.length > 0) {
          let path: string[] = [];
          for (let index = json.data.rows.length - 1; index >= 0; index--) {
            const element = json.data.rows[index];
            if (element.book === book && para && element.paragraph <= para) {
              path.push(`${element.book}-${element.paragraph}`);
              break;
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, [book, para]);

  return loading ? (
    <Skeleton active />
  ) : (
    <TocTree
      treeData={tocList}
      onSelect={(selectedKeys: Key[]) => {
        if (typeof onSelect !== "undefined") {
          onSelect && onSelect(selectedKeys);
        }
      }}
    />
  );
};

export default ChapterTocWidget;
