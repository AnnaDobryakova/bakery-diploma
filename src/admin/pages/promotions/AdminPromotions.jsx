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
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { deletePromotion, getPromotions } from "../../../api/promotionsApi";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdminSearch } from "../../../context/AdminSearchContext";

const AdminPromotions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [selectedPromotionIds, setSelectedPromotionIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { search } = useAdminSearch();

  const loadPromotions = async () => {
    try {
      const data = await getPromotions();
      setRows(data);
    } catch (error) {
      console.error("Ошибка загрузки акций:", error);
      alert(error.message || "Не удалось загрузить акции");
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleOpenDeleteDialog = () => {
    if (selectedPromotionIds.length !== 1) return;
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedPromotionIds.length !== 1) return;

    const id = selectedPromotionIds[0];

    try {
      await deletePromotion(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setSelectedPromotionIds([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Ошибка удаления акции:", error);
      alert(error.message || "Не удалось удалить акцию");
    }
  };

  const handleSelectionChange = (selectionModel) => {
    if (Array.isArray(selectionModel)) {
      setSelectedPromotionIds(selectionModel);
      return;
    }

    if (selectionModel?.ids && selectionModel.ids instanceof Set) {
      setSelectedPromotionIds(Array.from(selectionModel.ids));
      return;
    }

    setSelectedPromotionIds([]);
  };

  const getStatusBg = (status) => {
    if (status === "Активен") return colors.greenAccent[700];
    if (status === "Неактивен") return colors.redAccent[700];
    return colors.blueAccent[500];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "title",
      headerName: "Название акции",
      flex: 1.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Тип акции",
      flex: 1,
    },
    {
      field: "value",
      headerName: "Значение",
      flex: 1,
    },
    {
      field: "period",
      headerName: "Период",
      flex: 1.5,
      renderCell: ({ row }) =>
        `${formatDate(row.startDate)} — ${formatDate(row.endDate)}`,
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
          width="70%"
          m="10px auto"
          p="5px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={getStatusBg(row.status)}
          borderRadius="4px"
        >
          <Typography color={colors.grey[100]}>{row.status}</Typography>
        </Box>
      ),
    },
    {
      field: "restrictions",
      headerName: "Ограничения",
      flex: 1.8,
      renderCell: ({ value }) => value || "—",
    },
  ];

  const filteredRows = rows.filter((row) => {
   const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      String(row.id || '').toLowerCase().includes(q) ||
      String(row.title || '').toLowerCase().includes(q) ||
      String(row.type || '').toLowerCase().includes(q) ||
      String(row.status || '').toLowerCase().includes(q) ||
      String(row.promoCode || '').toLowerCase().includes(q)
    );   
  }
  );

  return (
    <Box m="20px">
      <Header
        title="АКЦИИ"
        subtitle="Управление скидками и специальными предложениями"
      />

      <Box display="flex" flexDirection="row" mb="20px" gap="10px">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/promotions/new")}
        >
          <AddIcon sx={{ mr: 1 }} />
          Добавить акцию
        </Button>

        <Button
          variant="contained"
          color="warning"
          disabled={selectedPromotionIds.length !== 1}
          onClick={() =>
            navigate(`/admin/promotions/edit/${selectedPromotionIds[0]}`)
          }
        >
          <EditIcon sx={{ mr: 1 }} />
          Редактировать
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={selectedPromotionIds.length !== 1}
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
                fileName: "Акции_пекарни",
                delimiter: ";",
                utf8WithBom: true,
              },
            },
          }}
        />
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Удаление акции</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить выбранную акцию?
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

export default AdminPromotions;