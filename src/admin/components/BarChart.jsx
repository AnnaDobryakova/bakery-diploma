import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const BarChart = ({ data = [], isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={data}
      keys={["Соленая выпечка", "Сладкая выпечка", "Хлеб", "Напитки"]}
      indexBy="day"
      margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={[
        "#d2b89b",
        "#d37a63",
        "#d8d16d",
        "#d2a94f",
        "#81b7ab",
      ]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "День недели",
        legendPosition: "middle",
        legendOffset: 45,
        tickColor: colors.grey[100],
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Количество продаж",
        legendPosition: "middle",
        legendOffset: -50,
        tickColor: colors.grey[100],
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 4,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
        },
      ]}
      role="application"
      ariaLabel="bar-chart"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} в ${e.indexValue}`}
    />
  );
};

export default BarChart;