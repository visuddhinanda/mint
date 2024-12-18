import { useEffect, useState } from "react";

import { IProject, ITaskData } from "../api/task";
import "../article/article.css";
import { Status } from "./TaskReader";
import User from "../auth/User";
import { Assignees } from "./TaskList";

interface ITaskHeading {
  id: string;
  title: string;
  children: number;
}

interface IWidget {
  tasks?: ITaskData[];
}
const TaskTable = ({ tasks }: IWidget) => {
  const [tasksTitle, setTasksTitle] = useState<ITaskHeading[][]>();
  const [dataHeading, setDataHeading] = useState<string[]>();
  const [projects, setProjects] = useState<IProject[]>();

  useEffect(() => {
    let projectsId = new Map<string, number>();
    let projectMap = new Map<string, IProject>();
    tasks?.forEach((task) => {
      if (task.project_id && task.project) {
        if (projectsId.has(task.project_id)) {
          projectsId.set(task.project_id, projectsId.get(task.project_id)! + 1);
        } else {
          projectsId.set(task.project_id, 1);
          projectMap.set(task.project_id, task.project);
        }
      }
    });

    setProjects(Array.from(projectMap.values()));

    const getNodeChildren = (task:ITaskData):number=>{
      const children = tasks?.filter((value) => value.parent_id === task.id)
      if(children && children.length>0){
          return children.reduce((acc, cur) => {
            return acc + getNodeChildren(cur)
          }, children.length);
      }else{
        return 0
      }
    }
    //列表头
    let titles1: ITaskHeading[] = [];
    let titles2: ITaskHeading[] = [];
    let titles3: string[] = [];
    tasks
      ?.filter((value: ITaskData) => !value.parent_id)
      .forEach((task) => {
        const children = tasks
          ?.filter((value1) => value1.parent_id === task.id)
          .map((task1) => {
            const child: ITaskHeading = {
              id: task1.id,
              title: task1.title ?? "",
              children: 0,
            };
            return child;
          });
        titles2 = [...titles2, ...children];

        titles1.push({
          title: task.title ?? "",
          id: task.id,
          children: getNodeChildren(task),
        });

        if (children.length === 0) {
          titles3.push(task.title);
        } else {
          titles3 = [...titles3, ...children.map((item) => item.title)];
        }
      });
    const heading = [titles1, titles2];
    console.log("heading", heading);
    setTasksTitle(heading);
    setDataHeading(titles3);
  }, [tasks]);

  return (
    <div className="pcd_article">
      <table>
        <thead>
          {tasksTitle?.map((row, level) => {
            return (
              <tr>
                {level === 0 ? <th rowSpan={2}>project</th> : undefined}
                {row.map((task, index) => {
                  return (
                    <th
                      key={index}
                      colSpan={task.children === 0 ? undefined : task.children}
                      rowSpan={task.children === 0 ? 2 : undefined}
                    >
                      {task.title}
                    </th>
                  );
                })}
              </tr>)
            
          })}
        </thead>
        <tbody>
          {projects?.map((row, index) => (
            <tr key={index}>
              <td>{row.title}</td>
              {dataHeading?.map((task, id) => {
                const taskData = tasks?.find(
                  (value: ITaskData) =>
                    value.title === task && value.project_id === row.id
                );
                return (
                  <td key={id}>
                    <div>
                      <div>
                        {taskData?.executor ? (
                          <User {...taskData.executor} />
                        ) : taskData?.assignees ? (
                          <Assignees data={taskData} />
                        ) : (
                          <></>
                        )}
                      </div>
                      <div>
                        <Status task={taskData} />
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
