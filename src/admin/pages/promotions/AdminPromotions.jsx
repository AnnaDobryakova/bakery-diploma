import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { mockDataPromotions } from "../../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const AdminPromotions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Название акции", flex: 1, cellClassName: "name-column--cell" },
        { field: "type", headerName: "Тип акции", flex: 1 },
        { field: "value", headerName: "Значение", flex: 1 },
        { field: "period",
          headerName: "Период",
          flex: 1.2,
          valueGetter: (_value, row) => `${row.startDate} — ${row.endDate}`},
        { field: "status", headerName: "Статус", 
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
                    : status === "Запланирован"
                    ? colors.blueAccent[600]
                    : status === "Неактивен"
                    ? colors.redAccent[700]
                    : colors.grey[600]
                  }
                  borderRadius="4px"
                  sx={{
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": { opacity: 0.9 },
                  }}
                  title="Нажмите, чтобы изменить статус"
                  
                >
                  <Typography color={colors.grey[100]}>
                    {status === "Активен"
                      ? "Активен"
                      : status === "Запланирован"
                      ? "Запланирован"
                      : status === "Неактивен"
                      ? "Неактивен"
                      : "Неизвестный статус"}
                  </Typography>
                </Box>
              );
            },

        },
        { field: "limitations", headerName: "Ограничения", flex: 1 },
      ];

    return (
        <Box m="20px">
            <Header title="АКЦИИ" subtitle="Управление скидками и специальными предложениями" />
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
                  rows={mockDataPromotions} 
                  columns={columns} 
                  showToolbar 
                  slotProps={{
                    toolbar: {
                      csvOptions: { 
                        fileName: "Акции_пекарни", 
                        delimiter: ";", 
                        utf8WithBom: true 
                      },
                    },
                  }} />
            </Box>
        </Box>
    );
};

export default AdminPromotions;