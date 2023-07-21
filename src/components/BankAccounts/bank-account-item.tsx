import { useDispatch } from "react-redux";
import { BankAccount } from "../../model/bank-account";
import { Avatar, Card, Skeleton, Switch } from "antd";

const { Meta } = Card;

// import { getAmountString } from "../../Util/common";

export const DEFAULT_BALANCE_AMT = 100.01;

interface BankAccountItemProps {
  bankAccount: BankAccount;
}

const BankAccountItem = ({ bankAccount }: BankAccountItemProps) => {
  const dispatch = useDispatch();

  const bankAccountClickHandler = (id: number) => {
    // dispatch(bankAccountsActions.selectBankAccount(id));
  };

  return (
    <Card style={{ width: 300, marginTop: 16 }} loading={false}>
      <Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
        }
        title="Card title"
        description="This is the description"
      />
    </Card>
  );
};

export default BankAccountItem;
