import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const PieChart = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={[
        "#d2b89b",
        "#d37a63",
        "#d8d16d",
        "#d2a94f",
        "#81b7ab",
      ]}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor="#1F2A40"
      theme={{
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: "#000000",
          },
        },
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateY: 56,
          itemsSpacing: 20,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: colors.grey[100],
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default PieChart;