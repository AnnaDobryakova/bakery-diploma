import { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../theme";
import Header from "../components/Header";
import {
  getOrdersFromStorage,
  updateOrderStatusInStorage,
} from "../../utils/storage";

const STATUS_ORDER = ["new", "in_progress", "ready", "completed", "cancelled"];

const STATUS_LABELS = {
  new: "Новый",
  in_progress: "Готовится",
  ready: "Готов к выдаче",
  completed: "Выдан",
  cancelled: "Отменён",
};

const getNextStatus = (current) => {
  const idx = STATUS_ORDER.indexOf(current);
  const safeIdx = idx === -1 ? 0 : idx;
  return STATUS_ORDER[(safeIdx + 1) % STATUS_ORDER.length];
};

const AdminOrders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const orders = getOrdersFromStorage().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const mappedOrders = orders.map((order) => ({
      id: order.id,
      customerName: order.customerName || order.userName || "Не указано",
      customerPhone: order.customerPhone || "Не указано",
      customerEmail: order.userEmail || "Не указано",
      total: order.total || 0,
      status: order.status || "new",
      createdAt: order.createdAt,
      pickupTime: order.pickupTime,
      items: order.items || [],
    }));

    setRows(mappedOrders);
  }, []);

  const handleStatusChange = (id) => {
    setRows((prev) =>
      prev.map((row) => {
        if (String(row.id) !== String(id)) return row;

        const nextStatus = getNextStatus(row.status);
        updateOrderStatusInStorage(id, nextStatus);

        return {
          ...row,
          status: nextStatus,
        };
      })
    );
  };

  const getStatusBg = (status) => {
    if (status === "new") return colors.grey[600];
    if (status === "in_progress") return colors.blueAccent[700];
    if (status === "ready") return colors.greenAccent[700];
    if (status === "completed") return colors.greenAccent[600];
    if (status === "cancelled") return colors.redAccent[700];
    return colors.grey[700];
  };

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "№ заказа",
        flex: 0.8,
      },
      {
        field: "customerName",
        headerName: "Клиент",
        flex: 1.2,
        cellClassName: "name-column--cell",
      },
      {
        field: "customerPhone",
        headerName: "Телефон",
        flex: 1,
      },
      {
        field: "customerEmail",
        headerName: "Email",
        flex: 1.2,
      },
      {
        field: "total",
        headerName: "Сумма",
        flex: 0.8,
        renderCell: ({ value }) => `${value} ₽`,
      },
      {
        field: "createdAt",
        headerName: "Создан",
        flex: 1.2,
        renderCell: ({ value }) =>
          value ? new Date(value).toLocaleString("ru-RU") : "—",
      },
      {
        field: "pickupTime",
        headerName: "Самовывоз",
        flex: 1.2,
        renderCell: ({ value }) =>
          value ? new Date(value).toLocaleString("ru-RU") : "Не указано",
      },
      {
        field: "items",
        headerName: "Состав",
        flex: 1.5,
        sortable: false,
        renderCell: ({ value }) => {
          if (!value?.length) return "—";
          return value.map((item) => `${item.name} × ${item.quantity}`).join(", ");
        },
      },
      {
        field: "status",
        headerName: "Статус",
        flex: 1,
        renderCell: ({ row }) => {
          const { id, status } = row;

          return (
            <Box
              width="80%"
              m="10px auto"
              p="5px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundColor={getStatusBg(status)}
              borderRadius="4px"
              sx={{
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { opacity: 0.9 },
              }}
              title="Нажмите, чтобы изменить статус"
              onClick={() => handleStatusChange(id)}
            >
              <Typography color={colors.grey[100]}>
                {STATUS_LABELS[status] || status}
              </Typography>
            </Box>
          );
        },
      },
    ],
    [colors]
  );

  return (
    <Box m="20px">
      <Header title="ЗАКАЗЫ" subtitle="Управление заказами клиентов" />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            "--DataGrid-t-header-background-base": colors.blueAccent[700],
            "--DataGrid-t-header-foreground-base": colors.grey[100],
          },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaderRow": {
            backgroundColor: `${colors.blueAccent[700]} !important`,
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-mainContent": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-toolbar": {
            justifyContent: "start",
            gap: "10px",
          },
        }}
      >
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          showToolbar
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: "Заказы_пекарни",
                delimiter: ";",
                utf8WithBom: true,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AdminOrders;