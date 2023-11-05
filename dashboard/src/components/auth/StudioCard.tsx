import { useIntl } from "react-intl";
import { Popover, Avatar } from "antd";
import { IStudio } from "./StudioName";
import { Link } from "react-router-dom";
import React from "react";

interface IWidget {
  studio?: IStudio;
  children?: JSX.Element;
  popOver?: React.ReactNode;
}
const StudioCardWidget = ({ studio, children, popOver }: IWidget) => {
  const intl = useIntl();

  return (
    <Popover
      content={
        popOver ? (
          popOver
        ) : (
          <>
            <div style={{ display: "flex" }}>
              <div style={{ paddingRight: 8 }}>
                <Avatar style={{ backgroundColor: "#87d068" }} size="small">
                  {studio?.nickName?.slice(0, 1)}
                </Avatar>
              </div>
              <div>
                <div>{studio?.nickName}</div>
                <div>
                  <Link
                    to={`/blog/${studio?.studioName}/overview`}
                    target="_blank"
                  >
                    {intl.formatMessage({
                      id: "columns.library.blog.label",
                    })}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )
      }
      placement="bottomRight"
    >
      {children}
    </Popover>
  );
};

export default StudioCardWidget;