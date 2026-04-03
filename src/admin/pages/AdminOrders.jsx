import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../components/Header";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../api/ordersApi";
import { useAdminSearch } from "../../context/AdminSearchContext";

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
  const [selectedOrder, setSelectedOrder] = useState(null); 

  const { search } = useAdminSearch();  

  useEffect(() => {
  const loadOrders = async () => {
    try {
      const orders = await getAllOrders();

      const mappedOrders = orders.map((order) => {
      const items = order.items || [];

      const itemsText = items.length
        ? items
            .map(
              (item) =>
                `${item.product?.name || "Товар"} × ${item.quantity}`
            )
            .join(", ")
        : "—";

      const createdAtText = order.createdAt
        ? new Date(order.createdAt).toLocaleString("ru-RU")
        : "—";

      const pickupTimeText = order.pickupTime
        ? new Date(order.pickupTime).toLocaleString("ru-RU")
        : "Не указано";

      const statusText = STATUS_LABELS[order.status] || order.status || "—";

      return {
        id: order.id,
        customerName: order.client?.fullName || "Не указано",
        customerPhone: order.client?.phone || "Не указано",
        customerEmail: order.client?.email || "Не указано",
        total: Number(order.totalAmount || 0),
        subtotalAmount: Number(order.subtotalAmount || order.totalAmount || 0),
        discountAmount: Number(order.discountAmount || 0),
        promotionTitle: order.promotionTitle || null,
        promoCode: order.promoCode || null,
        giftLabel: order.giftLabel || null,
        status: order.status || "new",
        statusText,
        createdAt: order.createdAt,
        createdAtText,
        pickupTime: order.pickupTime,
        pickupTimeText,
        items,
        itemsText,
        raw: order,
      };
    });

      setRows(mappedOrders);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
      setRows([]);
    }
  };


  loadOrders();
}, []);

useEffect(() => {
  const markOrdersAsViewed = async () => {
    try {
      await axios.put("http://localhost:5000/api/orders/mark-viewed");
    } catch (error) {
      console.error("Ошибка при обновлении заказов:", error);
    }
  };

  markOrdersAsViewed();
}, []);


  const handleStatusChange = async (id) => {
  const row = rows.find((item) => String(item.id) === String(id));
  if (!row) return;

  const nextStatus = getNextStatus(row.status);

  try {
    const updatedOrder = await updateOrderStatus(id, nextStatus);

    setRows((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              status: updatedOrder.status,
              statusText: STATUS_LABELS[updatedOrder.status] || updatedOrder.status,
              raw: updatedOrder,
            }
          : item
      )
    );

      if (selectedOrder && String(selectedOrder.id) === String(id)) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: updatedOrder.status,
          statusText: STATUS_LABELS[updatedOrder.status] || updatedOrder.status,
          raw: updatedOrder,
        }));
      }
  } catch (error) {
    console.error("Ошибка обновления статуса:", error);
  }
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
        field: "createdAtText",
        headerName: "Создан",
        flex: 1.2,
      },
      {
        field: "pickupTimeText",
        headerName: "Самовывоз",
        flex: 1.2,
      },
      {
        field: "itemsText",
        headerName: "Состав",
        flex: 1.5,
        sortable: false,
      },
      {
        field: "statusText",
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
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(id);
              }}
            >
              <Typography sx={{ fontSize: "12px" }} color={colors.grey[100]}>
                {STATUS_LABELS[status] || status}
              </Typography>
            </Box>
          );
        },
      },
    ],
    [colors]
  );

  const filteredRows = rows.filter((row) => {
   const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      String(row.id || '').toLowerCase().includes(q) ||
      String(row.customerName || '').toLowerCase().includes(q) ||
      String(row.customerPhone || '').toLowerCase().includes(q) ||
      String(row.customerEmail || '').toLowerCase().includes(q) ||
      String(row.status || '').toLowerCase().includes(q)
    );   
  }
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
          rows={filteredRows}
          columns={columns}
          showToolbar
          onRowClick={(params) => setSelectedOrder(params.row)}
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
        <Dialog 
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          fullWidth
          maxWidth="md"
          
          
        >
          {selectedOrder && (
            <Box backgroundColor={colors.blueAccent[800]}>
              <DialogTitle sx={{
                fontSize: '40px'
              }}
              >
                Заказ №{selectedOrder.id}</DialogTitle>

              <DialogContent>
                <Box display="grid" gap="10px" mb={2}>
                  <Typography sx={{fontSize: '18px'}}>
                    <b>Клиент:</b> {selectedOrder.customerName}
                  </Typography>

                  <Typography sx={{fontSize: '18px'}}>
                    <b>Телефон:</b> {selectedOrder.customerPhone}
                  </Typography>

                  <Typography sx={{fontSize: '18px'}}>
                    <b>Email:</b> {selectedOrder.customerEmail}
                  </Typography>

                  <Typography sx={{fontSize: '18px'}}>
                    <b>Создан:</b>{" "}
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString("ru-RU")
                      : "—"}
                  </Typography>

                  <Typography sx={{fontSize: '18px'}}>
                    <b>Самовывоз:</b>{" "}
                    {selectedOrder.pickupTime
                      ? new Date(selectedOrder.pickupTime).toLocaleString("ru-RU")
                      : "Не указано"}
                  </Typography>

                  <Typography  sx={{fontSize: '18px'}}>
                    <b>Статус:</b> {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                  </Typography>

                  {selectedOrder.receipt && (
                    <>
                      <Divider sx={{ my: 2 }} />

                      <Typography variant="h4" mb={2}>
                        Данные чека
                      </Typography>

                      <Box display="grid" gap="10px" mb={2}>
                        <Typography sx={{ fontSize: "18px" }}>
                          <b>Номер чека:</b> {selectedOrder.receipt.receiptNumber}
                        </Typography>

                        <Typography sx={{ fontSize: "18px" }}>
                          <b>Дата и время выдачи:</b>{" "}
                          {selectedOrder.receipt.issuedAt
                            ? new Date(selectedOrder.receipt.issuedAt).toLocaleString("ru-RU")
                            : "—"}
                        </Typography>

                        <Typography sx={{ fontSize: "18px" }}>
                          <b>Сумма по чеку:</b> {Number(selectedOrder.receipt.totalAmount)} ₽
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h4" mb={2}>
                  Состав заказа
                </Typography>

                <Box display="grid" gap="12px">
                  {selectedOrder.items?.length ? (
                    selectedOrder.items.map((item) => (
                      <Box
                        key={item.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1.5}
                        border="1px solid rgba(0,0,0,0.1)"
                        borderRadius="8px"
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            {item.product?.name || "Товар"}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {item.product?.category?.name || "Без категории"}
                          </Typography>
                        </Box>

                        <Box textAlign="right">
                          <Typography>{item.quantity} шт.</Typography>

                          <Typography>
                            {Number(item.unitPrice || item.product?.price || 0)} ₽ / шт.
                          </Typography>

                          <Typography fontWeight={700}>
                            {Number(item.lineTotal || 0)} ₽
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography>Состав заказа отсутствует</Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="grid" gap="8px">
                  <Typography sx={{fontSize: '18px'}}>
                    <b>Сумма до скидки:</b> {selectedOrder.subtotalAmount} ₽
                  </Typography>

                  <Typography sx={{fontSize: '18px'}}>
                    <b>Скидка:</b> {selectedOrder.discountAmount} ₽
                  </Typography>

                  {selectedOrder.promotionTitle && (
                    <Typography sx={{fontSize: '18px'}}>
                      <b>Акция:</b> {selectedOrder.promotionTitle}
                    </Typography>
                  )}

                  {selectedOrder.promoCode && (
                    <Typography sx={{fontSize: '18px'}}>
                      <b>Промокод:</b> {selectedOrder.promoCode}
                    </Typography>
                  )}

                  {selectedOrder.giftLabel && (
                    <Typography sx={{fontSize: '18px'}}>
                      <b>Подарок:</b> {selectedOrder.giftLabel}
                    </Typography>
                  )}

                  <Typography variant="h3">
                    <b>Итого:</b> {selectedOrder.total} ₽
                  </Typography>
                </Box>
              </DialogContent>
            </Box>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminOrders;