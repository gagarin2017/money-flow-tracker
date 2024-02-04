import { Button, Card, Space } from "antd";
import { Field } from "formik";
import { ManagedProperty } from "../manage-payee-cat-desc-tag-form";

interface AddNewDescriptionCardProps {
  name: string;
  isTag?: boolean;
  handleAddDescriptionBtnClick: () => void;
}

function AddNewDescriptionCard({
  name: descriptionName,
  isTag,
  handleAddDescriptionBtnClick,
}: AddNewDescriptionCardProps) {
  return (
    <Card
      title={`Add new ${isTag ? ManagedProperty.TAG : ManagedProperty.DESC}`}
    >
      <Space direction="vertical">
        <label htmlFor={descriptionName}>
          {isTag ? ManagedProperty.TAG : ManagedProperty.DESC}
        </label>
        <Field
          id={descriptionName}
          name={descriptionName}
          placeholder={isTag ? ManagedProperty.TAG : ManagedProperty.DESC}
        />

        <Button
          size="small"
          type="primary"
          style={{ marginTop: 10, float: "right" }}
          onClick={() => handleAddDescriptionBtnClick()}
        >
          Add {isTag ? ManagedProperty.TAG : ManagedProperty.DESC}
        </Button>
      </Space>
    </Card>
  );
}

export default AddNewDescriptionCard;
