
import { Tabs } from "antd";

import TaskList from "../../components/task/TaskList";
import TaskTable from "../../components/task/TaskTable";
import TaskRelation from "../../components/task/TaskRelation";
import { useState } from "react";
import { ITaskData } from "../../components/api/task";

interface IWidget {
  studioName?: string;
  projectId?: string;
}
const ProjectTask = ({studioName, projectId}:IWidget) => {

  const [tasks, setTasks] = useState<ITaskData[]>();
  return (
    <>
      <Tabs
        type="card"
        items={[
          {
            label: "列表",
            key: "list",
            children: (
              <TaskList
                editable
                studioName={studioName}
                projectId={projectId}
                onLoad={(data) => setTasks(data)}
                onChange={(data: ITaskData[]) =>
                  setTasks((origin) => {
                    data.forEach((input) => {
                      const old = origin?.find(
                        (value) => value.id === input.id
                      );
                      if (old) {
                        //找到了更新旧的
                        origin?.forEach(
                          (
                            value: ITaskData,
                            index: number,
                            array: ITaskData[]
                          ) => {
                            if (value.id === input.id) {
                              array[index] = input;
                            }
                          }
                        );
                      } else {
                        //没有找到就添加
                        if (origin) {
                          origin = [...origin, input];
                        } else {
                          origin = [input];
                        }
                      }
                    });

                    return origin;
                  })
                }
              />
            ),
          },
          {
            label: "表格",
            key: "table",
            children: <TaskTable tasks={tasks} />,
          },
          {
            label: "关系图",
            key: "relation",
            children: <TaskRelation tasks={tasks} />,
          },
        ]}
      ></Tabs>
    </>
  );
};

export default ProjectTask;
