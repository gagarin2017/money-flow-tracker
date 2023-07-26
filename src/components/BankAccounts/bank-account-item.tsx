import BankAccount from "../../model/bank-account";
import { Avatar, Card, Tooltip, Typography } from "antd";
import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import EditBankAccountForm from "./form/edit-bank-account-form";
import { bankLogoMap } from "../../UI/logo-map";

const { Meta } = Card;

const MAX_ACC_LENGTH = 15;
export const DEFAULT_BALANCE_AMT = 100.01;

interface BankAccountItemProps {
  bankAccount: BankAccount;
  isSelected: boolean;
  handleSelectBankAccount: (id: number) => void;
}

const BankAccountItem = ({
  bankAccount,
  isSelected,
  handleSelectBankAccount,
}: BankAccountItemProps) => {
  const [editBankAccountFormVisible, setEditBankAccountFormVisible] =
    useState(false);

  // Format the number as a currency
  const formattedCurrency = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(bankAccount.balance);

  const balanceTxt = <p style={{ color: "green" }}>{formattedCurrency}</p>;

  const handleBankAccountEditClick = () => {
    setEditBankAccountFormVisible(true);
  };

  const handleFormClose = () => {
    setEditBankAccountFormVisible(false);
  };

  const bankLogo: any = bankLogoMap.get(bankAccount.bankLogo);

  const accName = bankAccount.accountName;

  let accountNameIsLong = accName.length > MAX_ACC_LENGTH;
  const accountNameToShow = accountNameIsLong
    ? accName.substring(0, MAX_ACC_LENGTH - 3) + "..."
    : accName;

  return (
    <div>
      <Card
        style={{
          height: 73,
          width: 200,
          marginBottom: 5,
          backgroundColor: `${isSelected ? "lightBlue" : ""}`,
        }}
        loading={false}
        onClick={() => handleSelectBankAccount(bankAccount.id)}
        bodyStyle={{ padding: 5, paddingTop: 10 }}
      >
        <Meta
          avatar={
            <Tooltip title={bankLogo.desc}>
              <Avatar shape="square" src={bankLogo.img} />
            </Tooltip>
          }
          title={
            <div>
              <Tooltip title={accountNameIsLong && bankAccount.accountName}>
                {accountNameToShow}
              </Tooltip>
              <AiOutlineSetting
                onClick={() => handleBankAccountEditClick()}
                style={{ float: "right", color: "lightGrey" }}
              />
            </div>
          }
          description={balanceTxt}
        />
      </Card>
      <EditBankAccountForm
        bankAccount={bankAccount}
        isVisible={editBankAccountFormVisible}
        handleFormClose={handleFormClose}
      />
    </div>
  );
};

export default BankAccountItem;
