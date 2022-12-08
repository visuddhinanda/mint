import { Button } from "antd";
import { useState } from "react";
import { Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ISentence } from "../SentEdit";
import SentEditMenu from "./SentEditMenu";
import SentCellEditable from "./SentCellEditable";

interface ISentCell {
  data: ISentence;
}
const Widget = ({ data }: ISentCell) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [sentData, setSentData] = useState<ISentence>(data);

  return (
    <>
      <div style={{ display: isEditMode ? "none" : "block" }}>
        <Button
          type="dashed"
          style={{ width: 300 }}
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEditMode(true);
          }}
        >
          添加修改建议
        </Button>
      </div>
      <div style={{ display: isEditMode ? "block" : "none" }}>
        <SentCellEditable
          data={sentData}
          onClose={() => {
            setIsEditMode(false);
          }}
          onDataChange={(data: ISentence) => {
            setSentData(data);
          }}
        />
      </div>
    </>
  );
};

export default Widget;