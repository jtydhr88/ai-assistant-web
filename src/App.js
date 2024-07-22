/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect } from "react";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { IntlProvider } from "react-intl";
import theme from "assets/theme";

import routes from "routes";
import Img2Img from "./layouts/sections/page-sections/img2img";

import en from "./translations/en.json";
import zh_CN from "./translations/zh_CN.json";
import zh_TW from "./translations/zh_TW.json";
import ja from "./translations/ja.json";

const messages = {
  en: en,
  "zh-CN": zh_CN,
  "zh-TW": zh_TW,
  ja: ja,
};

export default function App() {
  const lang = "zh-CN";

  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
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
