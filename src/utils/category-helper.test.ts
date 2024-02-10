import { Category } from "../model/category";
import { addCategory } from "./category-helper";

const categoryList: Category[] = [
  {
    id: 1,
    name: "CAT 1",
    subCategories: [],
  },
  {
    id: 2,
    name: "CAT 2",
    subCategories: [],
  },
  {
    id: 3,
    name: "CAT 3",
    subCategories: [
      {
        id: 22,
        name: "Sub Category",
        subCategories: [],
      },
    ],
  },
];

const parentCategoryToBeInserted01: Category = {
  id: 4,
  name: "CAT 4",
  subCategories: [],
};

const categoryToBeInserted01: Category = {
  id: 111,
  name: "New Category 1",
  subCategories: [],
  parentCategory: categoryList[1],
};

const categoryToBeInserted02: Category = {
  id: 222,
  name: "New Category 2",
  subCategories: [],
  parentCategory: categoryList[2].subCategories[0],
};

it("tests that the category (first child) was added to the list", () => {
  // when
  addCategory(categoryList, categoryToBeInserted01);

  // then
  expect(categoryList.length).toBe(3);
  expect(categoryList[1].subCategories.length).toBe(1);

  const newSubCategory = categoryList[1].subCategories[0];
  expect(newSubCategory.id).toBe(111);
});

it("tests that the category (child of the child) was added to the list", () => {
  // when
  addCategory(categoryList, categoryToBeInserted02);

  // then
  expect(categoryList.length).toBe(3);
  expect(categoryList[2].subCategories.length).toBe(1);

  const newSubSubCategory = categoryList[2].subCategories[0].subCategories[0];
  expect(newSubSubCategory.id).toBe(222);
});

it("tests that the parent category can be added", () => {
  // when
  addCategory(categoryList, parentCategoryToBeInserted01);

  // then
  expect(categoryList.length).toBe(4);
});
