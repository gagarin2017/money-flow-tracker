import { Button, Dropdown, MenuProps, Space } from "antd";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../context/import-transactions-context";
import AddTransactionsForm from "./AddTransactionsForm/add-transactions-form";
import ImportTransactionsForm from "./ImportTransactionsForm/import-transactions-form";
import ManagePayeesModal from "./AddTransactionsForm/manage-payees/manage-payees-modal";
import { isSpringBoot } from "../../services/api-common";
import { fetchPayeesCategoriesTags } from "./add-transactions-utils";
import { DownOutlined, MenuOutlined, LineOutlined } from "@ant-design/icons";
import ImportSingleTransactionForm from "./ImportTransactionsForm/import-single-transaction-form";

const importButtonOptions: MenuProps["items"] = [
  {
    key: "1",
    label: "Multiple transactions from file(-s)",
    icon: <MenuOutlined />,
  },
  {
    key: "2",
    label: "Single transaction",
    icon: <LineOutlined />,
  },
];

function TransactionsMenu() {
  const { state, dispatch } = useImportTransactionsContext();

  const handleOpenCloseOfImportTransactionsForm = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE,
      payload: !state.isImportTransactionsFormVisible,
    });
  };

  const handleOpenCloseOfImportSingleTransactionsForm = () => {
    dispatch({
      type: ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE,
      payload: !state.isImportTransactionsFormVisible,
    });
  };

  const handleOpenCloseOfManagePayeesModal = () => {
    dispatch({
      type: ImportTransactionsActionType.MANAGE_PAYEE_MODAL_VISIBLE,
      payload: !state.isManagePayeesModalVisible,
    });

    fetchPayeesCategoriesTags(isSpringBoot, dispatch);
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "1") {
      handleOpenCloseOfImportTransactionsForm();
    } else if (key === "2") {
      handleOpenCloseOfImportSingleTransactionsForm();
    }
  };

  return (
    <>
      <Dropdown
        menu={{ items: importButtonOptions, onClick }}
        placement="topLeft"
        arrow
        trigger={["click"]}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Button>
            <Space>
              Import
              <DownOutlined />
            </Space>
          </Button>
        </a>
      </Dropdown>

      <Button onClick={handleOpenCloseOfManagePayeesModal}>
        Manage Payees
      </Button>
      <ImportTransactionsForm />
      {state.newTransactions && state.newTransactions.length > 0 && (
        <AddTransactionsForm />
      )}
      {state.isImportSingleTransactionsFormVisible && (
        <ImportSingleTransactionForm />
      )}
      {state.isManagePayeesModalVisible && <ManagePayeesModal />}
    </>
  );
}

export default TransactionsMenu;
