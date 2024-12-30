import { Tabs } from "antd";

import TaskList, { treeToList } from "../../components/task/TaskList";
import TaskTable from "../../components/task/TaskTable";
import TaskRelation from "../../components/task/TaskRelation";
import { useState } from "react";
import { ITaskData } from "../../components/api/task";

interface IWidget {
  studioName?: string;
  projectId?: string;
  readonly?: boolean;
  onChange?: (data: ITaskData[]) => void;
}
const ProjectTask = ({
  studioName,
  projectId,
  readonly = false,
  onChange,
}: IWidget) => {
  const [tasks, setTasks] = useState<ITaskData[]>([]);
  const [taskTree, setTaskTree] = useState<ITaskData[]>();
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
                editable={!readonly}
                studioName={studioName}
                projectId={projectId}
                taskTree={taskTree}
                onChange={(treeData: ITaskData[]) => {
                  setTaskTree(treeData);
                  const listData = treeToList(treeData);
                  setTasks(listData);
                  onChange && onChange(listData);
                }}
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
