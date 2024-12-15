import { Button, Modal, Steps } from "antd";

import { useState } from "react";
import PaliTextToc from "../article/PaliTextToc";
import Workflow from "./Workflow";
import { ITaskData } from "../api/task";

interface IModal {
  tiger?: React.ReactNode;
  studioName?: string;
  book?: number;
  para?: number;
  open?: boolean;
  onClose?: () => void;
}
export const TaskBuilderModal = ({
  tiger,
  studioName,
  book,
  para,
  open = false,
  onClose,
}: IModal) => {
  return (
    <>
      <Modal
        destroyOnClose={true}
        width={1400}
        style={{ top: 10 }}
        title={""}
        open={open}
        onOk={onClose}
        onCancel={onClose}
      >
        <TaskBuilder studioName={studioName} book={book} para={para} />
      </Modal>
    </>
  );
};

interface IWidget {
  studioName?: string;
  book?: number;
  para?: number;
}
const TaskBuilder = ({ studioName, book, para }: IWidget) => {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<ITaskData[]>();

  const steps = [
    {
      title: "章节选择",
      content: <PaliTextToc book={book} para={para} />,
    },
    {
      title: "工作流",
      content: (
        <Workflow studioName={studioName} onData={(data) => setData(data)} />
      ),
    },
    {
      title: "生成",
      content: "Last-content",
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Steps current={current} items={items} />
      <div className="steps-content">{steps[current].content}</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          style={{ margin: "0 8px" }}
          disabled={current === 0}
          onClick={() => prev()}
        >
          Previous
        </Button>

        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => {}}>
            Done
          </Button>
        )}
      </div>
    </>
  );
};

export default TaskBuilder;
