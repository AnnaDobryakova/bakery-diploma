import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataProducts } from "../data/mockData";
import Header from "../components/Header";
import { useTheme } from "@mui/material";

const AdminProducts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "imageURL", headerName: "Фото", flex: 0.5, renderCell: ({ row: { imageURL } }) => {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                    <img src={imageURL} alt="product" width="50px" height="50px" style={{ objectFit: "cover" }} />
                </Box>
            );
        }},
        { field: "name", headerName: "Название продукта", flex: 1, cellClassName: "name-column--cell" },
        { field: "category", headerName: "Категория", flex: 1 },
        { field: "price", headerName: "Цена", flex: 1 },
        { field: "available", 
            headerName: "В наличии", 
            flex: 1,
            renderCell: ({ row: { remainder } }) => {
                
                const inStock = Number(remainder) > 0;
                const bg = inStock ? colors.greenAccent[700] : colors.redAccent[700];
                
                return (
                    <Box width="60%" m="10px auto" p="5px" display="flex" alignItems="center" justifyContent="center" 
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
        { field: "remainder", headerName: "Остаток", flex: 1 },
        { field: "updateDate", headerName: "Дата обновления", flex: 1 },
    ];

    return (
        <Box m="20px">
            <Header title="ТОВАРЫ" subtitle="Управление товарами и их данными" />
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
                  rows={mockDataProducts} 
                  columns={columns} 
                  showToolbar 
                  slotProps={{
                    toolbar: {
                      csvOptions: { 
                        fileName: "Товары_пекарни", 
                        delimiter: ";", 
                        utf8WithBom: true 
                      },
                    },
                  }} />
            </Box>
        </Box>
    );
};

export default AdminProducts;