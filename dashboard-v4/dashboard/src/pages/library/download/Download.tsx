import { Button, Card, Space, Typography } from "antd";

import { useEffect, useState } from "react";

import bg_png from "../../../assets/library/images/download_bg.png";
import Marked from "../../../components/general/Marked";
import { get } from "../../../request";

const { Paragraph } = Typography;

interface IUrl {
  link: string;
  hostname: string;
}

interface IOfflineIndex {
  title: string;
  filename: string;
  url: IUrl[];
  create_at: string;
  chapter: number;
  filesize: number;
}
const ChapterNewWidget = () => {
  const [github, setGithub] = useState<string>("loading");
  const [offlineIndex, setOfflineIndex] = useState<IOfflineIndex[]>();

  const githubLink =
    "https://raw.githubusercontent.com/ariyamaggika/wikipali-app/master/version.txt";
  const giteeLink =
    "https://gitee.com/wolf96/wikipali-app/raw/main/version.txt";
  const giteeRelease = "https://gitee.com/wolf96/wikipali-app/releases";
  useEffect(() => {
    fetch(githubLink, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        console.log("获取的结果", text);
        const link = text.replace(
          /https(.+?)\.apk/g,
          "- [https$1.apk](https$1.apk)"
        );
        setGithub(link.replaceAll("\n", "\n\n"));
        return text;
      })
      .catch((err) => {
        console.log("请求错误", err);
      });

    get<IOfflineIndex[]>("/v2/offline-index")
      .then((json) => {
        console.log("offline", json);
        setOfflineIndex(json);
        return json;
      })
      .catch((err) => {
        console.log("请求错误", err);
      });
  }, []);
  return (
    <Paragraph>
      <div>
        <img alt="code" src={bg_png} />
      </div>
      <Card title={"App下载"} style={{ margin: 10, borderRadius: 8 }}>
        <Paragraph>
          {"点链接打开网站下载安卓App安装包"}
          <Button type="link" size="large">
            <a href={giteeRelease} target="_blank" rel="noreferrer">
              Gitee下载
            </a>
          </Button>
        </Paragraph>

        <Paragraph>
          <Marked text={github} />
        </Paragraph>
      </Card>
      <Card title={"离线数据包"} style={{ margin: 10, borderRadius: 8 }}>
        <Space direction="vertical">
          {offlineIndex?.map((item, id) => {
            return (
              <Card title={item.title} size="small" key={id}>
                <ul key={id}>
                  <li>
                    {"文件名:"}
                    {item.filename}
                  </li>
                  <li>
                    {"文件大小:"}
                    {item.filesize}
                  </li>
                  <li>
                    <ul>
                      {item.url.map((url, id) => {
                        return (
                          <li key={id}>
                            {`镜像${id + 1}:`}
                            <a href={url.link} target="_blank" rel="noreferrer">
                              {url.hostname}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </Card>
            );
          })}
        </Space>
      </Card>
    </Paragraph>
  );
};

export default ChapterNewWidget;
