import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { IntlProvider } from "react-intl";
import theme from "assets/theme";
import routes from "routes";
import Img2Img from "./layouts/sections/page-sections/img2img";
import en from "./translations/en.json";
import zh_CN from "./translations/zh_CN.json";
import ja from "./translations/ja.json";

const messages = {
  en: en,
  "zh-CN": zh_CN,
  ja: ja,
};

export default function App() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "en";

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <IntlProvider locale={lang} messages={messages[lang]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {getRoutes(routes)}
          <Route path="/sections/page-sections/img2img" element={<Img2Img />} />
          <Route path="*" element={<Navigate to="/sections/page-sections/img2img" />} />
        </Routes>
      </ThemeProvider>
    </IntlProvider>
  );
}
