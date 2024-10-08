import { Column, Line } from "@ant-design/charts";
import { useEffect, useState } from "react";

function SpendingGraphBar() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData().then((data) => setChartData(data));
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost:8088/api/spending/graphs/dodged-bar-chart/data"
    );
    const data = await response.json();
    return data;
  };

  const config = {
    xField: "state",
    yField: "population",
    colorField: "age",
    group: true,
    sort: {
      reverse: true,
      by: "y",
    },
    axis: {
      y: { labelFormatter: "~s" },
    },
    interaction: {
      tooltip: { shared: true },
      elementHighlight: { background: true },
    },
  };
  return <Column {...config} data={chartData} />;
}

export default SpendingGraphBar;
