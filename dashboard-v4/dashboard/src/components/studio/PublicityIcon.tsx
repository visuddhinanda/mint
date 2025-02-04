import { GlobalOutlined } from "@ant-design/icons";
import { TPublicity } from "./PublicitySelect";
import { LockIcon } from "../../assets/icon";

interface IWidget {
  value?: TPublicity;
}
const PublicityIcon = ({ value }: IWidget) => {
  return value === "public" ? (
    <GlobalOutlined />
  ) : value === "private" ? (
    <LockIcon />
  ) : (
    <></>
  );
};

export default PublicityIcon;
