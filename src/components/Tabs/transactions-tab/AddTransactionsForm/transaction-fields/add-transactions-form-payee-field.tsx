import { Select } from "antd";
import { useField } from "formik";
import Payee from "../../ImportTransactionsForm/model/payee";

interface AddTransactionsFormPayeeFieldProps {
  payeeFieldName: string;
  categoryFieldName: string;
  tagFieldName: string;
}

const DUMMY_PAYEES: Payee[] = [
  {
    id: 1,
    name: "ElectricIreland",
    category: {
      id: 2,
      name: "Some category",
      parentCategory: {
        id: 3,
        name: "Parent category",
        subCategories: [],
        _links: {
          self: {
            href: "http://localhost:8080/api/categories/3",
          },
          allCategories: {
            href: "http://localhost:8080/api/categories/",
          },
        },
      },
      subCategories: [],
      _links: {
        self: {
          href: "http://localhost:8080/api/categories/2",
        },
        allCategories: {
          href: "http://localhost:8080/api/categories/",
        },
      },
    },
    tag: {
      id: 2,
      name: "Some tag",
      _links: {
        self: {
          href: "http://localhost:8080/api/tags/2",
        },
        allTags: {
          href: "http://localhost:8080/api/tags/",
        },
      },
    },
  },
];

function AddTransactionsFormPayeeField({
  payeeFieldName,
  categoryFieldName,
  tagFieldName,
}: AddTransactionsFormPayeeFieldProps) {
  const [, , payeeHelper] = useField(payeeFieldName);
  const [, , categoryHelper] = useField(categoryFieldName);
  const [, , tagHelper] = useField(tagFieldName);

  const onChange = (value: string) => {
    payeeHelper.setValue(value);

    if (value) {
      categoryHelper.setValue(DUMMY_PAYEES[0].category);
      tagHelper.setValue(DUMMY_PAYEES[0].tag);
    } else {
      categoryHelper.setValue(undefined);
      tagHelper.setValue(undefined);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: number }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const getOptions = () => {
    return DUMMY_PAYEES.map((payee) => ({
      value: payee.id,
      label: payee.name,
    }));
  };

  return (
    <Select
      showSearch
      allowClear
      style={{ width: 170 }}
      placeholder="Category"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      options={getOptions()}
    />
  );
}

export default AddTransactionsFormPayeeField;
