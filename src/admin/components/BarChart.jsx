import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Box, Typography, } from "@mui/material";

const BAR_KEYS = ["Сладкая выпечка", "Хлеб", "Соленая выпечка", "Напитки"];

const BarChart = ({ data = [], isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={data}
      keys={BAR_KEYS}
      indexBy="day"
      margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#d37a63", "#d8d16d", "#d2b89b", "#d2a94f"]}
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
        legend: isDashboard ? undefined : "Количество проданных товаров",
        legendPosition: "middle",
        legendOffset: -50,
        tickColor: colors.grey[100],
      }}
      enableLabel={false}
      tooltip={({ id, value, indexValue, color }) => (
        <Box
          sx={{
            background: "#f7f4ee",
            color: "#1f2a40",
            padding: "10px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Box display="flex" alignItems="center" gap="8px" mb="4px">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "2px",
                backgroundColor: color,
              }}
            />
            <Typography sx={{ fontWeight: 700, fontSize: "13px" }}>
              {id}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: "12px" }}>
            День: {indexValue}
          </Typography>

          <Typography sx={{ fontSize: "12px" }}>
            Продано: {value}
          </Typography>
        </Box>
      )}
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
        grid: {
          line: {
            stroke: "rgba(255,255,255,0.12)",
            strokeWidth: 1,
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
          itemWidth: 120,
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