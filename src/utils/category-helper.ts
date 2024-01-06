import { Category } from "../model/category";

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
