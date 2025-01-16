import { Divider, Input, InputNumber } from "antd";

import { ITaskData } from "../api/task";
import "../article/article.css";
import { useEffect, useState } from "react";

type TParamType = "number" | "string";
export interface IParam {
  key: string;
  value: string;
  type: TParamType;
  initValue: number;
  step: number;
}
export interface IProp {
  taskTitle: string;
  taskId: string;
  param?: IParam[];
}

interface IWidget {
  workflow?: ITaskData[];
  onChange?: (data: IProp[] | undefined) => void;
}
const TaskBuilderProp = ({ workflow, onChange }: IWidget) => {
  //console.debug("TaskBuilderProp render");
  const [prop, setProp] = useState<IProp[]>();
  useEffect(() => {
    const newProp = workflow?.map((item) => {
      const num = item.description
        ?.replaceAll("}}", "|}}")
        .split("|")
        .filter((value) => value.includes("=?"))
        .map((item) => {
          const [k, v] = item.split("=");
          const value: IParam = {
            key: k,
            value: v,
            type: "number",
            initValue: 1,
            step: v === "?++" ? 1 : v === "?+" ? 0 : -1,
          };
          return value;
        });
      const constant = item.description
        ?.replaceAll("}}", "|}}")
        .split("|")
        .filter((value) => value.includes("=%"))
        .map((item) => {
          const [k, v] = item.split("=");
          const value: IParam = {
            key: v,
            value: "",
            type: "string",
            initValue: 0,
            step: 0,
          };
          return value;
        });
      let output: IParam[] = [];
      if (num) {
        output = [...output, ...num];
      }
      if (constant) {
        output = [...output, ...constant];
      }
      return {
        taskTitle: item.title,
        taskId: item.id,
        param: output,
      };
    });
    setProp(newProp);
  }, [workflow]);

  const change = (
    tIndex: number,
    pIndex: number,
    value: string,
    initValue: number,
    step: number
  ) => {
    const newData = prop?.map((item, tId) => {
      return {
        taskTitle: item.taskTitle,
        taskId: item.taskId,
        param: item.param?.map((param, pId) => {
          if (tIndex === tId && pIndex === pId) {
            return { ...param, value: value, initValue: initValue, step: step };
          } else {
            return param;
          }
        }),
      };
    });
    setProp(newData);
    console.debug("newData", newData);
    onChange && onChange(newData);
  };
  return (
    <>
      {prop?.map((item, taskId) => {
        return (
          <div key={taskId}>
            <Divider>{item.taskTitle}</Divider>
            <table>
              <thead>
                <tr>
                  <td>变量名</td>
                  <td>值</td>
                  <td>递增步长</td>
                </tr>
              </thead>
              <tbody>
                {item.param?.map((item, paramId) => {
                  return (
                    <tr key={paramId}>
                      <td key={1}>{item.key}</td>
                      <td key={2}>
                        {item.type === "number" ? (
                          <InputNumber
                            defaultValue={item.initValue}
                            value={item.initValue}
                            onChange={(e) => {
                              if (e) {
                                change(
                                  taskId,
                                  paramId,
                                  item.value,
                                  e,
                                  item.step
                                );
                              }
                            }}
                          />
                        ) : (
                          <Input
                            defaultValue={item.value}
                            value={item.value}
                            onChange={(e) => {
                              if (e) {
                                change(
                                  taskId,
                                  paramId,
                                  e.target.value,
                                  item.initValue,
                                  item.step
                                );
                              }
                            }}
                          />
                        )}
                      </td>
                      <td key={3}>
                        {item.value === "?" ? (
                          <>{"无"}</>
                        ) : (
                          <InputNumber
                            defaultValue={item.step}
                            readOnly={item.value === "?++"}
                            onChange={(e) => {
                              if (e) {
                                change(
                                  taskId,
                                  paramId,
                                  item.value,
                                  item.initValue,
                                  e
                                );
                              }
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
};

export default TaskBuilderProp;
