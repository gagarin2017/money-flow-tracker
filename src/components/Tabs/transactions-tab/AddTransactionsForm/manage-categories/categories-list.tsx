import { Button, Card, Col, List, Row, Space, Tree, TreeDataNode } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../../context/import-transactions-context";
import { Category } from "../../../../../model/category";
import { useState } from "react";

function CategoriesList() {
  const { state, dispatch } = useImportTransactionsContext();

  const [editEnabled, setEditEnabled] = useState<boolean>(false);

  const { categories } = state;
  const createCategoryTree = (categories: Category[]): TreeDataNode[] => {
    return categories.map((parentCat) => ({
      title: parentCat.name,
      key: parentCat.id,
      children: createCategoryTree(parentCat.subCategories),
    }));
  };

  const createTree = (category: Category): TreeDataNode[] => {
    return [
      {
        title: category.name,
        key: category.id,
        children: createCategoryTree(category.subCategories),
      },
    ];
  };

  const sortedCategoriesByName = [...categories]
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .filter((cat) => cat.name);

  const handleCategoryEdit = (id: number) => {
    // setEditEnabled(true);
    /*
     ** Open EditCategory modal where Tree is checkable={true} then whatever is checked should be populated into add-new-category-card.tsx
     */
    // dispatch({
    //   type: ImportTransactionsActionType.DELETE_CATEGORY,
    //   payload: id,
    // });
  };

  const handleCategoryDelete = (id: number) => {
    dispatch({
      type: ImportTransactionsActionType.DELETE_CATEGORY,
      payload: id,
    });
  };

  return (
    <List
      style={{ maxHeight: 500, overflow: "scroll", padding: 10 }}
      grid={{ gutter: 10, column: 3 }}
      dataSource={sortedCategoriesByName}
      renderItem={(cat) => (
        <List.Item>
          <Card
            size="small"
            hoverable
            style={{ backgroundColor: "lightskyblue" }}
          >
            <Row gutter={[2, 4]}>
              <Col span={12}>
                <Tree
                  showLine
                  switcherIcon={<DownOutlined />}
                  // defaultExpandedKeys={["1"]}
                  treeData={createTree(cat)}
                  selectable={false}
                  // checkable={editEnabled}
                  // defaultExpandAll={true}
                />
              </Col>
              <Col span={12}>
                <Space direction="horizontal">
                  <Button
                    onClick={() => handleCategoryEdit(cat.id)}
                    type="link"
                    style={{
                      float: "right",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleCategoryDelete(cat.id)}
                    type="link"
                    style={{
                      float: "right",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  );
}

export default CategoriesList;
