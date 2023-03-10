import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Affix, Col, Row } from "antd";

import DictSearch from "./DictSearch";
import SearchVocabulary from "./SearchVocabulary";
import Compound from "./Compound";

const { Content } = Layout;

interface IWidget {
  word?: string;
  compact?: boolean;
  onSearch?: Function;
}
const Widget = ({ word, compact = false, onSearch }: IWidget) => {
  const navigate = useNavigate();
  const [split, setSplit] = useState<string>();
  const [wordSearch, setWordSearch] = useState<string>();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setWordSearch(word?.toLowerCase());
  }, [word]);

  return (
    <div ref={setContainer}>
      <Affix offsetTop={0} target={compact ? () => container : undefined}>
        <div
          style={{
            backgroundColor: "rgba(100,100,100,0.3)",
            backdropFilter: "blur(5px)",
          }}
        >
          <Row style={{ paddingTop: "0.5em", paddingBottom: "0.5em" }}>
            {compact ? <></> : <Col flex="auto"></Col>}
            <Col flex="560px">
              <SearchVocabulary
                value={word}
                onSearch={(value: string, isFactor?: boolean) => {
                  console.log("onSearch", value);
                  const word = value.toLowerCase();
                  setWordSearch(word);
                  if (typeof onSearch !== "undefined") {
                    onSearch(value, isFactor);
                  }
                }}
                onSplit={(word: string | undefined) => {
                  setSplit(word);
                }}
              />
            </Col>
            {compact ? <></> : <Col flex="auto"></Col>}
          </Row>
        </div>
      </Affix>
      <Content style={{ minHeight: 700 }}>
        <Row>
          {compact ? <></> : <Col flex="auto"></Col>}
          <Col flex="1260px">
            <Compound word={wordSearch} add={split} />
            <DictSearch word={wordSearch} compact={compact} />
          </Col>
          {compact ? <></> : <Col flex="auto"></Col>}
        </Row>
      </Content>
    </div>
  );
};

export default Widget;