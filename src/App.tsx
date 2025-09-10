import { ThemeProvider } from "@/components/theme-provider";
import { RouterApp } from "./routes/routes";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterApp />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default App;
