import { Category } from "../model/category";

export const TransactionSorterByDate = (dateTimeA: Date, dateTimeB: Date) => {
  if (dateTimeA > dateTimeB) return -1;
  else if (dateTimeA < dateTimeB) return 1;
  else return 0;
};

export const getCategoryAsString = (category: Category): string => {
  const string = `${category.name}${
    category.parentCategory
      ? getParentCategoryAsString(category.parentCategory)
      : ""
  }`;

  const splitString = string.split(" : ");
  const reverseArray = splitString.reverse();

  return reverseArray.join(" : ");
};

function getParentCategoryAsString(parentCategory: Category): string {
  return ` : ${parentCategory.name}${
    parentCategory.parentCategory
      ? getParentCategoryAsString(parentCategory.parentCategory)
      : ""
  }`;
}
