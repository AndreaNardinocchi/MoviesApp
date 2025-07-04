// import React, { useState, MouseEvent } from "react";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import Button from "@mui/material/Button";
// import { styled } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import Menu from "@mui/material/Menu";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";

// const styles = {
//   title: {
//     flexGrow: 1,
//   },
// };

// const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

// const SiteHeader: React.FC = () => {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const open = Boolean(anchorEl);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

//   const menuOptions = [
//     { label: "Home", path: "/" },
//     { label: "Upcoming", path: "/movies/upcoming" },
//     { label: "Favorites", path: "/movies/favourites" },
//     { label: "MustWatch", path: "/movies/mustwatchlist" },
//     { label: "Option 3", path: "/" },
//     { label: "Option 4", path: "/" },
//   ];

//   const handleMenuSelect = (pageURL: string) => {
//     navigate(pageURL);
//   };

//   const handleMenu = (event: MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   return (
//     <>
//       <AppBar position="fixed" elevation={0} color="primary">
//         <Toolbar>
//           <Typography variant="h4" sx={styles.title}>
//             TMDB Client
//           </Typography>
//           <Typography variant="h6" sx={styles.title}>
//             All you ever wanted to know about Movies!
//           </Typography>
//           {isMobile ? (
//             <>
//               <IconButton
//                 aria-label="menu"
//                 aria-controls="menu-appbar"
//                 aria-haspopup="true"
//                 onClick={handleMenu}
//                 color="inherit"
//                 size="large"
//               >
//                 <MenuIcon />
//               </IconButton>
//               <Menu
//                 id="menu-appbar"
//                 anchorEl={anchorEl}
//                 anchorOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 open={open}
//                 onClose={() => setAnchorEl(null)}
//               >
//                 {menuOptions.map((opt) => (
//                   <MenuItem
//                     key={opt.label}
//                     onClick={() => handleMenuSelect(opt.path)}
//                   >
//                     {opt.label}
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           ) : (
//             <>
//               {menuOptions.map((opt) => (
//                 <Button
//                   key={opt.label}
//                   color="inherit"
//                   onClick={() => handleMenuSelect(opt.path)}
//                 >
//                   {opt.label}
//                 </Button>
//               ))}
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//       <Offset />
//     </>
//   );
// };

// export default SiteHeader;

// /**
//  * Material Ui allow us to define a style theme for the app which all components inherit -
//  * it provides a default if none is declared. The useTheme hook gives components access to the theme.
//  * Material UI provides the useMediaQuery hook to simplify the implementation of media queries, i.e.
//  * to query properties of the browser/device running the app. We are querying the browser’s viewport
//  * dimensions, checking if they are in the medium (md) or smaller category - a mobile device.
//  * const isMobile = useMediaQuery(theme.breakpoints.down(“md”))
//  * The Theme object includes helper methods that generate the query string necessary to express the media query,
//  * e.g. theme.breakpoints.down().
//  * When the browser/device is a mobile type, the site header should render the drop-down menu;
//  * otherwise, the standard navigation links should render.
//  */

import React, { useState, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

// Creates a div that acts as spacing offset to push content below the fixed AppBar
// https://mui.com/system/styled/
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
/**
 * MUI’s theme.mixins.toolbar provides default height and spacing matching the AppBar height.
 * This component is inserted just after the AppBar so the page content is pushed down,
 * preventing it from being hidden behind the fixed-position AppBar.
 */

const SiteHeader: React.FC = () => {
  /**
   * This hook gives us access to a function that can change the current URL programmatically,
   * without needing <Link> components. Useful for menu navigation handlers.
   */
  const navigate = useNavigate();

  /**
   * Provides access to the Material UI theme object, which holds styling info like colors,
   * typography, breakpoints, and mixins. Here, we use it to get responsive breakpoint info.
   */
  const theme = useTheme(); // Access MUI theme object

  // Detect if the current screen width is 'large' or smaller, to switch layout
  /**
   * Material UI provides the useMediaQuery hook to simplify the implementation of media queries, i.e.
   * to query properties of the browser/device running the app. We are querying the browser’s viewport dimensions,
   * checking if they are in the medium (md) or smaller category - a mobile device.
   * The Theme object includes helper methods that generate the query string necessary to express the media query,
   * When the browser/device is a mobile type, the site header should render the drop-down menu; otherwise, the standard navigation links should render.
   *
   */
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  /**
   * This returns true if the screen width is less than or equal to the 'lg' breakpoint width (usually 1280px).
   * We use this boolean to render a hamburger menu on smaller screens and a full menu on larger screens.
   * This approach adapts the UI responsively for better usability on phones/tablets vs desktops.
   */

  // State to track the anchor element of the mobile hamburger menu (null if closed)
  // https://mui.com/material-ui/react-menu/
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Boolean to check if mobile menu is open
  const open = Boolean(anchorEl);
  /**
   * The Menu component uses an anchor element to position itself. When the menu is open,
   * this state holds the DOM element that was clicked (the hamburger IconButton).
   * When null, it means the menu is closed.
   */

  // State to track the anchor element of the desktop "Movie List" submenu (null if closed)
  const [submenuAnchorEl, setSubmenuAnchorEl] =
    useState<null | HTMLElement>(null);
  // Boolean to check if submenu is open
  const submenuOpen = Boolean(submenuAnchorEl);
  /**
   * Similar to anchorEl, but specifically for the submenu that drops down under the "Movie List" button on desktop.
   * It stores the element that triggered the submenu to position it correctly.
   */

  // Handler to open the mobile hamburger menu by setting anchor element
  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * This function is called when the hamburger icon is clicked.
   * event.currentTarget is the element clicked (IconButton),
   * which is stored in anchorEl state to open the mobile Menu at that element’s position.
   */

  // Handler to close both mobile and submenu menus by clearing their anchor elements
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
  };
  /**
   * Resets both menu anchors to null, effectively closing all open menus.
   * Called on menu close events or after navigation to ensure menus do not stay open.
   */

  // Handler to open the desktop submenu by setting its anchor element
  const handleSubMenu = (event: MouseEvent<HTMLElement>) => {
    setSubmenuAnchorEl(event.currentTarget);
  };
  /**
   * Called when the "Movie List" button on desktop is clicked.
   * Stores the button element in submenuAnchorEl to anchor the submenu to it.
   */

  // Navigate to the given path and close any open menus afterwards
  // https://mui.com/material-ui/react-menu/#basic-menu
  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };
  /**
   * It programmatically changes the URL to the specified path using React Router's navigate.
   * Then closes all menus to ensure clean UI state.
   */

  // List of menu options for mobile view (no dropdowns here)
  const mobileMenuOptions = [
    { label: "Home", path: "/" },
    { label: "Upcoming", path: "/movies/upcoming" },
    { label: "MustWatch", path: "/movies/mustwatchlist" },
    { label: "Favorites", path: "/movies/favourites" },
    { label: "Option 4", path: "/" },
  ];
  /**
   * On mobile, menus are rendered as a flat list inside the hamburger menu for simplicity.
   * No submenus are used here to keep the UI clean and usable on smaller screens.
   */

  // https://mui.com/material-ui/react-menu/
  return (
    <>
      {/* Fixed header bar at the top */}
      <AppBar position="fixed" elevation={0} color="primary">
        <Toolbar>
          {/* Main title, flexGrow pushes remaining content right */}
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </Typography>

          {/* Subtitle, also pushes remaining content right */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            All you ever wanted to know about Movies!
          </Typography>

          {/* Conditional rendering based on screen size */}
          {isMobile ? (
            <>
              {/* Mobile hamburger icon button */}
              <IconButton
                aria-label="menu"
                onClick={handleMenu}
                color="inherit"
                size="large"
              >
                <MenuIcon />
              </IconButton>

              {/* Mobile menu dropdown anchored to hamburger button */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
              >
                {/* Render flat list of mobile menu options */}
                {mobileMenuOptions.map((opt) => (
                  <MenuItem
                    key={opt.label}
                    onClick={() => handleNavigate(opt.path)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              {/* Desktop "Home" button */}
              <Button color="inherit" onClick={() => handleNavigate("/")}>
                Home
              </Button>

              {/* Desktop "Movie List" button that triggers dropdown submenu */}
              <Button
                color="inherit"
                // The onClick won't navigate to anywhere. Instead, it will handle the subMenu
                onClick={handleSubMenu}
                aria-controls={submenuOpen ? "upcoming-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={submenuOpen ? "true" : undefined}
              >
                Movie Lists
              </Button>

              {/* Dropdown submenu anchored to "Movie List" button */}
              <Menu
                id="upcoming-menu"
                anchorEl={submenuAnchorEl}
                open={submenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                {/* Dropdown options under "Movie List" */}
                <MenuItem onClick={() => handleNavigate("/movies/upcoming")}>
                  Upcoming Movies
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigate("/movies/mustwatchlist")}
                >
                  MustWatch Movies
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/movies/nowplaying")}>
                  Now Playing Movies
                </MenuItem>
              </Menu>

              {/* Desktop "Favorites" button */}
              <Button
                color="inherit"
                onClick={() => handleNavigate("/movies/favourites")}
              >
                Favorites
              </Button>
              <Button
                color="inherit"
                onClick={() => handleNavigate("/tvseries")}
              >
                TV Series
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Push page content down so it is not hidden behind fixed AppBar */}
      <Offset />
    </>
  );
};

export default SiteHeader;

/**
 * Material Ui allow us to define a style theme for the app which all components inherit -
 * it provides a default if none is declared. The useTheme hook gives components access to the theme.
 * Material UI provides the useMediaQuery hook to simplify the implementation of media queries, i.e.
 * to query properties of the browser/device running the app. We are querying the browser’s viewport
 * dimensions, checking if they are in the medium (md) or smaller category - a mobile device.
 * const isMobile = useMediaQuery(theme.breakpoints.down(“md”))
 * The Theme object includes helper methods that generate the query string necessary to express the media query,
 * e.g. theme.breakpoints.down().
 * When the browser/device is a mobile type, the site header should render the drop-down menu;
 * otherwise, the standard navigation links should render.
 */
