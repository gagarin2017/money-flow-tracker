import { Button, Dropdown, MenuProps, Space, notification } from "antd";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../context/import-transactions-context";
import AddTransactionsForm from "./AddTransactionsForm/add-transactions-form";
import ImportTransactionsForm from "./ImportTransactionsForm/import-transactions-form";
import PayeeCatDescTagManager, {
  ManagedPropertiesMap,
  ManagedProperty,
} from "./AddTransactionsForm/payee-cat-desc-tag-manager";
import { isSpringBoot } from "../../services/api-common";
import { fetchPayeesCategoriesTags } from "./add-transactions-utils";
import { DownOutlined, MenuOutlined, LineOutlined } from "@ant-design/icons";
import ImportSingleTransactionForm from "./ImportTransactionsForm/import-single-transaction-form";
import { useState } from "react";
import ErrorDisplay from "../../../UI/error-display";

const importOptions: MenuProps["items"] = [
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

const managePropsOptions: MenuProps["items"] = [
  {
    key: "1",
    label: `${ManagedPropertiesMap.get(ManagedProperty.PAYEE)?.multipleName}`,
    icon: <MenuOutlined />,
  },
  {
    key: "2",
    label: `${
      ManagedPropertiesMap.get(ManagedProperty.CATEGORY)?.multipleName
    }`,
    icon: <LineOutlined />,
  },
  {
    key: "3",
    label: `${ManagedPropertiesMap.get(ManagedProperty.DESC)?.multipleName}`,
    icon: <LineOutlined />,
  },
  {
    key: "4",
    label: `${ManagedPropertiesMap.get(ManagedProperty.TAG)?.multipleName}`,
    icon: <LineOutlined />,
  },
];

function TransactionsMenu() {
  const { state, dispatch } = useImportTransactionsContext();

  const [api, contextHolder] = notification.useNotification();

  const [managedProp, setManagedProp] = useState<ManagedProperty | undefined>(
    undefined
  );

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

  const handleManagePayeeCatDescTagForm = (managedProp: ManagedProperty) => {
    setManagedProp(managedProp);
    fetchPayeesCategoriesTags(isSpringBoot, dispatch, api);
    dispatch({
      type: ImportTransactionsActionType.MANAGE_FORM_VISIBLE,
      payload: !state.isManageFormVisible,
    });
  };

  const handleImportButtonClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "1") {
      handleOpenCloseOfImportTransactionsForm();
    } else if (key === "2") {
      handleOpenCloseOfImportSingleTransactionsForm();
    }
  };

  const handleManageButtonClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1":
        handleManagePayeeCatDescTagForm(ManagedProperty.PAYEE);
        break;
      case "2":
        handleManagePayeeCatDescTagForm(ManagedProperty.CATEGORY);
        break;
      case "3":
        handleManagePayeeCatDescTagForm(ManagedProperty.DESC);
        break;
      case "4":
        handleManagePayeeCatDescTagForm(ManagedProperty.TAG);
        break;
    }
  };

  return (
    <>
      <Dropdown
        menu={{ items: importOptions, onClick: handleImportButtonClick }}
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
      <Dropdown
        menu={{ items: managePropsOptions, onClick: handleManageButtonClick }}
        arrow
        trigger={["click"]}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Button>
            <Space>
              Manage
              <DownOutlined />
            </Space>
          </Button>
        </a>
      </Dropdown>

      <ImportTransactionsForm />
      {state.newTransactions && state.newTransactions.length > 0 && (
        <AddTransactionsForm />
      )}
      {state.isImportSingleTransactionsFormVisible && (
        <ImportSingleTransactionForm />
      )}
      {state.isManageFormVisible && managedProp && (
        <PayeeCatDescTagManager managedProperty={managedProp} />
      )}
      {contextHolder}
    </>
  );
}

export default TransactionsMenu;
