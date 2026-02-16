import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataCategories } from "../data/mockData";
import Header from "../components/Header";
import { useTheme } from "@mui/material";


const AdminCategories = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const getStatusBg = (status, productsCount) => {
        if (status === "Активен" && productsCount > 0) return colors.greenAccent[700];
        return colors.redAccent[700]; 
    }

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название категории", flex: 1, cellClassName: "name-column--cell" },
        { field: "description", headerName: "Описание", flex: 1 },
        { field: "productsCount", headerName: "Количество продуктов", flex: 1, align: "center", headerAlign: "center" },
        { field: "status", headerName: "Статус", 
            flex: 1,
            align: "center", 
            headerAlign: "center",
            renderCell: ({ row }) => {
              const { status, productsCount } = row;

              return (
                <Box
                  width="60%"
                  m="10px auto"
                  p="5px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={getStatusBg(status, productsCount)}
                  borderRadius="4px"
                  sx={{
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": { opacity: 0.9 },
                  }}
                  title="Нажмите, чтобы изменить статус"
                  
                >
                  <Typography color={colors.grey[100]}>
                    {status === "Активен" && productsCount > 0
                      ? "Активен"
                      : "Неактивен"}
                  </Typography>
                </Box>
              );
            },

        },
   ];

    return (
        <Box m="20px">
            <Header title="КАТЕГОРИИ" subtitle="Управление категориями и их данными" />
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
                  rows={mockDataCategories} 
                  columns={columns} 
                  showToolbar 
                  slotProps={{
                    toolbar: {
                      csvOptions: { 
                        fileName: "Категории_пекарни", 
                        delimiter: ";", 
                        utf8WithBom: true 
                      },
                    },
                  }} />
            </Box>
        </Box>
    );
};

export default AdminCategories;