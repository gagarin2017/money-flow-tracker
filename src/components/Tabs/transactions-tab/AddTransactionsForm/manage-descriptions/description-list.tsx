import { Badge, Button, Card, Col, List, Row } from "antd";
import {
  ImportTransactionsActionType,
  useImportTransactionsContext,
} from "../../../../../context/import-transactions-context";
import { Description } from "../../../../../model/description";
import { Tag } from "../../../../../model/tag";

interface DescriptionListProps {
  isTag?: boolean;
}
/**
 * The list of Descriptions and Tags, since they have the same object structure: {id: number, name: string}
 */
function DescriptionList({ isTag }: DescriptionListProps) {
  const { state, dispatch } = useImportTransactionsContext();

  const { descriptions } = state;
  const { tags } = state;

  const sortedListByName = (list: Description[] | Tag[]) => {
    return descriptions && descriptions.length > 0
      ? [...list]
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .filter((desc) => desc.name)
      : [];
  };

  const handleItemDelete = (id: number) => {
    if (isTag) {
      dispatch({
        type: ImportTransactionsActionType.DELETE_TAG,
        payload: id,
      });
    } else {
      dispatch({
        type: ImportTransactionsActionType.DELETE_DESCRIPTION,
        payload: id,
      });
    }
  };

  const data = isTag ? sortedListByName(tags) : sortedListByName(descriptions);

  return (
    <Badge.Ribbon text={`${data.length}`} placement="start">
      <List
        style={{ maxHeight: 500, overflow: "scroll", padding: 10 }}
        grid={{ gutter: 10, column: 5 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              size="small"
              hoverable
              style={{ backgroundColor: "lightblue" }}
            >
              <Row gutter={[2, 4]}>
                <Col span={12}>
                  <div style={{ marginTop: 4 }}>{item.name}</div>
                </Col>
                <Col span={12}>
                  <Button
                    onClick={() => handleItemDelete(item.id)}
                    type="link"
                    style={{
                      float: "right",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </Badge.Ribbon>
  );
}

export default DescriptionList;
