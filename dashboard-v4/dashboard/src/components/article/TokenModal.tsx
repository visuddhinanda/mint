import { useEffect, useState } from "react";
import { Modal } from "antd";
import { ArticleType } from "./Article";
import Token from "./Token";

interface IWidget {
  channels?: string[];
  articleId?: string;
  type?: ArticleType;
  trigger?: React.ReactNode;
  open?: boolean;
  onClose?: Function;
}
const TokenModal = ({
  channels,
  articleId,
  type,
  trigger,
  open = false,
  onClose,
}: IWidget) => {
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => setIsModalOpen(open), [open]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (typeof onClose !== "undefined") {
      onClose(false);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    if (typeof onClose !== "undefined") {
      onClose(false);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <span onClick={showModal}>{trigger}</span>
      <Modal
        width={500}
        title="token"
        footer={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Token channels={channels} articleId={articleId} type={type} />
      </Modal>
    </>
  );
};

export default TokenModal;
