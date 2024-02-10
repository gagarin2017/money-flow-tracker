import { List, notification } from "antd";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../../context/import-transactions-context";
import { Category } from "../../../../../model/category";
import { deleteCategoryAPI } from "../../../../services/categories-api";
import DisplayCategoryCard from "./display-category-card";

interface CategoriesListProps {
  handleCategoryEdit: (category: Category) => void;
  selectedCategory?: Category;
  handleCategorySelect?: (keys: any, info: any) => void;
}

function CategoriesList({
  handleCategoryEdit,
  selectedCategory,
  handleCategorySelect,
}: CategoriesListProps) {
  const { state, dispatch } = useImportTransactionsContext();

  const [api, contextHolder] = notification.useNotification();

  const { categories } = state;

  const getCategoriesToDisplay = () => {
    let result: Category[] = [];

    if (selectedCategory) {
      result.push(selectedCategory);
    } else {
      result = [...categories]
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .filter((cat) => cat.name);
    }

    return result;
  };

  const handleCategoryDelete = async (category: Category) => {
    const response = await deleteCategoryAPI(category.id);

    if (!response.ok) {
      console.error("Error on deleting category:");
      console.log(
        `${response.status} ${response.statusText}: ${await response.text()}`
      );
      api.error({
        message: `Error occurred while deleting the category: ${category.name}`,
        description: `Unable to delete. Perhaps, its still used in transactions?`,
        duration: 0,
      });
    } else {
      dispatch({
        type: ImportTransactionsActionType.DELETE_CATEGORY,
        payload: category.id,
      });
    }
  };

  return (
    <List
      style={{
        maxHeight: 500,
        overflow: "scroll", // have to scroll, else the Card floats outside of the Modal if too many sub categories
        padding: 10,
      }}
      grid={{ gutter: 10, column: 3 }}
      dataSource={getCategoriesToDisplay()}
      renderItem={(category) => (
        <List.Item>
          <DisplayCategoryCard
            isEditable={selectedCategory ? true : false}
            category={category}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            onSelect={handleCategorySelect}
          />
          {contextHolder}
        </List.Item>
      )}
    />
  );
}

export default CategoriesList;
