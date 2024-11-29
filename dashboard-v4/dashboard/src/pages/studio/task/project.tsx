import { useNavigate, useParams } from "react-router-dom";

import Project from "../../../components/task/Project";
import TaskList from "../../../components/task/TaskList";
import { Tabs } from "antd";
import TaskTable from "../../../components/task/TaskTable";
import TaskRelation from "../../../components/task/TaskRelation";
import { useState } from "react";
import { ITaskData } from "../../../components/api/task";
import TaskLoader from "../../../components/task/TaskLoader";

const Widget = () => {
  const { studioname } = useParams();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ITaskData[]>();
  return (
    <>
      <Project
        studioName={studioname}
        projectId={projectId}
        onSelect={(id: string) => {
          navigate(`/studio/${studioname}/task/project/${id}`);
        }}
      />
      <Tabs
        type="card"
        items={[
          {
            label: "列表",
            key: "list",
            children: (
              <TaskList
                editable
                studioName={studioname}
                projectId={projectId}
                onLoad={(data) => setTasks(data)}
                onChange={(data) =>
                  setTasks((origin) => {
                    const old = origin?.find((value) => value.id === data.id);
                    let newData: ITaskData[] = [];
                    if (old) {
                      origin?.forEach(
                        (
                          value: ITaskData,
                          index: number,
                          array: ITaskData[]
                        ) => {
                          if (value.id === data.id) {
                            array[index] = data;
                          }
                        }
                      );
                    } else {
                      if (origin) {
                        newData = [...origin, data];
                      } else {
                        newData = [data];
                      }
                    }
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

export default Widget;
