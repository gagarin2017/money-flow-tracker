import { DownOutlined, LineOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space, notification } from "antd";
import { useState } from "react";
import { useImportTransactionsContext } from "../../../context/import-transactions-context";
import { isSpringBoot } from "../../services/api-common";
import AddTransactionsForm from "./AddTransactionsForm/add-transactions-form";
import PayeeCatDescTagManager, {
  ManagedPropertiesMap,
  ManagedProperty,
} from "./AddTransactionsForm/payee-cat-desc-tag-manager";
import { fetchPayeesCategoriesTags as fetchPayeesCategoriesTagsRules } from "./add-transactions-utils";
import { ImportTransactionsActionType } from "../../../context/import-transactions-context-helpers/constants";
import ImportSingleTransactionForm from "./import-transactions/ImportTransactionsForm/import-single-transaction-form";
import ImportTransactionsForm from "./import-transactions/ImportTransactionsForm/import-transactions-form";
import { useRules } from "../../hooks/useRules";

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
  {
    key: "5",
    label: `${ManagedPropertiesMap.get(ManagedProperty.RULE)?.multipleName}`,
    icon: <LineOutlined />,
  },
];

function TransactionsMenu() {
  const { state, dispatch } = useImportTransactionsContext();
  const { rules, deleteRule, refetch: fetchRules, loading } = useRules();

  const [api, contextHolder] = notification.useNotification();

  const [managedProp, setManagedProp] = useState<ManagedProperty | undefined>(
    undefined
  );

  const handleOpenCloseOfImportTransactionsForm = () => {
    fetchPayeesCategoriesTagsRules(isSpringBoot, dispatch, api);
    dispatch({
      type: ImportTransactionsActionType.IMPORT_TXS_FORM_VISIBLE,
      payload: !state.isImportTransactionsFormVisible,
    });
  };

  const handleOpenCloseOfImportSingleTransactionsForm = () => {
    fetchPayeesCategoriesTagsRules(isSpringBoot, dispatch, api);
    dispatch({
      type: ImportTransactionsActionType.IMPORT_SINGLE_TXS_FORM_VISIBLE,
      payload: !state.isImportTransactionsFormVisible,
    });
  };

  const handleManagePayeeCatDescTagForm = (managedProp: ManagedProperty) => {
    setManagedProp(managedProp);
    fetchPayeesCategoriesTagsRules(isSpringBoot, dispatch, api);
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
      case "5":
        handleManagePayeeCatDescTagForm(ManagedProperty.RULE);
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
      {state.isAddTransactionsFormModalVisible && <AddTransactionsForm />}
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
