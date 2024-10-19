import { Transaction } from "../../../model/transaction";
import { getMostParentCategoryName } from "../../../utils/transactions-helper";

export const groupTransactionsByParentCategory = (
  transactions: Transaction[]
): Map<string, Transaction[]> => {
  const spendingItemsMap: Map<string, Transaction[]> = new Map();

  transactions.forEach((transaction) => {
    const categoryName = getMostParentCategoryName(transaction);
    if (!spendingItemsMap.has(categoryName)) {
      spendingItemsMap.set(categoryName, [transaction]);
    } else {
      spendingItemsMap.get(categoryName)?.push(transaction);
    }
  });

  return spendingItemsMap;
};
