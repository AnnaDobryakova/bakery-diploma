import {
  Box,
  Button,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAdminSearch } from "../../../context/AdminSearchContext";

const AdminEmployees = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { search } = useAdminSearch();

    useEffect(() => {
        axios.get("http://localhost:5000/api/employees")
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleEdit = () => {
        if (selectedEmployeeIds.length !== 1) return;
        navigate(`/admin/employees/edit/${selectedEmployeeIds[0]}`);
    };

    const handleOpenDeleteDialog = () => {
        if (selectedEmployeeIds.length !== 1) return;
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const handleDelete = async () => {
        if (selectedEmployeeIds.length !== 1) return;

        const employeeId = selectedEmployeeIds[0];

        try {
            await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
            setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId));
            setSelectedEmployeeIds([]);
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Ошибка при удалении сотрудника:", error);
            alert("Не удалось удалить сотрудника");
        }
    };

    const mappedEmployees = useMemo(() => {
        return employees.map((employee) => ({
            id: employee.id,
            firstName: employee.firstName || "—",
            lastName: employee.lastName || "—",
            age: employee.age ?? "—",
            phone: employee.phone || "—",
            email: employee.email || "—",
            position: employee.position || "—",
            positionText: employee.position || "—",
            status: employee.status || "—",
            statusText: employee.status || "—",
        }));
    }, [employees]);

    const columns = useMemo(
  () => [
    { field: "id", headerName: "ID", flex: 0.6 },
    {
      field: "firstName",
      headerName: "Имя",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Фамилия",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Возраст",
      type: "number",
      flex: 0.8,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Телефон",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
    },
    {
      field: "positionText",
      headerName: "Должность",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        const position = row.position;

        return (
          <Box
            width="80%"
            m="10px auto"
            p="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={colors.greenAccent[700]}
            borderRadius="4px"
          >
            {position === "Администратор" && <AdminPanelSettingsOutlinedIcon />}
            {position === "Менеджер" && <SecurityOutlinedIcon />}
            {(position === "Пекарь" || position === "Кассир") && (
              <LockOpenOutlinedIcon />
            )}
            <Typography
              color={colors.grey[100]}
              sx={{ ml: "5px", fontSize: "12px" }}
            >
              {position}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "statusText",
      headerName: "Статус",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        const status = row.status;

        return (
          <Box
            width="60%"
            m="10px auto"
            p="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={
              status === "Активен"
                ? colors.greenAccent[700]
                : colors.redAccent[700]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
  ],
  [colors]
);

    const filteredEmployees = mappedEmployees.filter((employee) => {
  const q = search.toLowerCase().trim();
  if (!q) return true;

  return (
    String(employee.firstName || "").toLowerCase().includes(q) ||
    String(employee.lastName || "").toLowerCase().includes(q) ||
    String(employee.phone || "").toLowerCase().includes(q) ||
    String(employee.email || "").toLowerCase().includes(q) ||
    String(employee.positionText || "").toLowerCase().includes(q) ||
    String(employee.statusText || "").toLowerCase().includes(q)
  );
});

    return (
        <Box m="20px">
            <Header title="СОТРУДНИКИ" subtitle="Управление сотрудниками и их данными" />
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
                    <Box
                        display="flex"
                        flexDirection="row"
                        marginBottom="20px"
                        gap="10px"
                    >
                        <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => navigate("/admin/employees/new")}>
                            <AddIcon sx={{ mr: 1 }} />
                            Добавить сотрудника
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            disabled={selectedEmployeeIds.length !== 1}
                            onClick={handleEdit}
                        >
                            <EditIcon sx={{ mr: 1 }} />
                            Редактировать
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            disabled={selectedEmployeeIds.length !== 1}
                            onClick={handleOpenDeleteDialog}
                        >
                            <DeleteIcon sx={{ mr: 1 }} />
                            Удалить
                        </Button>
                    </Box>

                    <DataGrid
                        checkboxSelection
                        showToolbar
                        rows={filteredEmployees}
                        columns={columns}
                        onRowSelectionModelChange={(newSelection) => {
                            const idsArray =
                            Array.isArray(newSelection)
                                ? newSelection
                                : Array.from(newSelection.ids || []);

                            setSelectedEmployeeIds(idsArray);
                        }}
                        slotProps={{
                            toolbar: {
                            csvOptions: {
                                fileName: "Сотрудники_пекарни",
                                delimiter: ";",
                                utf8WithBom: true,
                            },
                            },
                        }}
                        />
                    <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Удаление сотрудника</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Вы действительно хотите удалить выбранного сотрудника?
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
        </Box>
    );
};

export default AdminEmployees;