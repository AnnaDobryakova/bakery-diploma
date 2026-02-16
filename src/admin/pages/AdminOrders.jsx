import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../theme";
import { mockDataOrders } from "../data/mockData";
import Header from "../components/Header";

const STATUS_ORDER = ["Новый", "Готовится", "Готово", "Отменён"];

const getNextStatus = (current) => {
  const idx = STATUS_ORDER.indexOf(current);
  const safeIdx = idx === -1 ? 0 : idx;
  return STATUS_ORDER[(safeIdx + 1) % STATUS_ORDER.length];
};

const AdminOrders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState(mockDataOrders);

  const getStatusBg = (status) => {
    if (status === "Новый") return colors.grey[600];
    if (status === "Готовится") return colors.blueAccent[700];
    if (status === "Готово") return colors.greenAccent[700];
    return colors.redAccent[700]; 
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "customer",
      headerName: "Клиент",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "date", headerName: "Дата заказа", flex: 1 },
    { field: "total", headerName: "Сумма заказа", flex: 1 },
    {
      field: "status",
      headerName: "Статус",
      flex: 1,
      renderCell: ({ row }) => {
        const { id, status } = row;

        return (
          <Box
            width="60%"
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
            onClick={() => {
              setRows((prev) =>
                prev.map((r) =>
                  r.id === id ? { ...r, status: getNextStatus(r.status) } : r
                )
              );
            }}
          >
            <Typography color={colors.grey[100]}>{status}</Typography>
          </Box>
        );
      },
    },
  ];

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
