import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataCustomers } from "../../data/mockData";
import Header from "../components/Header";
import { useTheme } from "@mui/material";

const AdminCustomers = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Имя", flex: 1, cellClassName: "name-column--cell" },
        { field: "phone", headerName: "Телефон", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "registeredAt", headerName: "Дата регистрации", flex: 1 },
        { field: "status", 
            headerName: "Статус", 
            flex: 1,
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
        { field: "ordersCount", headerName: "Количество заказов", flex: 1 },
    ];

    return (
        <Box m="20px">
            <Header title="КЛИЕНТЫ" subtitle="Управление клиентами и их данными" />
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
                  rows={mockDataCustomers} 
                  columns={columns} 
                  showToolbar 
                  slotProps={{
                    toolbar: {
                      csvOptions: { 
                        fileName: "Клиенты_пекарни", 
                        delimiter: ";", 
                        utf8WithBom: true 
                      },
                    },
                  }} />
            </Box>
        </Box>
    );
};

export default AdminCustomers;