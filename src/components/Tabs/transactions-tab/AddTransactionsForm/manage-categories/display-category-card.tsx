import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Space,
  Tree,
  TreeDataNode,
} from "antd";
import { Category } from "../../../../../model/category";

interface DisplayCategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isEditable: boolean;
  onSelect?: (keys: any, info: any) => void;
}

const DisplayCategoryCard = ({
  category,
  onEdit,
  onDelete,
  isEditable,
  onSelect,
}: DisplayCategoryCardProps) => {
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

  const data: TreeDataNode[] = createTree(category);

  return (
    <Card size="small" hoverable style={{ backgroundColor: "lightskyblue" }}>
      <Row gutter={[2, 4]}>
        <Col span={12}>
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={data}
            onSelect={onSelect}
            selectable={isEditable}
            defaultExpandAll={isEditable} // not working as it seems <Tree /> needs to be re-rendered
          />
        </Col>
        <Col span={12}>
          <Space direction="horizontal">
            {!isEditable && (
              <Button
                onClick={() => onEdit(category)}
                type="link"
                style={{
                  float: "right",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                Edit
              </Button>
            )}
            <Popconfirm
              title="Delete this transaction?"
              onConfirm={() => onDelete(category)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                style={{
                  float: "right",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DisplayCategoryCard;
