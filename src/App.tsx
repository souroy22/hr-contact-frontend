import { FC } from "react";
import RouterComponent from "./routers/router";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";

const App: FC = () => {
  const theme = createTheme({
    palette: {
      action: {
        hover: "#f0f0f0", // Ensure hover color is set here
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
