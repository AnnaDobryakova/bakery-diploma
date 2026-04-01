import { Outlet } from "react-router-dom";
import { useState } from "react";
import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import Topbar from "../admin/components/global/Topbar";
import Sidebar from "./components/global/Sidebar";
import { AdminSearchProvider } from "../context/AdminSearchContext";

export default function AdminLayout() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true); 

  return (
    <AdminSearchProvider>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
          <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <Sidebar isSidebar={isSidebar} />

          <Box
            component="admin_main"
            className="admin_content"
            sx={{
              flexGrow: 1,
              minWidth: 0,      
              overflow: "auto", 
              p: 3,
            }}
          >
            <Topbar setIsSidebar={setIsSidebar} />
            <Outlet />
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </AdminSearchProvider>
  );
}
