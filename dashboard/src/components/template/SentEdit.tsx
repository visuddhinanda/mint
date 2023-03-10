import { Card } from "antd";

import type { IUser } from "../auth/User";
import { IChannel } from "../channel/Channel";
import SentContent from "./SentEdit/SentContent";
import SentMenu from "./SentEdit/SentMenu";
import SentTab from "./SentEdit/SentTab";

interface ISuggestionCount {
  suggestion?: number;
  qa?: number;
}
export interface ISentence {
  content: string;
  html: string;
  book: number;
  para: number;
  wordStart: number;
  wordEnd: number;
  editor: IUser;
  channel: IChannel;
  updateAt: string;
  suggestionCount?: ISuggestionCount;
}
export interface ISentenceId {
  book: number;
  para: number;
  wordStart: number;
  wordEnd: number;
}
export interface IWidgetSentEditInner {
  id: string;
  channels?: string[];
  origin?: ISentence[];
  translation?: ISentence[];
  layout?: "row" | "column";
  tranNum?: number;
  nissayaNum?: number;
  commNum?: number;
  originNum: number;
  simNum?: number;
}
const SentEditInner = ({
  id,
  origin,
  translation,
  layout = "column",
  tranNum,
  nissayaNum,
  commNum,
  originNum,
  simNum,
}: IWidgetSentEditInner) => {
  return (
    <Card>
      <SentMenu>
        <SentContent
          origin={origin}
          translation={translation}
          layout={layout}
        />
        <SentTab
          id={id}
          tranNum={tranNum}
          nissayaNum={nissayaNum}
          commNum={commNum}
          originNum={originNum}
          simNum={simNum}
        />
      </SentMenu>
    </Card>
  );
};

interface IWidgetSentEdit {
  props: string;
}
const Widget = ({ props }: IWidgetSentEdit) => {
  const prop = JSON.parse(atob(props)) as IWidgetSentEditInner;
  //console.log("sent data", prop);
  return <SentEditInner {...prop} />;
};

export default Widget;