import { Outlet } from "react-router-dom";
import { Layout } from "antd";

import LeftSider from "../../../components/studio/LeftSider";
import { styleStudioContent } from "../style";

const { Content } = Layout;

const Widget = () => {
  return (
    <Layout>
      <Layout>
        <LeftSider selectedKeys="recent" />
        <Content style={styleStudioContent}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Widget;
