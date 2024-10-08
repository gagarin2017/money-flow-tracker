import { Column, Line } from "@ant-design/charts";
import { useEffect, useState } from "react";

function SpendingGraphStackGroupColumn() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData().then((data) => setChartData(data));
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost:8088/api/spending/graphs/stacked-group-column/data"
    );
    const data = await response.json();
    return data;
  };

  const config = {
    // data: {
    //   type: "fetch",
    //   value:
    //     "https://gw.alipayobjects.com/os/antfincdn/mor%26R5yBI9/stack-group-column.json",
    // },
    xField: "product_type",
    yField: "order_amt",
    seriesField: "sex",
    stack: {
      groupBy: ["x", "series"],
      series: false,
    },
    colorField: "product_sub_type",
    tooltip: (item: string) => {
      return { origin: item };
    },
    interaction: {
      tooltip: {
        render: (e: any, { title, items }: { title: string; items: any }) => {
          return (
            <div>
              <h4>{title}</h4>
              {items.map((item: any) => {
                const { name, color, origin } = item;
                return (
                  <div>
                    <div
                      style={{
                        margin: 0,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: color,
                            marginRight: 6,
                          }}
                        ></span>
                        <span>
                          {origin["product_sub_type"]}-{name}
                        </span>
                      </div>
                      <b>{origin["order_amt"]}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    },
  };
  return <Column {...config} data={chartData} />;
}

export default SpendingGraphStackGroupColumn;
