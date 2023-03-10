import { useState } from "react";
import { useIntl } from "react-intl";
import { Button, message, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

import { put } from "../../../request";
import { ISentenceRequest, ISentenceResponse } from "../../api/Corpus";
import { ISentence } from "../SentEdit";

const { Text } = Typography;

interface ISentCellEditable {
  data: ISentence;
  onDataChange?: Function;
  onClose?: Function;
}
const Widget = ({ data, onDataChange, onClose }: ISentCellEditable) => {
  const intl = useIntl();
  const [value, setValue] = useState(data.content);
  const [saving, setSaving] = useState<boolean>(false);

  const save = () => {
    setSaving(true);
    put<ISentenceRequest, ISentenceResponse>(
      `/v2/sentence/${data.book}_${data.para}_${data.wordStart}_${data.wordEnd}_${data.channel.id}`,
      {
        book: data.book,
        para: data.para,
        wordStart: data.wordStart,
        wordEnd: data.wordEnd,
        channel: data.channel.id,
        content: value,
      }
    )
      .then((json) => {
        console.log(json);
        setSaving(false);

        if (json.ok) {
          message.success(intl.formatMessage({ id: "flashes.success" }));
          if (typeof onDataChange !== "undefined") {
            const newData: ISentence = {
              content: json.data.content,
              html: json.data.html,
              book: json.data.book,
              para: json.data.paragraph,
              wordStart: json.data.word_start,
              wordEnd: json.data.word_end,
              editor: json.data.editor,
              channel: json.data.channel,
              updateAt: json.data.updated_at,
            };
            onDataChange(newData);
          }
        } else {
          message.error(json.message);
        }
      })
      .catch((e) => {
        setSaving(false);
        console.error("catch", e);
        message.error(e.message);
      });
  };

  return (
    <div>
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <span>
            <Text keyboard>esc</Text>=
            <Button
              size="small"
              type="link"
              onClick={(e) => {
                if (typeof onClose !== "undefined") {
                  onClose(e);
                }
              }}
            >
              cancel
            </Button>
          </span>
          <span>
            <Text keyboard>enter</Text>=
            <Button size="small" type="link">
              new line
            </Button>
          </span>
        </div>
        <div>
          <Text keyboard>Ctrl/⌘</Text>➕<Text keyboard>enter</Text>=
          <Button
            size="small"
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => save()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Widget;