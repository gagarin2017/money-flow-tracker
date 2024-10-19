import { Button, List } from "antd";
import { getAmountAsFormatedString } from "../../../utils/currency-helper";
import { SpendingItem } from "./model/spending-item";

interface CurrentMonthSpengingListItemProps {
  item: SpendingItem;
  handleSpendingCategoryLinkClick?: (categoryName: string) => void;
}

const CurrentMonthSpengingListItem = ({
  item,
  handleSpendingCategoryLinkClick,
}: CurrentMonthSpengingListItemProps) => {
  let listItemCategory = null;

  if (handleSpendingCategoryLinkClick) {
    listItemCategory = (
      <Button
        type="link"
        style={{ fontSize: 15 }}
        onClick={() => handleSpendingCategoryLinkClick(item.name)}
      >
        {item.name}
      </Button>
    );
  } else {
    listItemCategory = item.name;
  }

  return (
    <List.Item style={{ height: "30px" }}>
      <List.Item.Meta
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {listItemCategory}
            <span style={{ paddingTop: 7 }}>
              {getAmountAsFormatedString(item.amount)}
            </span>
          </div>
        }
      />
    </List.Item>
  );
};

export default CurrentMonthSpengingListItem;
