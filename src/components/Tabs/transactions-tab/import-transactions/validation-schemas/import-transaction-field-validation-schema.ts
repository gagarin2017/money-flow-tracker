import * as Yup from "yup";

const NAME_VALIDATION = Yup.string()
  .max(50, "Too Long!")
  .test("checking prop's name", "Required", (propsName, ctx) => {
    const payeeName = ctx.parent.payeeName;

    let result = true;

    if (payeeName) {
      // if there's a payee name selected then ignore this validation as the user is on Add new payee widget
      result = true;
    } else if (!propsName) {
      // the user is on Add New Category/Description/Tag widget, hence name is required
      result = false;
    }

    return result;
  });

export const NEW_PROP_VALID_SCHEMA = Yup.object().shape({
  payeeName: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .test("checking payee's name", "Required", (payeeName, ctx) => {
      const theName = ctx.parent.name;

      let result = true;

      if (theName) {
        // if there's a name input then ignore this validation as the user is on Add New Category/Description/Tag widget
        result = true;
      } else if (!payeeName) {
        // the user is on Add New Payee widget, hence fail this validation as payee name is required
        result = false;
      }

      return result;
    }),
  name: NAME_VALIDATION,
  isSubcategory: Yup.boolean().test(
    "check if isSubcategory needs to be selected",
    '"is Subcategory Of" is Required',
    (isSubcategoryValue, ctx) => {
      const theName = ctx.parent.name;
      const category = ctx.parent.category;

      let result = true;

      if (theName && JSON.stringify(category) !== "{}" && !isSubcategoryValue) {
        result = false;
      }

      return result;
    }
  ),
  category: Yup.object()
    .shape({
      name: Yup.string(),
    })
    .test("isSubcategory", "Category is required", (value, ctx) => {
      const isSubcategorySelected = ctx.parent.isSubcategory;
      const payeeName = ctx.parent.payeeName;

      let result = true;

      if (payeeName && JSON.stringify(value) === "{}") {
        result = false;
      } else if (
        isSubcategorySelected &&
        (!value || JSON.stringify(value) === "{}")
      ) {
        result = false;
      }
      return result;
    }),
});
