import "./App.css";
import { useRoutes } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider } from "@emotion/react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./i18n";
import createTheme from "./theme";
import routes from "./routes";

import useTheme from "./hooks/useTheme";
import createEmotionCache from "./utils/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();
function App({ emotionCache = clientSideEmotionCache }) {

  const content = useRoutes(routes);

  const { theme } = useTheme();

  return (
   <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | speedyjob - Admin Dashboard"
          defaultTitle="speedyjob - Admin Dashboard"
        />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiThemeProvider theme={createTheme(theme)}>
               {content} 
            </MuiThemeProvider>
          </LocalizationProvider>
      </HelmetProvider>
    </CacheProvider>
  );
}

export default App;
