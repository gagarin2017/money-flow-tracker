import { Avatar, Button, Card, Tooltip } from "antd";
import { useState } from "react";
import { bankLogoMap } from "../../UI/logo-map";
import BankAccount from "../../model/bank-account";
import EditBankAccountForm from "./form/edit-bank-account-form";
import { getAmountAsFormatedString } from "../../utils/currency-helper";
import { shortenGivenTextWithEllipsis } from "../../utils/display-text-helper";

const { Meta } = Card;

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

  const handleBankAccountEditClick = () => {
    setEditBankAccountFormVisible(true);
  };

  const handleFormClose = () => {
    setEditBankAccountFormVisible(false);
  };

  let account: any = bankLogoMap.get(bankAccount.bankLogo);

  if (account === undefined || account.name === undefined) {
    account = bankLogoMap.get("defaultLogo");
  }

  const { resultText, textIsTooLong } = shortenGivenTextWithEllipsis(
    bankAccount.accountName
  );

  const balanceTxt = (
    <p style={{ color: "green" }}>
      {getAmountAsFormatedString(bankAccount.balance)}
    </p>
  );

  return (
    <div>
      <Card
        style={{
          height: 73,
          width: 200,
          marginBottom: 5,
          backgroundColor: `${isSelected ? "lightBlue" : ""}`,
        }}
        data-testid="bank-account"
        loading={false}
        onClick={() => handleSelectBankAccount(bankAccount.id)}
        bodyStyle={{ padding: 5, paddingTop: 10 }}
      >
        <Meta
          avatar={
            <Tooltip title={account.name === "unknown" ? "" : account.name}>
              <Avatar shape="square" src={account.logo} />
            </Tooltip>
          }
          title={
            <>
              <Tooltip title={textIsTooLong && bankAccount.accountName}>
                {resultText}
              </Tooltip>
              <Button
                type="text"
                size="small"
                onClick={() => handleBankAccountEditClick()}
                style={{ float: "right", color: "grey" }}
              >
                {"\u22EE"}
              </Button>
            </>
          }
          description={balanceTxt}
        />
      </Card>
      {editBankAccountFormVisible && (
        <EditBankAccountForm
          bankAccount={bankAccount}
          isVisible={editBankAccountFormVisible}
          handleFormClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default BankAccountItem;
