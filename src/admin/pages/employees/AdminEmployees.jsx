import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AddIcon from '@mui/icons-material/Add';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminEmployees = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/employees")
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    }, []);

    const columns = [
        { field: "id", headerName: "ID"},
        { field: "firstName", headerName: "Имя", flex: 1, cellClassName: "name-column--cell" },
        { field: "lastName", headerName: "Фамилия", flex: 1, cellClassName: "name-column--cell" },
        { field: "age", headerName: "Возраст", type: "number", headerAlign: "left", align: "left" },
        { field: "phone", headerName: "Телефон", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { 
            field: "position", 
            headerName: "Должность", 
            flex: 1,
            align: "center", 
            headerAlign: "center",
            renderCell: ({ row: { position } }) => {
                return (
                    <Box width="80%" m="10px auto" p="5px" display="flex" alignItems="center" justifyContent="center" 
                    backgroundColor={
                        position === "Администратор"
                        ? colors.greenAccent[700]
                        : colors.greenAccent[700]
                    }
                    borderRadius="4px"
                    >
                        {position === "Администратор" && <AdminPanelSettingsOutlinedIcon/>}
                        {position === "Менеджер" && <SecurityOutlinedIcon />}
                        {position === "Пекарь" && <LockOpenOutlinedIcon />}
                        {position === "Кассир" && <LockOpenOutlinedIcon />}
                        <Typography color={colors.grey[100]} sx={{ ml: "5px", fontSize: "12px" }}>
                            {position}
                        </Typography>
                    </Box>
                );
             
            },
        },
        { field: "status", 
            headerName: "Статус", 
            flex: 1,
            align: "center", 
            headerAlign: "center",
            renderCell: ({ row: { status } }) => {
                return (
                    <Box width="60%" m="10px auto" p="5px" display="flex" alignItems="center" justifyContent="center" 
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
    ];

    return (
        <Box m="20px">
            <Header title="СОТРУДНИКИ" subtitle="Управление сотрудниками и их данными" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none", 
                        "--DataGrid-t-header-background-base": colors.blueAccent[700], 
                        "--DataGrid-t-header-foreground-base": colors.grey[100], 
                    },
                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                    "& .name-column--cell": { color: colors.greenAccent[300] },

                    "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
                    "& .MuiDataGrid-columnHeaderRow": {
                    backgroundColor: `${colors.blueAccent[700]} !important`,
                    },

                    "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                    "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiButton-root": {
                        backgroundColor: colors.greenAccent[700],
                        color: colors.grey[100],
                        "&:hover": {
                            backgroundColor: colors.greenAccent[600],
                        },
                    },
                }}
                >
                    <Button 
                    variant="contained" 
                    color="secondary" 
                    sx={{ mb: 2 }} 
                    onClick={() => navigate("/admin/employees/new")}>
                        <AddIcon sx={{ mr: 1 }} />
                        Добавить сотрудника
                    </Button>
                    <DataGrid checkboxSelection rows={employees} columns={columns} />
            </Box>
        </Box>
    );
};

export default AdminEmployees;