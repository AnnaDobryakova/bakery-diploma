import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {
  deleteProduct,
  getProducts,
  updateProductStock,
} from "../../api/productsApi";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdminSearch } from "../../context/AdminSearchContext";

const AdminProducts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { search } = useAdminSearch(); 

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setRows(data);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      alert("Не удалось загрузить товары");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenDeleteDialog = () => {
    if (selectedProductIds.length !== 1) return;
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedProductIds.length !== 1) return;

    const id = selectedProductIds[0];

    try {
      await deleteProduct(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setSelectedProductIds([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
      alert(error.message || "Не удалось удалить товар");
    }
  };

  const handleSelectionChange = (selectionModel) => {
    // Для совместимости с разными версиями MUI X
    if (Array.isArray(selectionModel)) {
      setSelectedProductIds(selectionModel);
      return;
    }

    if (selectionModel?.ids && selectionModel.ids instanceof Set) {
      setSelectedProductIds(Array.from(selectionModel.ids));
      return;
    }

    setSelectedProductIds([]);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "imageURL",
      headerName: "Фото",
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: ({ row: { imageURL } }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          {imageURL ? (
            <img
              src={imageURL}
              alt="product"
              width="50"
              height="50"
              style={{ objectFit: "cover", borderRadius: "6px" }}
            />
          ) : (
            <Typography fontSize="12px">Нет фото</Typography>
          )}
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Название продукта",
      flex: 1.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "category",
      headerName: "Категория",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Цена",
      flex: 0.8,
      renderCell: ({ value }) => `${value} ₽`,
    },
    {
      field: "available",
      headerName: "В наличии",
      flex: 1,
      sortable: false,
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

    try {
      const updated = await updateProductStock(
        newRow.id,
        Number(newRow.remainder)
      );

      setRows((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row))
      );

      return updated;
    } catch (error) {
      console.error("Ошибка обновления остатка:", error);
      alert(error.message || "Не удалось обновить остаток товара");
      return oldRow;
    }
  };

  const filteredRows = rows.filter((row) => {
   const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      String(row.id || '').toLowerCase().includes(q) ||
      String(row.name || '').toLowerCase().includes(q) ||
      String(row.category || '').toLowerCase().includes(q) ||
      String(row.price || '').toLowerCase().includes(q) ||
      String(row.stock || '').toLowerCase().includes(q)
    );   
  }
  );

  return (
    <Box m="20px">
      <Header title="ТОВАРЫ" subtitle="Управление товарами и их данными" />

      <Box display="flex" flexDirection="row" mb="20px" gap="10px">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/products/new")}
        >
          <AddIcon sx={{ mr: 1 }} />
          Добавить товар
        </Button>

        <Button
          variant="contained"
          color="warning"
          disabled={selectedProductIds.length !== 1}
          onClick={() =>
            navigate(`/admin/products/edit/${selectedProductIds[0]}`)
          }
        >
          <EditIcon sx={{ mr: 1 }} />
          Редактировать
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={selectedProductIds.length !== 1}
          onClick={handleOpenDeleteDialog}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Удалить
        </Button>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            "--DataGrid-t-header-background-base": colors.blueAccent[700],
            "--DataGrid-t-header-foreground-base": colors.grey[100],
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
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
          "& .MuiDataGrid-toolbarContainer": {
            padding: "10px",
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
          rows={filteredRows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) =>
            console.error("Ошибка обновления строки:", error)
          }
          onRowSelectionModelChange={handleSelectionChange}
          slots={{ toolbar: GridToolbar }}
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

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Удаление товара</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить выбранный товар?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;