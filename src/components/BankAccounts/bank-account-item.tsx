import BankAccount from "../../model/bank-account";
import type { MenuProps } from "antd";
import { Avatar, Card, Skeleton, Switch, Button, Dropdown } from "antd";

const { Meta } = Card;

// import { getAmountString } from "../../Util/common";

export const DEFAULT_BALANCE_AMT = 100.01;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item
      </a>
    ),
  },
];

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
  // Format the number as a currency
  const formattedCurrency = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(bankAccount.balance);

  const balanceTxt = <p style={{ color: "green" }}>{formattedCurrency}</p>;

  return (
    <Card
      style={{
        height: 90,
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
          <Avatar
            shape="square"
            // src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
            src={bankAccount.logo}
          />
        }
        title={
          <div>
            {bankAccount.accountName}
            <Dropdown
              menu={{ items }}
              placement="topLeft"
              arrow={{ pointAtCenter: true }}
            >
              <Button style={{ float: "right" }} size="small" type="text">
                {"\u22EE"}
              </Button>
            </Dropdown>
          </div>
        }
        description={balanceTxt}
      />
    </Card>
  );
};

export default BankAccountItem;
