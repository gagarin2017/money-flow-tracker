import { List } from "antd";
import CurrentMonthSpengingListItem from "./current-month-spenging-list-item";
import { SpendingItem } from "./model/spending-item";

interface CurrentMonthSpendingListProps {
  data: SpendingItem[];
  handleSpendingCategoryLinkClick: (categoryName: string) => void;
}

const CurrentMonthSpendingList = ({
  data,
  handleSpendingCategoryLinkClick,
}: CurrentMonthSpendingListProps) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      style={{
        border: "2px solid grey",
        borderRadius: 8,
        padding: "5px 18px 3px 3px",
        margin: "10px 3px 10px 3px",
        width: 370,
      }}
      renderItem={(item) => (
        <CurrentMonthSpengingListItem
          item={item}
          handleSpendingCategoryLinkClick={handleSpendingCategoryLinkClick}
        />
      )}
    />
  );
};

export default CurrentMonthSpendingList;
