import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getProducts,
  updateProductStock,
} from "../../api/productsApi";

const AdminProducts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setRows(data);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "imageURL",
      headerName: "Фото",
      flex: 0.6,
      renderCell: ({ row: { imageURL } }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <img
            src={imageURL}
            alt="product"
            width="50"
            height="50"
            style={{ objectFit: "cover" }}
          />
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Название продукта",
      flex: 1.2,
      cellClassName: "name-column--cell",
    },
    { field: "category", headerName: "Категория", flex: 1 },
    { field: "price", headerName: "Цена", flex: 0.8 },
    {
      field: "available",
      headerName: "В наличии",
      flex: 1,
      renderCell: ({ row: { remainder } }) => {
        const inStock = Number(remainder) > 0;
        const bg = inStock ? colors.greenAccent[700] : colors.redAccent[700];

        return (
          <Box
            width="60%"
            m="10px auto"
            p="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={bg}
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]}>
              {inStock ? "Да" : "Нет"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "remainder",
      headerName: "Остаток",
      flex: 1,
      editable: true,
      type: "number",
    },
    {
      field: "updateDate",
      headerName: "Дата обновления",
      flex: 1.2,
      renderCell: ({ row: { updateDate } }) =>
        updateDate ? new Date(updateDate).toLocaleString("ru-RU") : "—",
    },
  ];

  const processRowUpdate = async (newRow, oldRow) => {
    if (Number(newRow.remainder) === Number(oldRow.remainder)) {
      return oldRow;
    }

    const updated = await updateProductStock(newRow.id, Number(newRow.remainder));

    setRows((prev) =>
      prev.map((row) => (row.id === updated.id ? updated : row))
    );

    return updated;
  };

  return (
    <Box m="20px">
      <Header title="ТОВАРЫ" subtitle="Управление товарами и их данными" />

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
          "& .MuiDataGrid-mainContent": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-toolbar": {
            justifyContent: "start",
            gap: "10px",
          },
          "& .MuiDataGrid-cell--textLeft": {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          showToolbar
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) =>
            console.error("Ошибка обновления строки:", error)
          }
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: "Товары_пекарни",
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

export default AdminProducts;