import { Calendar, ConfigProvider } from "antd";

import { theme } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import gaIE from "antd/es/locale/en_GB";
import "dayjs/locale/en-gb";
import moment from "moment";

function CurrentMonthPeriod() {
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    fontSize: token.fontSizeSM,
  };

  const dateCellRender = (value: Dayjs) => {
    const today = dayjs();
    const isPast = value.isBefore(today, "day");
    const lastDayOfMonth = today.endOf("month");

    const isFuture =
      value.isAfter(today, "day") && value.isBefore(lastDayOfMonth);

    let className = value.date() === today.date() ? "today" : "";

    if (isPast) {
      className = "past-date";
    } else if (isFuture) {
      className = "future-date";
    }

    return <div className={className}>{value.date()}</div>;
  };

  return (
    <div style={wrapperStyle}>
      <ConfigProvider locale={gaIE}>
        <Calendar
          fullscreen={false}
          mode={"month"}
          headerRender={({ value }) => {
            const today = dayjs();
            const month = moment().month(value.month());
            const daysTillTheEnd = value.daysInMonth() - today.date();
            console.log("value: ", value);
            return (
              <>{`${month.format(
                "MMMM"
              )} - ${daysTillTheEnd} full days till End`}</>
            );
          }}
          fullCellRender={dateCellRender}
        />
      </ConfigProvider>
    </div>
  );
}

export default CurrentMonthPeriod;
