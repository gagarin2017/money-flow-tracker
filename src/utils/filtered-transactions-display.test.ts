import { Category } from "../model/category";
import { getCategoryAsString } from "./category-helper";

describe("Filtered Transactions Category Display (getCategoryAsString)", () => {
  it("should return empty string when category is undefined", () => {
    expect(getCategoryAsString(undefined)).toBe("");
  });

  it("should return empty string when category is an empty object", () => {
    // This handles the bug where {} was passed from the backend/state
    expect(getCategoryAsString({} as Category)).toBe("");
  });

  it("should return empty string when category name is an empty string", () => {
    expect(getCategoryAsString({ name: "" } as Category)).toBe("");
  });

  it("should return just the category name for a top-level category", () => {
    const category: Category = {
      id: 1,
      name: "Food",
      subCategories: [],
    };
    expect(getCategoryAsString(category)).toBe("Food");
  });

  it("should return 'Parent : Child' for a sub-category", () => {
    const category: Category = {
      id: 2,
      name: "Groceries",
      parentCategory: {
        id: 1,
        name: "Food",
        subCategories: [],
      },
      subCategories: [],
    };
    expect(getCategoryAsString(category)).toBe("Food : Groceries");
  });

  it("should return 'Grandparent : Parent : Child' for a deeply nested category", () => {
    const category: Category = {
      id: 3,
      name: "Milk",
      parentCategory: {
        id: 2,
        name: "Groceries",
        parentCategory: {
          id: 1,
          name: "Food",
          subCategories: [],
        },
        subCategories: [],
      },
      subCategories: [],
    };
    expect(getCategoryAsString(category)).toBe("Food : Groceries : Milk");
  });

  it("should skip parents that have no name (edge case)", () => {
    const category: Category = {
      id: 3,
      name: "Milk",
      parentCategory: {
        id: 2,
        name: "", // Invalid name
        parentCategory: {
          id: 1,
          name: "Food",
          subCategories: [],
        },
        subCategories: [],
      } as Category,
      subCategories: [],
    };
    // Should skip the unnamed parent and just show Grandparent : Child
    expect(getCategoryAsString(category)).toBe("Food : Milk");
  });

  it("should return only child name if all parents have no name", () => {
    const category: Category = {
      id: 3,
      name: "Milk",
      parentCategory: {
        id: 2,
        name: "",
        parentCategory: {
          id: 1,
          name: "",
          subCategories: [],
        },
        subCategories: [],
      } as Category,
      subCategories: [],
    };
    expect(getCategoryAsString(category)).toBe("Milk");
  });
});
