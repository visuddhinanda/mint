import { useEffect, useState } from "react";

import { useAppSelector } from "../../hooks";
import { mode } from "../../reducers/article-mode";
import WbwWord, { IWbw, IWbwFields } from "./Wbw/WbwWord";

interface IWidget {
  data: IWbw[];
  display?: "block" | "inline";
  fields?: IWbwFields;
}
export const WbwSentCtl = ({ data, display = "inline", fields }: IWidget) => {
  const [wordData, setWordData] = useState(data);
  const [wbwMode, setWbwMode] = useState(display);
  const [fieldDisplay, setFieldDisplay] = useState(fields);
  const newMode = useAppSelector(mode);
  useEffect(() => {
    switch (newMode) {
      case "edit":
        setWbwMode("inline");
        setFieldDisplay({
          meaning: true,
          factors: false,
          factorMeaning: false,
          case: false,
        });
        break;
      case "wbw":
        setWbwMode("block");
        setFieldDisplay({
          meaning: true,
          factors: true,
          factorMeaning: true,
          case: true,
        });
        break;
    }
  }, [newMode]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {wordData.map((item, id) => {
        return (
          <WbwWord
            data={item}
            key={id}
            display={wbwMode}
            fields={fieldDisplay}
            onChange={(e: IWbw) => {
              console.log("word changed", e);
              console.log("word id", id);
              //TODO update
            }}
            onSplit={(isSplit: boolean) => {
              if (isSplit) {
                //拆分
                const newData: IWbw[] = JSON.parse(JSON.stringify(wordData));
                const children: IWbw[] | undefined = wordData[id].factors?.value
                  .split("+")
                  .map((item) => {
                    return {
                      word: { value: item, status: 5 },
                      real: { value: item, status: 5 },
                      confidence: 1,
                    };
                  });
                if (typeof children !== "undefined") {
                  console.log("children", children);
                  newData.splice(id + 1, 0, ...children);
                  console.log("new-data", newData);
                  setWordData(newData);
                }
              } else {
                //合并
              }
            }}
          />
        );
      })}
    </div>
  );
};

interface IWidgetWbwSent {
  props: string;
}
const Widget = ({ props }: IWidgetWbwSent) => {
  const prop = JSON.parse(atob(props)) as IWidget;
  return <WbwSentCtl {...prop} />;
};

export default Widget;