import { Typography } from "antd";
import { Space } from "antd";

import StudioName from "../../auth/StudioName";
import User from "../../auth/User";
import Channel from "../../channel/Channel";
import TimeShow from "../../general/TimeShow";
import { ISentence } from "../SentEdit";

const { Text } = Typography;

interface IWidget {
  data: ISentence;
  isPr?: boolean;
}
const EditInfoWidget = ({ data, isPr = false }: IWidget) => {
  return (
    <div style={{ fontSize: "80%" }}>
      <Text type="secondary">
        <Space>
          {isPr ? undefined : (
            <StudioName data={data.studio} showName={false} />
          )}
          <Channel {...data.channel} />
          <User {...data.editor} showAvatar={isPr ? true : false} />
          <span>edit</span>
          {data.prEditAt ? (
            <TimeShow time={data.prEditAt} />
          ) : (
            <TimeShow time={data.updateAt} />
          )}
          {data.acceptor ? (
            <User {...data.acceptor} showAvatar={false} />
          ) : undefined}
          {data.acceptor ? "accept at" : undefined}
          {data.prEditAt ? <TimeShow time={data.updateAt} /> : undefined}
        </Space>
      </Text>
    </div>
  );
};

export default EditInfoWidget;