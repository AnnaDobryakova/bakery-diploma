import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../components/Header";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import StatBox from "../components/StatBox";
import ProgressCircle from "../components/ProgressCircle";
import { recentOrders } from "../../data/mockData";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="ДАШБОРД" subtitle="Обзор ключевых показателей и активности пекарни" />
      

      <Box>
        <Button 
        sx={{ 
          backgroundColor: colors.blueAccent[700], 
          color: colors.grey[100], 
          fontSize: "14px", 
          fontWeight: 600, 
          padding: "10px 20px"
        }}
        >
          <DownloadOutlinedIcon sx={{mr: "10px"}} />
          Скачать отчеты
        </Button>
      </Box>
      </Box>
        
        {/*GRID & CHARTS*/}
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">

          {/*ROW 1*/}
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
            title="58"
            subtitle="Сегодняшние заказы"
            progress="0.75"
            icon={<EmailIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
            increase="+14%"
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
            title="34 250 ₽"
            subtitle="Выручка за сегодня"
            progress="0.5"
            icon={<PointOfSaleIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
            increase="+21%"
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
            title="12"
            subtitle="Новые клиенты"
            progress="0.30"
            icon={<PersonAddIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
            increase="+5%"
            />
          </Box> 
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
            title="214"
            subtitle="Продано товаров"
            progress="0.80"
            icon={<TrafficIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
            increase="+43%"
            />
          </Box> 

          {/*ROW 2*/}   
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          >
            <Box mt="25px" p="0 30px" display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ color: colors.grey[100] }}>
                  Продажи по дням недели
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: colors.greenAccent[500] }}>
                  1,324,417
                </Typography>
              </Box>
              <Box>
                <IconButton>
                  <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
                </IconButton>
              </Box>
            </Box>
            <Box height="250px" mt="-20px">
              <LineChart isDashboard={true} />
            </Box>
            </Box>
             {/*Transactions*/}
            <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
              <Box borderBottom={`4px solid ${colors.primary[500]}`} colors={colors.grey[100]} p="15px" display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h5" fontWeight="600" sx={{ color: colors.grey[100] }}>
                  Заказы
                </Typography>
              </Box>
              {recentOrders.map((recentOrder, index) => (
                <Box key={`${recentOrder.id}-${index}`} borderBottom={`4px solid ${colors.primary[500]}`} display="flex" alignItems="center" justifyContent="space-between" p="15px">
                  <Box>
                     <Typography variant="h5" fontWeight="600" sx={{ color: colors.greenAccent[500] }}>
                      {recentOrder.id} 
                    </Typography>
                     <Typography sx={{ color: colors.grey[100]}}>
                      {recentOrder.client} 
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{recentOrder.date}</Box>
                  <Box borderColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                    { recentOrder.total}
                  </Box>
                </Box>
              ))}
            </Box>

              {/*ROW 3*/}
            <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
              <Typography variant="h5" fontWeight="600">
                Продажи по категориям
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <ProgressCircle size="125"/>
                <Typography variant="h5" fontWeight="600" color={colors.greenAccent[500]} sx={{ mt: "15px"}} >
                  Выручка составила 46 789 ₽
                </Typography>
                <Typography>
                  Включает дополнительные расходы и издержки
                </Typography>
              </Box>
            </Box>
            
            <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]}>
              <Typography variant="h5" fontWeight="600" sx={{p: "30px 30px 0 30px"}}>
                Количество продаж
              </Typography>
              <Box height="250px" mt="-20px">
                <BarChart isDashboard={true}/>
              </Box>
            </Box>
          </Box>      
    </Box>
  );
};

export default Dashboard;