import { Layout } from "antd";

import HeadBar from "../../../components/library/HeadBar";
import FooterBar from "../../../components/library/FooterBar";
import { Outlet } from "react-router-dom";

const Widget = () => {
	// TODO
	return (
		<>
			<Layout>
				<HeadBar selectedKeys="palicanon" />
				<Outlet />
				<FooterBar />
			</Layout>
		</>
	);
};

export default Widget;