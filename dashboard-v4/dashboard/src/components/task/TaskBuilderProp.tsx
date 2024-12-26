import { Divider, InputNumber } from "antd";

import { ITaskData } from "../api/task";
import "../article/article.css";
import { useEffect, useState } from "react";

export interface IParam {
  key: string;
  value: string;
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
    setProp(
      workflow?.map((item) => {
        return {
          taskTitle: item.title,
          taskId: item.id,
          param: item.description
            ?.replaceAll("}}", "|}}")
            .split("|")
            .filter((value) => value.includes("=?"))
            .map((item) => {
              const [k, v] = item.split("=");
              return {
                key: k,
                value: v,
                initValue: 1,
                step: v === "?++" ? 1 : v === "?+" ? 0 : -1,
              };
            }),
        };
      })
    );
  }, [workflow]);

  const change = (
    tIndex: number,
    pIndex: number,
    initValue: number,
    step: number
  ) => {
    const newData = prop?.map((item, tId) => {
      return {
        taskTitle: item.taskTitle,
        taskId: item.taskId,
        param: item.param?.map((param, pId) => {
          if (tIndex === tId && pIndex === pId) {
            return { ...param, initValue: initValue, step: step };
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
                  <td>初始值</td>
                  <td>递增步长</td>
                </tr>
              </thead>
              <tbody>
                {item.param?.map((item, paramId) => {
                  return (
                    <tr key={paramId}>
                      <td key={1}>{item.key}</td>
                      <td key={2}>
                        <InputNumber
                          defaultValue={item.initValue}
                          value={item.initValue}
                          onChange={(e) => {
                            if (e) {
                              change(taskId, paramId, e, item.step);
                            }
                          }}
                        />
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
                                change(taskId, paramId, item.initValue, e);
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
