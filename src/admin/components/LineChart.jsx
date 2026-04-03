import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Box, Typography, } from "@mui/material";

const LineChart = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveLine
      data={data}
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
        crosshair: {
          line: {
            stroke: '#fff',
            strokeWidth: 1,
            strokeOpacity: 0.5,
            strokeDasharray: '6 6',
          }
        },
        tooltip: {
          container: {
            color: "#000000",
          },
        },
        
      }}
      colors={{ datum: "color" }}
      margin={{ top: 50, right: 110, bottom: 70, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "День недели",
        legendOffset: 40,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Показатель",
        legendOffset: -50,
        legendPosition: "middle",
      }}
      enableGridX={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      tooltip={({ point }) => (
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
          <Typography sx={{ fontWeight: 700, fontSize: "13px", mb: "4px" }}>
            {point.serieId}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            День: {point.data.xFormatted}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            Значение: {point.data.yFormatted}
          </Typography>
        </Box>
      )}
      
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 10,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default LineChart;