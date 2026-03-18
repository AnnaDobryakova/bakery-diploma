import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../components/Header";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
import StatBox from "../components/StatBox";
import { getAllOrders } from "../../api/ordersApi";

const STATUS_LABELS = {
  new: "Новый",
  in_progress: "Готовится",
  ready: "Готов к выдаче",
  completed: "Выдан",
  cancelled: "Отменён",
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Ошибка загрузки заказов:", e);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const analytics = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];

    const totalRevenue = safeOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const totalOrders = safeOrders.length;

    const uniqueClients = new Set(
      safeOrders.map((order) => order.client?.email).filter(Boolean)
    ).size;

    const totalProductsSold = safeOrders.reduce((sum, order) => {
      const itemsCount = (order.items || []).reduce(
        (itemSum, item) => itemSum + Number(item.quantity || 0),
        0
      );
      return sum + itemsCount;
    }, 0);

    const todayString = new Date().toLocaleDateString("ru-RU");

    const todayOrders = safeOrders.filter((order) => {
      if (!order.createdAt) return false;
      return new Date(order.createdAt).toLocaleDateString("ru-RU") === todayString;
    });

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const todayNewClients = new Set(
      todayOrders.map((order) => order.client?.email).filter(Boolean)
    ).size;

    const ordersByDateMap = {};
    safeOrders.forEach((order) => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt).toLocaleDateString("ru-RU");
      ordersByDateMap[date] = (ordersByDateMap[date] || 0) + 1;
    });

    const lineChartData = [
      {
        id: "Заказы",
        color: "hsl(28, 90%, 55%)",
        data: Object.entries(ordersByDateMap)
          .map(([date, count]) => ({
            x: date,
            y: count,
          }))
          .sort((a, b) => {
            const [da, ma, ya] = a.x.split(".");
            const [db, mb, yb] = b.x.split(".");
            return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);
          }),
      },
    ];

    const statusStats = safeOrders.reduce((acc, order) => {
      const status = order.status || "new";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const pieChartData = Object.entries(statusStats).map(([status, value]) => ({
      id: STATUS_LABELS[status] || status,
      label: STATUS_LABELS[status] || status,
      value,
    }));

    const recentOrders = [...safeOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    return {
      totalRevenue,
      totalOrders,
      uniqueClients,
      totalProductsSold,
      todayOrdersCount: todayOrders.length,
      todayRevenue,
      todayNewClients,
      lineChartData,
      pieChartData,
      recentOrders,
    };
  }, [orders]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="ДАШБОРД"
          subtitle="Обзор ключевых показателей и активности пекарни"
        />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: 600,
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Скачать отчеты
          </Button>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={String(analytics.todayOrdersCount)}
            subtitle="Сегодняшние заказы"
            progress={
              analytics.totalOrders > 0
                ? String(analytics.todayOrdersCount / analytics.totalOrders)
                : "0"
            }
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            increase={`${analytics.totalOrders} всего`}
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${analytics.todayRevenue.toLocaleString("ru-RU")} ₽`}
            subtitle="Выручка за сегодня"
            progress={
              analytics.totalRevenue > 0
                ? String(analytics.todayRevenue / analytics.totalRevenue)
                : "0"
            }
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            increase={`${analytics.totalRevenue.toLocaleString("ru-RU")} ₽ всего`}
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={String(analytics.todayNewClients)}
            subtitle="Новые клиенты сегодня"
            progress={
              analytics.uniqueClients > 0
                ? String(analytics.todayNewClients / analytics.uniqueClients)
                : "0"
            }
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            increase={`${analytics.uniqueClients} уникальных`}
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={String(analytics.totalProductsSold)}
            subtitle="Продано товаров"
            progress="1"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            increase ="По всем заказам"
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ color: colors.grey[100] }}
              >
                Заказы по дням
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: colors.greenAccent[500] }}
              >
                {analytics.totalOrders}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>

          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} data={analytics.lineChartData} />
          </Box>
        </Box>

        {/* Последние заказы */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ color: colors.grey[100] }}
            >
              Заказы
            </Typography>
          </Box>

          {loading ? (
            <Typography sx={{ p: "15px", color: colors.grey[100] }}>
              Загрузка...
            </Typography>
          ) : analytics.recentOrders.length === 0 ? (
            <Typography sx={{ p: "15px", color: colors.grey[100] }}>
              Заказов пока нет
            </Typography>
          ) : (
            analytics.recentOrders.map((order, index) => (
              <Box
                key={`${order.id}-${index}`}
                borderBottom={`4px solid ${colors.primary[500]}`}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p="15px"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{ color: colors.greenAccent[500] }}
                  >
                    №{order.id}
                  </Typography>
                  <Typography sx={{ color: colors.grey[100] }}>
                    {order.client?.fullName || "Неизвестный клиент"}
                  </Typography>
                </Box>

                <Box color={colors.grey[100]}>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("ru-RU")
                    : "—"}
                </Box>

                <Box
                  backgroundColor={colors.greenAccent[500]}
                  color={colors.grey[900]}
                  p="5px 10px"
                  borderRadius="4px"
                  fontWeight="600"
                >
                  {Number(order.totalAmount || 0).toLocaleString("ru-RU")} ₽
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Распределение заказов по статусам
          </Typography>
          <Box height="250px" mt="10px">
            <PieChart isDashboard={true} data={analytics.pieChartData} />
          </Box>
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          overflow='auto'
        >
          <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
            Сводка
          </Typography>

          <Box display="flex" flexDirection="column" gap="20px">
            <Box>
              <Typography sx={{ color: colors.grey[300] }}>
                Общая выручка
              </Typography>
              <Typography
                variant="h4"
                fontWeight="700"
                sx={{ color: colors.greenAccent[500] }}
              >
                {analytics.totalRevenue.toLocaleString("ru-RU")} ₽
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ color: colors.grey[300] }}>
                Всего заказов
              </Typography>
              <Typography variant="h4" fontWeight="700">
                {analytics.totalOrders}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ color: colors.grey[300] }}>
                Уникальных клиентов
              </Typography>
              <Typography variant="h4" fontWeight="700">
                {analytics.uniqueClients}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ color: colors.grey[300] }}>
                Средний чек
              </Typography>
              <Typography variant="h4" fontWeight="700">
                {analytics.totalOrders > 0
                  ? Math.round(
                      analytics.totalRevenue / analytics.totalOrders
                    ).toLocaleString("ru-RU")
                  : 0}{" "}
                ₽
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;