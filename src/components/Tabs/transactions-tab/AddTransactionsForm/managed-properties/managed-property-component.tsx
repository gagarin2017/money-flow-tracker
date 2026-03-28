import { Col, Row } from "antd";
import { Form } from "formik";

interface ManagedPropertyComponentProps {
  managedPropsTable: any;
  formBody: any;
}

const ManagedPropertyComponent = ({
  managedPropsTable,
  formBody,
}: ManagedPropertyComponentProps) => {
  return (
    <Row gutter={[2, 4]} justify={"center"}>
      <Col span={20}>{managedPropsTable}</Col>
      <Col span={4}>
        <Form>{formBody}</Form>
      </Col>
    </Row>
  );
};

export default ManagedPropertyComponent;
