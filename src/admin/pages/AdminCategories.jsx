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
  deleteCategory,
  getCategories,
} from "../../api/categoriesApi";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdminSearch } from "../../context/AdminSearchContext";

const AdminCategories = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { search } = useAdminSearch();

  const loadCategories = async () => {
  try {
    const data = await getCategories();

    const normalizedRows = data.map((item) => ({
      id: item.id,
      name: item.name ?? item.label ?? "—",
      code: item.code ?? item.value ?? "—",
      description: item.description ?? "",
      productsCount: item.productsCount ?? 0,
    }));

    setRows(normalizedRows);
  } catch (error) {
    console.error("Ошибка загрузки категорий:", error);
    alert(error.message || "Не удалось загрузить категории");
  }
};

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenDeleteDialog = () => {
    if (selectedCategoryIds.length !== 1) return;
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedCategoryIds.length !== 1) return;

    const id = selectedCategoryIds[0];

    try {
      await deleteCategory(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setSelectedCategoryIds([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Ошибка удаления категории:", error);
      alert(error.message || "Не удалось удалить категорию");
    }
  };

  const handleSelectionChange = (selectionModel) => {
    if (Array.isArray(selectionModel)) {
      setSelectedCategoryIds(selectionModel);
      return;
    }

    if (selectionModel?.ids && selectionModel.ids instanceof Set) {
      setSelectedCategoryIds(Array.from(selectionModel.ids));
      return;
    }

    setSelectedCategoryIds([]);
  };

  const getStatusBg = (productsCount) => {
    return productsCount > 0
      ? colors.greenAccent[700]
      : colors.redAccent[700];
  };

  
  const columns = [
  { field: "id", headerName: "ID", flex: 0.5 },
  {
    field: "name",
    headerName: "Название категории",
    flex: 1,
    cellClassName: "name-column--cell",
    renderCell: ({ value }) => value || "—",
  },
  {
    field: "code",
    headerName: "Код категории",
    flex: 1,
    renderCell: ({ value }) => value || "—",
  },
  {
    field: "description",
    headerName: "Описание",
    flex: 1.3,
    renderCell: ({ value }) => value || "—",
  },
  {
    field: "productsCount",
    headerName: "Количество товаров",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "status",
    headerName: "Статус",
    flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: ({ row }) => (
      <Box
        width="60%"
        m="10px auto"
        p="5px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor={getStatusBg(row.productsCount)}
        borderRadius="4px"
      >
        <Typography color={colors.grey[100]}>
          {row.productsCount > 0 ? "Активна" : "Пустая"}
        </Typography>
      </Box>
    ),
  },
];

  const filteredRows = rows.filter((row) => {
   const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      String(row.id || '').toLowerCase().includes(q) ||
      String(row.name || '').toLowerCase().includes(q) ||
      String(row.code || '').toLowerCase().includes(q) ||
      String(row.description || '').toLowerCase().includes(q)
    );   
  }
  );

  return (
    <Box m="20px">
      <Header
        title="КАТЕГОРИИ"
        subtitle="Управление категориями и их данными"
      />

      <Box display="flex" flexDirection="row" mb="20px" gap="10px">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/categories/new")}
        >
          <AddIcon sx={{ mr: 1 }} />
          Добавить категорию
        </Button>

        <Button
          variant="contained"
          color="warning"
          disabled={selectedCategoryIds.length !== 1}
          onClick={() =>
            navigate(`/admin/categories/edit/${selectedCategoryIds[0]}`)
          }
        >
          <EditIcon sx={{ mr: 1 }} />
          Редактировать
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={selectedCategoryIds.length !== 1}
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
          onRowSelectionModelChange={handleSelectionChange}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: "Категории_пекарни",
                delimiter: ";",
                utf8WithBom: true,
              },
            },
          }}
        />
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Удаление категории</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить выбранную категорию?
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

export default AdminCategories;