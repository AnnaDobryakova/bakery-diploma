import { Box } from "@mui/material";
import Header from "../components/Header";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import { exportToCsv } from "../utils/exportToCsv";
import { mockBarData } from "../../data/mockData";
import { mockPieData } from "../../data/mockData";
import { mockLineData } from "../../data/mockData";
import Button from "@mui/material/Button";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const handleExportBar = () => {
  exportToCsv("report_bar_sales.csv", mockBarData);
};

const handleExportPie = () => {
  exportToCsv("report_pie_sales.csv", mockPieData);
};

const handleExportLine = () => {
  exportToCsv("report_line_sales.csv", mockLineData);
};

const AdminReports = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="ОТЧЕТ ПО ВЫРУЧКЕ" subtitle="Структура выручки по категориям за 1–7 февраля 2026" />
      </Box>
      <Button 
        variant="contained" 
        color="secondary" 
        sx={{
          mb: 2,
          backgroundColor: "#21867a",     
          color: "#ffffff",               
          fontSize: "14px",               
          fontWeight: 500,                
          textTransform: "none",          
          px: 3,                          
          py: 1,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#2a9d8f",  
          },
          "& .MuiButton-startIcon": {
            color: "#ffffff",            
          },
        }}
        onClick={handleExportBar}
        startIcon={<DownloadOutlinedIcon />}
      >
        Экспорт Bar (CSV)
      </Button>

      <Box height="70vh" mt="20px">
        <BarChart isDashboard={false} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt="100px">
        <Header title="СТРУКТУРА ВЫРУЧКИ ПО КАТЕГОРИЯМ" subtitle="Структура выручки по категориям за 1–7 февраля 2026" />
      </Box>

      <Button
        variant="contained" 
        color="secondary" 
        sx={{
          mb: 2,
          backgroundColor: "#21867a",     
          color: "#ffffff",               
          fontSize: "14px",               
          fontWeight: 500,                
          textTransform: "none",          
          px: 3,                          
          py: 1,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#2a9d8f",  
          },
          "& .MuiButton-startIcon": {
            color: "#ffffff",            
          },
        }}

        onClick={handleExportPie}
        startIcon={<DownloadOutlinedIcon />}
      >
          Экспорт Pie (CSV)
      </Button>
      <Box height="70vh" mt="20px">
        <PieChart />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt="100px">
        <Header title="СТРУКТУРА ВЫРУЧКИ ПО КАТЕГОРИЯМ" subtitle="Структура выручки по категориям за 1–7 февраля 2026" />
      </Box>

      <Button
        variant="contained" 
        color="secondary" 
        sx={{
          mb: 2,
          backgroundColor: "#21867a",     
          color: "#ffffff",               
          fontSize: "14px",               
          fontWeight: 500,                
          textTransform: "none",          
          px: 3,                          
          py: 1,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#2a9d8f",  
          },
          "& .MuiButton-startIcon": {
            color: "#ffffff",            
          },
        }}

        onClick={handleExportPie}
        startIcon={<DownloadOutlinedIcon />}
      >
          Экспорт Line (CSV)
      </Button>
      <Box height="70vh" mt="20px">
        <LineChart />
      </Box>

    </Box>
  );
};

export default AdminReports;