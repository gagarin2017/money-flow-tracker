import { Category } from "../model/category";
import {
  addCategoryToList,
  deepDeleteCategoryFromList,
} from "./category-helper";

const categoryList: Category[] = [
  {
    id: 1,
    name: "CAT 1",
    subCategories: [
      {
        id: 11,
        name: "CAT 1-1 Sub Category",
        subCategories: [
          {
            id: 111,
            name: "CAT 1-1-1 Sub Category",
            subCategories: [
              {
                id: 1111,
                name: "CAT 1-1-1-1 Sub Category",
                subCategories: [],
                parentCategory: {
                  id: 111,
                  name: "CAT 1-1-1 Sub Category",
                  subCategories: [],
                },
              },
              {
                id: 1112,
                name: "CAT 1-1-1-2 Sub Category",
                subCategories: [],
                parentCategory: {
                  id: 111,
                  name: "CAT 1-1-1 Sub Category",
                  subCategories: [],
                },
              },
            ],
            parentCategory: {
              id: 11,
              name: "CAT 1-1 Sub Category",
              subCategories: [],
            },
          },
        ],
        parentCategory: { id: 1, name: "CAT 1", subCategories: [] },
      },
      {
        id: 12,
        name: "CAT 1-2 Sub Category",
        subCategories: [],
        parentCategory: { id: 1, name: "CAT 1", subCategories: [] },
      },
    ],
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
        id: 33,
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

const subCategoryToBeInserted: Category = {
  id: 111,
  name: "New Category 1",
  subCategories: [],
  parentCategory: categoryList[1],
};

const subSubcategoryToBeInserted: Category = {
  id: 222,
  name: "New Category 2",
  subCategories: [],
  parentCategory: categoryList[2].subCategories[0],
};

describe("add category to the list tests", () => {
  it("tests that the category (first child) was added to the list", () => {
    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[1].subCategories.length).toBe(0);

    // when
    const result = addCategoryToList(categoryList, subCategoryToBeInserted);

    // then
    expect(result.length).toBe(3);
    expect(result[1].subCategories.length).toBe(1);

    const newSubCategory = result[1].subCategories[0];
    expect(newSubCategory.id).toBe(111);

    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[1].subCategories.length).toBe(0);
  });

  it("tests that the category (child of the child) was added to the list", () => {
    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[2].subCategories[0].subCategories.length).toBe(0);

    // when
    const result = addCategoryToList(categoryList, subSubcategoryToBeInserted);

    // then
    expect(result.length).toBe(3);
    expect(result[2].subCategories.length).toBe(1);
    expect(result[2].subCategories[0].subCategories.length).toBe(1);

    const newSubSubCategory = result[2].subCategories[0].subCategories[0];
    expect(newSubSubCategory.id).toBe(222);

    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[2].subCategories[0].subCategories.length).toBe(0);
  });

  it("tests that the parent category can be added", () => {
    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);

    // when
    const result = addCategoryToList(
      categoryList,
      parentCategoryToBeInserted01
    );

    // then
    expect(result.length).toBe(4);

    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
  });
});

describe("remove category from the list tests", () => {
  it("tests that the parent category can be deleted", () => {
    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);

    // when
    const result = deepDeleteCategoryFromList(categoryList, categoryList[1].id);

    // then
    expect(result.length).toBe(2);

    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
  });

  it("tests that the sub category 1-1 can be deleted", () => {
    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[0].subCategories.length).toBe(2);

    // when
    const result = deepDeleteCategoryFromList(
      categoryList,
      categoryList[0].subCategories[1].id
    );

    // then
    expect(result.length).toBe(3);
    expect(result[0].subCategories.length).toBe(1);

    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[0].subCategories.length).toBe(2);
  });

  it("tests that the grand grand child sub category 1-1-1-1 can be deleted", () => {
    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[0].subCategories.length).toBe(2);
    expect(categoryList[0].subCategories[0].subCategories.length).toBe(1);
    expect(
      categoryList[0].subCategories[0].subCategories[0].subCategories.length
    ).toBe(2); // delete one of these

    // when
    const result = deepDeleteCategoryFromList(
      categoryList,
      categoryList[0].subCategories[0].subCategories[0].subCategories[0].id
    );

    // then
    expect(result.length).toBe(3);
    expect(result[0].subCategories.length).toBe(2);
    expect(result[0].subCategories[0].subCategories.length).toBe(1);
    expect(
      result[0].subCategories[0].subCategories[0].subCategories.length
    ).toBe(1);

    // make sure the passed array doesnt change
    expect(categoryList.length).toBe(3);
    expect(categoryList[0].subCategories.length).toBe(2);
    expect(categoryList[0].subCategories[0].subCategories.length).toBe(1);
    expect(
      categoryList[0].subCategories[0].subCategories[0].subCategories.length
    ).toBe(2);
  });
});
