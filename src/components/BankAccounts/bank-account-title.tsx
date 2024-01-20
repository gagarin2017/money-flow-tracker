import { Avatar, Space } from "antd";
import BankAccount from "../../model/bank-account";
import { bankLogoMap } from "../../UI/logo-map";

interface BankAccountTitleProps {
  bankAccount: BankAccount | undefined;
  numberOfTransactions?: number;
}

function BankAccountTitle({
  bankAccount,
  numberOfTransactions,
}: BankAccountTitleProps) {
  let account: any = bankAccount
    ? bankLogoMap.get(bankAccount.bankLogo)
    : undefined;

  const result = {
    logo: account && (
      <Avatar shape="square" src={account.logo} size={"small"} />
    ),
    bankName:
      bankAccount?.bankName && bankAccount?.bankName !== "unknown"
        ? `${bankAccount?.bankName} /`
        : "",
    accountName: bankAccount?.accountName
      ? `${bankAccount?.accountName} account`
      : "",
    numberOfTransactions: numberOfTransactions
      ? `/ ${numberOfTransactions} transaction(-s)`
      : "",
  };

  return (
    <div style={{ fontWeight: "bold" }}>
      <Space>
        {result.logo}
        {`${result.bankName} ${result.accountName} ${result.numberOfTransactions}`}
      </Space>
    </div>
  );
}

export default BankAccountTitle;
