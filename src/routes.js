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

/** 
  All of the routes for the Material Kit 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Navbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `name` key is used for the name of the route on the Navbar.
  2. The `icon` key is used for the icon of the route on the Navbar.
  3. The `collapse` key is used for making a collapsible item on the Navbar that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  4. The `route` key is used to store the route location which is used for the react router.
  5. The `href` key is used to store the external links location.
  6. The `component` key is used to store the component of its route.
  7. The `dropdown` key is used to define that the item should open a dropdown for its collapse items .
  8. The `description` key is used to define the description of
          a route under its name.
  9. The `columns` key is used to define that how the content should look inside the dropdown menu as columns,
          you can set the columns amount based on this key.
  10. The `rowsPerColumn` key is used to define that how many rows should be in a column.
*/

// @mui material components
import Icon from "@mui/material/Icon";

// @mui icons
import GitHubIcon from "@mui/icons-material/GitHub";

import Img2Img from "layouts/sections/page-sections/img2img";
import LineDrawingCutout from "./layouts/sections/page-sections/line-drawing-cutout";
import Normal from "./layouts/sections/page-sections/normal";
import Light from "./layouts/sections/page-sections/light";
import AnimeShadow from "./layouts/sections/page-sections/anime-shadow";
import Resize from "./layouts/sections/page-sections/resize";
import LineartTransparent from "./layouts/sections/page-sections/line-drawing-transparent";
import ColorScheme from "./layouts/sections/page-sections/color-scheme";
import ObjectRemover from "./layouts/sections/page-sections/object-remover";
import BackgroundRemover from "./layouts/sections/page-sections/background-remover";
import Coloring from "./layouts/sections/page-sections/coloring";
import PositiveNegativeShape from "./layouts/sections/page-sections/positive-negative-shape";
import LineDrawing from "layouts/sections/page-sections/line-drawing";

const routes = [
  {
    name: "img2img",
    route: "/sections/page-sections/img2img",
    icon: <Icon>image</Icon>,
    component: <Img2Img />,
    columns: 1,
    rowsPerColumn: 2,
  },
  {
    name: "lineDrawing",
    icon: <Icon>gesture</Icon>,
    collapse: [
      {
        name: "line-drawing",
        route: "/sections/page-sections/line-drawing",
        component: <LineDrawing />,
      },
      {
        name: "line-drawing-cutout",
        route: "/sections/page-sections/line-drawing-cutout",
        component: <LineDrawingCutout />,
      },
    ],
  },
  {
    name: "shadow",
    icon: <Icon>draw</Icon>,
    collapse: [
      {
        name: "normal",
        route: "/sections/page-sections/normal",
        component: <Normal />,
      },
      {
        name: "light",
        route: "/sections/page-sections/light",
        component: <Light />,
      },
      {
        name: "anime-shadow",
        route: "/sections/page-sections/anime-shadow",
        component: <AnimeShadow />,
      },
    ],
  },
  {
    name: "color",
    icon: <Icon>palette</Icon>,
    collapse: [
      {
        name: "color-scheme",
        route: "/sections/page-sections/color-scheme",
        component: <ColorScheme />,
      },
      {
        name: "coloring",
        route: "/sections/page-sections/coloring",
        component: <Coloring />,
      },
    ],
  },
  {
    name: "tools",
    icon: <Icon>build</Icon>,
    collapse: [
      {
        name: "resize",
        route: "/sections/page-sections/resize",
        component: <Resize />,
      },
      {
        name: "line-drawing-transparent",
        route: "/sections/page-sections/line-drawing-transparent",
        component: <LineartTransparent />,
      },
      {
        name: "positive-negative-shape",
        route: "/sections/page-sections/positive-negative-shape",
        component: <PositiveNegativeShape />,
      },
      {
        name: "object-remover-todo",
        route: "/sections/page-sections/object-remover",
        component: <ObjectRemover />,
      },
      {
        name: "background-remover-todo",
        route: "/sections/page-sections/background-remover",
        component: <BackgroundRemover />,
      },
    ],
  },
  {
    name: "github",
    icon: <GitHubIcon />,
    href: "https://www.github.com/jtydhr88/ai-assistant-web",
  },
];

export default routes;
