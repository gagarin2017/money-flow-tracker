import { Column } from "@ant-design/charts";
import { useEffect, useState } from "react";

function SpendingGraphStackedColumnChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData().then((data) => setChartData(data));
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost:8080/api/spending/graphs/stacked-column-chart/data"
    );
    const data = await response.json();
    return data;
  };

  const config = {
    xField: "categoryName",
    yField: "amount",
    colorField: "subCategoryName",
    stack: true,
    sort: {
      reverse: true,
      by: "y",
    },
    axis: {
      y: { labelFormatter: "~s" },
      x: {
        labelSpacing: 4,
        style: {
          labelTransform: "rotate(90)",
        },
      },
    },
  };

  // Need to support empty data list if nothing was fetched to populate the graph
  return <Column {...config} data={chartData} />;
}

export default SpendingGraphStackedColumnChart;
