import { Col, Row } from "antd";
import { Form, Formik, FormikHelpers } from "formik";

import MinimalisticModal from "../../../../../UI/minimalistic-modal";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../../context/import-transactions-context";
import { Category } from "../../../../../model/category";
import Payee from "../model/payee";
import AddNewPayeeCard from "./add-new-payee-card";
import PayeeList from "./payee-list";
import { Description } from "../../../../../model/description";
import { Tag } from "../../../../../model/tag";

interface NewPayeeFormData {
  name: string;
  category: Category | undefined;
  description: Description | undefined;
  tag: Tag | undefined;
  amount: number;
}

const ManagePayeesModal = () => {
  const { state, dispatch } = useImportTransactionsContext();

  const getInitialValues = () => {
    let initialForm = {
      name: "",
      category: undefined,
      description: undefined,
      tag: undefined,
    } as NewPayeeFormData;
    return initialForm;
  };

  const handleFormClose = () => {
    dispatch({
      type: ImportTransactionsActionType.MANAGE_PAYEE_MODAL_VISIBLE,
      payload: false,
    });
  };

  const onSubmit = async (
    formValues: NewPayeeFormData,
    { resetForm }: FormikHelpers<NewPayeeFormData>
  ) => {
    const payeeToBeSaved: Payee = {
      id:
        formValues.category?.id ||
        1122.3 * (formValues.tag?.id || Math.random()),
      name: formValues.name,
      category: {
        id: formValues.category?.id || 0,
        name: formValues.category?.name || "",
        subCategories: formValues.category?.subCategories || [],
      } as Category,
      description: {
        id: formValues.description?.id || 0,
        name: formValues.description?.name || "",
      },
      tag: { id: formValues.tag?.id || 0, name: formValues.tag?.name || "" },
      amount: formValues.amount,
    };

    dispatch({
      type: ImportTransactionsActionType.ADD_NEW_PAYEE,
      payload: payeeToBeSaved,
    });
    console.log(
      "🚀 ~ file: manage-payees-modal.tsx:70 ~ ManagePayeesModal ~ payeeToBeSaved:",
      payeeToBeSaved
    );

    resetForm();
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={(values, handleReset) => {
        onSubmit(values, handleReset);
      }}
    >
      {({ values, handleSubmit, handleReset, isSubmitting }) => (
        <MinimalisticModal
          title={"Manage Payees"}
          isModalVisible={state.isManagePayeesModalVisible}
          handleCancel={() => {
            handleReset();
            handleFormClose();
          }}
          customWidth={1500}
        >
          <Row gutter={[2, 4]} justify={"center"}>
            <Col span={20}>
              <PayeeList />
            </Col>
            <Col span={4}>
              <Form>
                <AddNewPayeeCard
                  fieldPayeeName="name"
                  fieldCategory="category"
                  fieldDescription="description"
                  fieldTag="tag"
                  fieldAmount="amount"
                  handleAddPayeeBtnClick={handleSubmit}
                />
              </Form>
            </Col>
          </Row>
        </MinimalisticModal>
      )}
    </Formik>
  );
};

export default ManagePayeesModal;
