import { ITaskData } from "../api/task";
import TaskReader from "./TaskReader";

interface IWidget {
  taskId?: string;
  onLoad?: (task: ITaskData) => void;
  onChange?: (task: ITaskData[]) => void;
}
const Task = ({ taskId, onLoad, onChange }: IWidget) => {
  return (
    <div>
      <TaskReader
        taskId={taskId}
        onChange={(data: ITaskData[]) => {
          onChange && onChange(data);
        }}
      />
    </div>
  );
};

export default Task;
