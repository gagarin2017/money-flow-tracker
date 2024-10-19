import { Category } from "../model/category";
import cloneDeep from "lodash.clonedeep";

export const findCategoryById = (
  categories: Category[],
  id: number
): Category | undefined => {
  for (const category of categories) {
    if (category.id === id) {
      return category; // Found the category
    }

    if (category.subCategories && category.subCategories.length > 0) {
      const foundInSubcategories = findCategoryById(category.subCategories, id);
      if (foundInSubcategories) {
        return foundInSubcategories; // Found in a subcategory
      }
    }
  }

  return undefined; // Category with the specified id not found
};

/**
 * Method adds the specified category to the passed list.
 * NOTE: the passed list is not modified, the copy of the list with the category added is returned
 *
 * @param categories
 * @param newCategory
 * @returns the copy of the list with the category added to it
 */
export const addCategoryToList = (
  categories: Category[],
  newCategory: Category
): Category[] => {
  const updatedCategoryList: Category[] = cloneDeep(categories);
  if (newCategory) {
    if (newCategory.parentCategory) {
      const parentCategory = findCategoryById(
        updatedCategoryList,
        newCategory.parentCategory.id
      );
      if (parentCategory) {
        parentCategory.subCategories = [
          ...parentCategory.subCategories,
          newCategory,
        ];
      }
    } else {
      updatedCategoryList.push(newCategory);
    }
  }

  return updatedCategoryList;
};

/**
 * Method removes the specified category from the passed list.
 * NOTE: the passed list is not modified, the copy of the list with the category removed is returned
 *
 * @param categories
 * @param categoryId
 * @returns the copy of the list with the category removed from it
 */
export const deepDeleteCategoryFromList = (
  categories: Category[],
  categoryId: number
): Category[] => {
  let listCopy: Category[] = cloneDeep(categories);

  const category = findCategoryById(listCopy, categoryId);

  if (category) {
    if (category.parentCategory) {
      const parentCategory = findCategoryById(
        listCopy,
        category.parentCategory.id
      );

      if (parentCategory) {
        parentCategory.subCategories = parentCategory.subCategories.filter(
          (cat) => cat.id !== category.id
        );
      }
    } else {
      listCopy = listCopy.filter((cat) => cat.id !== category.id);
    }
  }

  return listCopy;
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
