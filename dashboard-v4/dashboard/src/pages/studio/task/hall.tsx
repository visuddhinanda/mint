import { useParams } from "react-router-dom";

import TaskList from "../../../components/task/TaskList";
import { useAppSelector } from "../../../hooks";
import { currentUser } from "../../../reducers/current-user";

const Widget = () => {
  const { studioname } = useParams();
  const currUser = useAppSelector(currentUser);
  return currUser ? (
    <TaskList
      studioName={studioname}
      status={["published"]}
      filters={[
        {
          field: "sign_up",
          operator: "equals",
          value: "true",
        },
      ]}
    />
  ) : (
    <>未登录</>
  );
};

export default Widget;
