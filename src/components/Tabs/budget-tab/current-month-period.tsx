import { Calendar, ConfigProvider } from "antd";
import "./current-month-period-styles.css";

import { theme } from "antd";
import gaIE from "antd/es/locale/en_GB";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import moment from "moment";

function CurrentMonthPeriod() {
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    fontSize: token.fontSizeSM,
  };

  const calendarStyle: React.CSSProperties = {
    padding: "10px",
  };

  const dateCellRender = (value: Dayjs) => {
    const today = dayjs();
    const yesterday = dayjs().add(-1);
    const isPast = value.isBefore(yesterday, "day");
    const lastDayOfMonth = today.endOf("month");

    const isFuture = value.isAfter(lastDayOfMonth, "day");

    let className =
      value.date() === today.date()
        ? "ant-picker-cell-inner ant-picker-calendar-date ant-picker-calendar-date-today"
        : "";

    if (isPast) {
      className = "past-date";
    } else if (isFuture) {
      className = "future-date";
    } else if (value.date() !== today.date()) {
      className = "current-month";
    }

    // return <div className={className}>{value.date()}</div>;
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
            const year = moment().year(value.year());
            const daysTillTheEnd = value.daysInMonth() - today.date();
            return (
              <div className="header-style">
                {`${month.format("MMMM")} ${year.format("YYYY")}- `}
                <span className="days-till-end-style">
                  {daysTillTheEnd}
                </span>{" "}
                full days till End
              </div>
            );
          }}
          fullCellRender={dateCellRender}
          style={calendarStyle}
          disabledDate={(current) => true}
        />
      </ConfigProvider>
    </div>
  );
}

export default CurrentMonthPeriod;
