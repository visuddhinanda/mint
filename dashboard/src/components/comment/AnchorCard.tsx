import { useIntl } from "react-intl";
import { useState } from "react";
import { Card, Space, Segmented } from "antd";

import store from "../../store";
import { modeChange } from "../../reducers/article-mode";
import { ArticleMode } from "../article/Article";

interface IWidgetArticleCard {
  children?: React.ReactNode;
  onModeChange?: Function;
}
const Widget = ({ children, onModeChange }: IWidgetArticleCard) => {
  const intl = useIntl();
  const [mode, setMode] = useState<string>("read");

  const modeSwitch = (
    <Segmented
      size="middle"
      options={[
        {
          label: intl.formatMessage({ id: "buttons.translate" }),
          value: "edit",
        },
        {
          label: intl.formatMessage({ id: "buttons.wbw" }),
          value: "wbw",
        },
      ]}
      value={mode}
      onChange={(value) => {
        const newMode = value.toString();
        if (typeof onModeChange !== "undefined") {
          if (mode === "read" || newMode === "read") {
            onModeChange(newMode);
          }
        }
        setMode(newMode);
        //发布mode变更
        store.dispatch(modeChange(newMode as ArticleMode));
      }}
    />
  );

  return (
    <Card
      size="small"
      title={<Space>{"title"}</Space>}
      extra={<Space>{modeSwitch}</Space>}
    >
      {children}
    </Card>
  );
};

export default Widget;