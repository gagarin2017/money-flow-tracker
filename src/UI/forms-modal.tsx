import { Modal } from "antd";

interface FormsModalProps {
  title: string;
  isModalVisible: any;
  handleOk: () => void;
  handleCancel: () => void;
  children: React.ReactNode;
  customWidth: number;
  isLoading: boolean;
  okText: string | undefined;
}

const FormsModal = ({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  children,
  customWidth,
  isLoading,
  okText,
}: FormsModalProps) => {
  return (
    <Modal
      title={title}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      maskClosable={false}
      closable={false}
      width={customWidth}
      confirmLoading={isLoading}
      okText={okText || "OK"}
    >
      <div>{children}</div>
    </Modal>
  );
};

export default FormsModal;
