import { useEffect, useState } from "react";
import { ITagCount } from "../../reducers/fts-books-tag";
import BookTree from "./BookTree";
import { get } from "../../request";
import { IFtsResponse } from "../fts/FtsBookList";
import { ISearchView } from "../fts/FullTextSearchResult";

interface IWidget {
  keyWord?: string;
  keyWords?: string[];
  root?: string;
  path?: string[];
  view?: ISearchView;
  multiSelect?: boolean;
  multiSelectable?: boolean;
  onChange?: (key: string[], path: string[]) => void;
}
const BookTreeWithTags = ({
  keyWord,
  keyWords,
  root = "default",
  path,
  view,
  multiSelect = false,
  multiSelectable = true,
  onChange,
}: IWidget) => {
  const [tags, setTags] = useState<ITagCount[]>();
  useEffect(() => {
    let words;
    let api = "";
    if (keyWord?.trim().includes(" ")) {
      api = "search-book-list";
      words = keyWord;
    } else {
      api = "search-pali-wbw-books";
      words = keyWords?.join();
    }

    let url = `/v2/${api}?view=${view}&key=${words}`;
    console.info("api request", url);
    get<IFtsResponse>(url).then((json) => {
      console.info("api response", json);
      if (json.ok) {
        let tagsMap = new Map<string, number>();
        json.data.rows.forEach((value) => {
          value.tags?.forEach((tag) => {
            if (tag.name) {
              const old = tagsMap.get(tag.name);
              tagsMap.set(tag.name, old ? old + 1 : 1);
            }
          });
        });
        let _tags: ITagCount[] = [];
        tagsMap.forEach((value, key) => {
          _tags.push({ name: key, count: value });
        });
        console.log("_tags", _tags);
        setTags(_tags);
      }
    });
  }, [keyWord, keyWords, view]);
  return (
    <BookTree
      multiSelect={multiSelect}
      multiSelectable={multiSelectable}
      root={root}
      path={path}
      tags={tags}
      onChange={onChange}
    />
  );
};

export default BookTreeWithTags;
