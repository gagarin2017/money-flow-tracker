import { Modal } from "antd";

interface FormsModalProps {
  title: string;
  isModalVisible: any;
  children: React.ReactNode;
  handleCancel: () => void;
  customWidth?: number;
}

const MinimalisticModal = ({
  title,
  isModalVisible,
  children,
  customWidth,
  handleCancel,
}: FormsModalProps) => {
  return (
    <Modal
      title={title}
      open={isModalVisible}
      onCancel={handleCancel}
      destroyOnClose
      maskClosable={false}
      closable={true}
      width={customWidth}
      footer={null}
    >
      <div>{children}</div>
    </Modal>
  );
};

export default MinimalisticModal;
