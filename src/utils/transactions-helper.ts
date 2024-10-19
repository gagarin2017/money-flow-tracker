import { Transaction } from "../model/transaction";

export const TransactionSorterByDate = (dateTimeA: Date, dateTimeB: Date) => {
  if (dateTimeA > dateTimeB) return -1;
  else if (dateTimeA < dateTimeB) return 1;
  else return 0;
};

export const getMostParentCategoryName = (transaction: Transaction): string => {
  let category = transaction.category;

  while (category.parentCategory) {
    category = category.parentCategory;
  }

  return category.name;
};
