import { ResponsivePie } from "@nivo/pie";
import { useState } from "react";
import { mockPieData as data } from "../data/mockData";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";


const PieChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [hoveredId, setHoveredId] = useState(null);

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      innerRadius={0.6}
      padAngle={1}
      cornerRadius={3}
      colors={({ id }) => {
        if (id === "Выпечка") return colors.greenAccent[700];
        if (id === "Пирожные") return colors.greenAccent[600];
        if (id === "Печенье") return colors.greenAccent[500];
        if (id === "Хлеб") return colors.greenAccent[400];
        if (id === "Торты") return colors.greenAccent[300];
        }}
      borderWidth={2}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      radialLabel={(d) => `${d.id}: ${d.value}`}
      sliceLabel={(d) => `${d.value}`}
      animate={true}
      motionConfig="slow"
      onMouseEnter={({ id }) => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsColor={colors.grey[200]}
      arcLabelsTextColor={colors.grey[900]}
      arcLinkLabelsTextOffset={6}
      arcLinkLabelsThickness={2}
      tooltip={({ datum }) => (
        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "1rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "0.25rem",
                borderRadius: "0.25rem",
                alignSelf: "stretch",
                backgroundColor: colors.greenAccent[400],
              }}
            ></div>
            <div style={{ flex: 1 }}>
              <strong
                style={{
                  display: "block",
                  fontWeight: 500,
                  fontSize: "1rem",
                  lineHeight: "1rem",
                  color: "#000000",
                }}
              >
                {datum.id}
              </strong>
              <span
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.875rem",
                  color: "#1e1c24",
                }}
              >
                Рубли: <span style={{ fontWeight: 600 }}>{datum.value}</span>
              </span>
            </div>
          </div>
        </div>
      )}
      theme={{
        legends: {
          text: {
            fontSize: 18,
            fill: "#000000",
          },
        },
        labels: {
            text: {
            fontSize: 18,
            fill: "#ffffff",
            },
        },
      }}
    />
  );
};

export default PieChart;