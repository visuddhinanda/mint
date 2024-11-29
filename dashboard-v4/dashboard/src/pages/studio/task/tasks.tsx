import { useParams } from "react-router-dom";

import TaskList from "../../../components/task/TaskList";
import TaskList2 from "../../../components/task/TaskList";
import { useAppSelector } from "../../../hooks";
import { currentUser } from "../../../reducers/current-user";
import MyTasks from "../../../components/task/MyTasks";

const Widget = () => {
  const { studioname } = useParams();

  return <MyTasks studioName={studioname} />;
};

export default Widget;
