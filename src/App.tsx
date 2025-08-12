import { ThemeProvider } from "@/components/theme-provider";
import { AuthPage } from "./pages/Auth";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthPage />
    </ThemeProvider>
  );
};

export default App;
