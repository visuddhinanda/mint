import { useState } from "react";
import { ITaskData } from "../api/task";
import TaskReader from "./TaskReader";
import TaskEdit from "./TaskEdit";
import { set } from "lodash";

interface IWidget {
  taskId?: string;
  onLoad?: (task: ITaskData) => void;
  onChange?: (task: ITaskData[]) => void;
}
const Task = ({ taskId, onLoad, onChange }: IWidget) => {
  const [isEdit, setIsEdit] = useState(false);
  const [task, setTask] = useState<ITaskData>();
  return (
    <div>
      {isEdit ? (
        <TaskEdit
          taskId={taskId}
          onLoad={(data: ITaskData) => {}}
          onChange={(data: ITaskData) => {
            onChange && onChange([data]);
            setTask(data);
            setIsEdit(false);
          }}
        />
      ) : (
        <TaskReader
          taskId={taskId}
          task={task}
          onLoad={(data: ITaskData) => setTask(data)}
          onChange={(data: ITaskData[]) => {
            onChange && onChange(data);
            setTask(data.find((t) => t.id === taskId));
          }}
          onEdit={() => setIsEdit(true)}
        />
      )}
    </div>
  );
};

export default Task;
