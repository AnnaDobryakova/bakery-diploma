import { useEffect, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../components/Header";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import { exportToCsv } from "../utils/exportToCsv";

const RU_WEEK_DAYS = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const SHORT_WEEK_DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const CATEGORY_NAMES = {
  bakery: "Выпечка",
  bread: "Хлеб",
  pastry: "Пирожные",
  cookies: "Печенье",
  cake: "Торты",

  sweet: "Выпечка",
  salty: "Пирожные",
  drinks: "Печенье",
};

const CHART_KEYS = ["Выпечка", "Хлеб", "Пирожные", "Печенье", "Торты"];

const buttonStyles = {
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
};

const getCategoryLabel = (categoryValue) => {
  if (!categoryValue) return "Без категории";
  return CATEGORY_NAMES[categoryValue] || categoryValue;
};

const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const formatDateLabel = (date) => {
  return `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
};

const getWeekSubtitle = (dates) => {
  if (!dates.length) return "Нет данных за выбранный период";

  const sorted = [...dates].sort((a, b) => a - b);
  const start = sorted[0];
  const end = sorted[sorted.length - 1];

  const startDay = start.getDate();
  const endDay = end.getDate();
  const monthNames = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `Структура выручки по категориям за ${startDay}–${endDay} ${
      monthNames[start.getMonth()]
    } ${start.getFullYear()}`;
  }

  return `Структура выручки по категориям за ${formatDateLabel(start)}–${formatDateLabel(
    end
  )}`;
};

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        // Если у тебя другой маршрут, просто замени URL
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) {
          throw new Error("Не удалось получить заказы");
        }

        const data = await response.json();

        // На случай если API возвращает { orders: [...] }
        const ordersArray = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersArray);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить данные для отчетов");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const { barData, pieData, lineData, subtitle } = useMemo(() => {
    if (!orders.length) {
      return {
        barData: [],
        pieData: [],
        lineData: [],
        subtitle: "Нет данных за выбранный период",
      };
    }

    const dayMap = new Map();
    const revenueByCategory = {};
    const metricsByDay = new Map();
    const allDates = [];

    CHART_KEYS.forEach((key) => {
      revenueByCategory[key] = 0;
    });

    orders.forEach((order) => {
      const orderDateRaw =
        order.createdAt || order.date || order.orderDate || order.updatedAt;

      const date = normalizeDate(orderDateRaw);
      if (!date) return;

      allDates.push(date);

      const weekDayIndex = date.getDay();
      const weekDayName = RU_WEEK_DAYS[weekDayIndex];
      const shortDayName = SHORT_WEEK_DAYS[weekDayIndex];

      if (!dayMap.has(weekDayName)) {
        const initialDayData = { day: weekDayName };
        CHART_KEYS.forEach((key) => {
          initialDayData[key] = 0;
        });
        dayMap.set(weekDayName, initialDayData);
      }

      const dayEntry = dayMap.get(weekDayName);

      if (!metricsByDay.has(shortDayName)) {
        metricsByDay.set(shortDayName, {
          x: shortDayName,
          revenue: 0,
          orders: 0,
        });
      }

      const metricEntry = metricsByDay.get(shortDayName);
      metricEntry.orders += 1;

      const items = Array.isArray(order.items) ? order.items : [];

      let orderRevenue = 0;

      items.forEach((item) => {
        const quantity = Number(item.quantity || 1);
        const price = Number(
          item.price ?? item.product?.price ?? item.unitPrice ?? 0
        );
        const categoryRaw =
          item.category ||
          item.product?.category?.name ||
          item.product?.category ||
          item.product?.categorySlug;

        const categoryLabel = getCategoryLabel(categoryRaw);
        const revenue = price * quantity;

        orderRevenue += revenue;

        if (!dayEntry[categoryLabel] && dayEntry[categoryLabel] !== 0) {
          dayEntry[categoryLabel] = 0;
        }
        dayEntry[categoryLabel] += quantity;

        if (!revenueByCategory[categoryLabel] && revenueByCategory[categoryLabel] !== 0) {
          revenueByCategory[categoryLabel] = 0;
        }
        revenueByCategory[categoryLabel] += revenue;
      });

      // Если items пустой, пробуем брать сумму заказа
      if (!items.length) {
        orderRevenue = Number(order.total || order.totalPrice || order.amount || 0);
      }

      metricEntry.revenue += orderRevenue;
    });

    const orderedWeekDays = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ];

    const finalBarData = orderedWeekDays
      .filter((day) => dayMap.has(day))
      .map((day) => dayMap.get(day));

    const finalPieData = Object.entries(revenueByCategory)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        id: key,
        label: key,
        value,
      }));

    const shortOrderedDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const revenueSeries = [];
    const ordersSeries = [];
    const avgCheckSeries = [];

    shortOrderedDays.forEach((day) => {
      const entry = metricsByDay.get(day);
      if (!entry) return;

      const avgCheck = entry.orders ? Math.round(entry.revenue / entry.orders) : 0;

      revenueSeries.push({ x: day, y: entry.revenue });
      ordersSeries.push({ x: day, y: entry.orders });
      avgCheckSeries.push({ x: day, y: avgCheck });
    });

    const finalLineData = [
      {
        id: "Выручка",
        color: "hsl(50, 80%, 55%)",
        data: revenueSeries,
      },
      {
        id: "Заказы",
        color: "hsl(10, 80%, 55%)",
        data: ordersSeries,
      },
      {
        id: "Средний чек",
        color: "hsl(30, 30%, 75%)",
        data: avgCheckSeries,
      },
    ];

    return {
      barData: finalBarData,
      pieData: finalPieData,
      lineData: finalLineData,
      subtitle: getWeekSubtitle(allDates),
    };
  }, [orders]);

  const handleExportBar = () => {
    exportToCsv("report_bar_sales.csv", barData);
  };

  const handleExportPie = () => {
    exportToCsv("report_pie_sales.csv", pieData);
  };

  const handleExportLine = () => {
    const flatLineData = lineData.flatMap((series) =>
      series.data.map((point) => ({
        metric: series.id,
        date: point.x,
        value: point.y,
      }))
    );

    exportToCsv("report_line_sales.csv", flatLineData);
  };

  if (loading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="20px">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="ОТЧЕТ ПО ВЫРУЧКЕ" subtitle={subtitle} />
      </Box>

      <Button
        variant="contained"
        color="secondary"
        sx={buttonStyles}
        onClick={handleExportBar}
        startIcon={<DownloadOutlinedIcon />}
      >
        Экспорт Bar (CSV)
      </Button>

      <Box height="70vh" mt="20px">
        <BarChart isDashboard={false} data={barData} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt="100px">
        <Header title="СТРУКТУРА ВЫРУЧКИ ПО КАТЕГОРИЯМ" subtitle={subtitle} />
      </Box>

      <Button
        variant="contained"
        color="secondary"
        sx={buttonStyles}
        onClick={handleExportPie}
        startIcon={<DownloadOutlinedIcon />}
      >
        Экспорт Pie (CSV)
      </Button>

      <Box height="70vh" mt="20px">
        <PieChart data={pieData} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt="100px">
        <Header title="ДИНАМИКА ПОКАЗАТЕЛЕЙ" subtitle={subtitle} />
      </Box>

      <Button
        variant="contained"
        color="secondary"
        sx={buttonStyles}
        onClick={handleExportLine}
        startIcon={<DownloadOutlinedIcon />}
      >
        Экспорт Line (CSV)
      </Button>

      <Box height="70vh" mt="20px">
        <LineChart data={lineData} />
      </Box>
    </Box>
  );
};

export default AdminReports;