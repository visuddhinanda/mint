import { Button, Drawer, Space } from "antd";
import { useEffect, useState } from "react";

import ProjectEdit from "./ProjectEdit";

interface IWidget {
  studioName?: string;
  projectId?: string;
  openDrawer?: boolean;
  onClose?: () => void;
}
const ProjectEditDrawer = ({
  studioName,
  projectId,
  openDrawer = false,
  onClose,
}: IWidget) => {
  const [open, setOpen] = useState(openDrawer);

  useEffect(() => {
    setOpen(openDrawer);
  }, [openDrawer]);

  const onCloseDrawer = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Drawer
        title={<></>}
        placement={"right"}
        width={650}
        onClose={onCloseDrawer}
        open={open}
        destroyOnClose
        extra={
          <Space>
            <Button type="primary">从模版创建任务</Button>
          </Space>
        }
      >
        <ProjectEdit studioName={studioName} projectId={projectId} />
      </Drawer>
    </>
  );
};

export default ProjectEditDrawer;
