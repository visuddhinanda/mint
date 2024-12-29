import { Typography } from "antd";
import { ITaskData } from "../api/task";

const { Title } = Typography;

interface IWidget {
  task?: ITaskData;
  onChange?: (data: ITaskData[]) => void;
}
const TaskTitle = ({ task, onChange }: IWidget) => {
  return (
    <Title level={3} editable onChange={(e) => {}}>
      {task?.title}
    </Title>
  );
};

export default TaskTitle;
