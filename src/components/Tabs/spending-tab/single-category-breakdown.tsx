import { List } from "antd";
import { Transaction } from "../../../model/transaction";
import CurrentMonthSpengingListItem from "./current-month-spenging-list-item";
import { SpendingItem } from "./model/spending-item";

interface SingleCategoryBreakdownProps {
  selectedCategoryName: string;
  spendingItemsMap: Map<string, Transaction[]>;
}

function SingleCategoryBreakdown({
  selectedCategoryName,
  spendingItemsMap,
}: SingleCategoryBreakdownProps) {
  const buildSpendingItemsFromMap = (
    spendingItemsMap: Map<string, Transaction[]>,
    categoryName: string
  ): SpendingItem[] => {
    let result: SpendingItem[] = [];

    const categoryTransactions = spendingItemsMap.get(categoryName);

    if (categoryTransactions) {
      result = categoryTransactions
        .map(
          (transaction) =>
            ({
              name: transaction.category.name,
              amount: transaction.debitAmount,
            } as SpendingItem)
        )
        .sort((a, b) => b.amount - a.amount);
    }

    return result;
  };

  return (
    <>
      <h4>List of sub categories for {selectedCategoryName}</h4>
      <List
        itemLayout="horizontal"
        dataSource={buildSpendingItemsFromMap(
          spendingItemsMap,
          selectedCategoryName
        )}
        style={{
          border: "2px solid grey",
          borderRadius: 8,
          padding: "5px 18px 3px 3px",
          margin: "10px 3px 10px 3px",
          width: 370,
        }}
        renderItem={(item) => <CurrentMonthSpengingListItem item={item} />}
      />
    </>
  );
}

export default SingleCategoryBreakdown;
