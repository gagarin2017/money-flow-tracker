import { Alert, Button, List, Space, notification } from "antd";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../../context/import-transactions-context";
import { Category } from "../../../../../model/category";
import { deleteCategoryAPI } from "../../../../services/categories-api";
import DisplayCategoryCard from "./display-category-card";

interface CategoriesListProps {
  categories: Category[];
  handleCategoryEdit: (category: Category) => void;
  selectedCategory?: Category;
  handleCategorySelect?: (keys: any, info: any) => void;
  handleShowAllCategoriesClick: () => void;
}

function CategoriesList({
  categories,
  handleCategoryEdit,
  selectedCategory,
  handleCategorySelect,
  handleShowAllCategoriesClick,
}: CategoriesListProps) {
  const { dispatch } = useImportTransactionsContext();

  const [api, contextHolder] = notification.useNotification();

  const allCategoriesBtn = (
    <Button onClick={handleShowAllCategoriesClick}>All Categories</Button>
  );

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
      handleShowAllCategoriesClick();
    }
  };

  const messageText01 =
    "The category cannot be deleted until its child (sub) categories are not deleted first.";

  const messageText02 =
    "You won't be able to delete the category if its being used in any Transactions. You will need to change the transactions that are using them first.";

  const alerts = (
    <Space direction="vertical" style={{ width: "95%" }}>
      <Alert message={messageText01} type="info" />
      <Alert message={messageText02} type="info" />
    </Space>
  );

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {selectedCategory && allCategoriesBtn}
      {selectedCategory && alerts}
      <List
        style={{
          maxHeight: 500,
          overflow: "scroll", // have to scroll, else the Card floats outside of the Modal if too many sub categories
          padding: 10,
        }}
        grid={{ gutter: 10, column: 3 }}
        dataSource={categories}
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
    </Space>
  );
}

export default CategoriesList;
