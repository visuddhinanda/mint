import { Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

import Marked from "../general/Marked";
import { get, post } from "../../request";
import { IAiTranslateRequest, IAiTranslateResponse } from "../api/ai";

const { Text } = Typography;

interface IAiTranslateWidget {
  origin?: string;
  paragraph?: string;
  autoLoad?: boolean;
  trigger?: boolean;
}

const AiTranslate = ({
  origin,
  paragraph,
  autoLoad = false,
  trigger = false,
}: IAiTranslateWidget) => {
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState<string>();
  const [error, setError] = useState<string>();
  const url = "/v2/ai-translate";

  useEffect(() => {
    if (typeof paragraph === "undefined") {
      return;
    }
    if (!autoLoad) {
      return;
    }
    onTranslatePara();
  }, [paragraph, autoLoad]);

  const onTranslatePara = () => {
    const _url = `${url}/${paragraph}`;
    console.info("api request", _url);
    setLoading(true);
    get<IAiTranslateResponse>(_url)
      .then((json) => {
        console.debug("api response", json);
        if (json.ok) {
          setTranslation(json.data.choices[0].message.content);
        } else {
          setError(json.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const onTranslate = (origin?: string) => {
    if (typeof origin === "undefined") {
      return;
    }
    const data = { origin: origin };
    console.info("api request", url, data);
    setLoading(true);
    post<IAiTranslateRequest, IAiTranslateResponse>(url, data)
      .then((json) => {
        console.debug("api response", json);
        if (json.ok) {
          setTranslation(json.data.choices[0].message.content);
        } else {
          setError(json.message);
        }
      })
      .finally(() => setLoading(false));
  };

  if (translation) {
    return <Marked text={translation} />;
  } else if (loading) {
    return <LoadingOutlined />;
  } else if (error) {
    return (
      <div>
        <Text type="danger">{error}</Text>
        <Button type="link" onClick={() => onTranslatePara()}>
          再试一次
        </Button>
      </div>
    );
  } else if (trigger) {
    return (
      <Button type="link" onClick={() => onTranslatePara()}>
        AI 翻译
      </Button>
    );
  } else {
    return <></>;
  }
};

export default AiTranslate;
